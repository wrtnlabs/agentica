# Agentica CLI/Create Scaffold 현재 구조

## 근거 파일

- `packages/cli/package.json`
- `packages/cli/bin/index.mjs`
- `packages/cli/src/index.ts`
- `packages/cli/src/commands/start.ts`
- `packages/cli/src/connectors.ts`
- `packages/cli/src/packages.ts`
- `packages/cli/src/fs.ts`
- `packages/cli/src/utils.ts`
- `packages/cli/src/*.test.ts`
- `packages/cli/src/commands/start.test.ts`
- `packages/cli/vitest.config.mts`
- `packages/cli/vitest.setup.ts`
- `packages/cli/mocks/server/*`
- `packages/cli/build.config.ts`
- `packages/create-agentica/package.json`
- `packages/create-agentica/index.js`

## Package Surface

`packages/cli`는 npm package name이 `agentica`이고 CLI binary는 `bin/index.mjs`다. binary는 build output인 `dist/index.mjs`의 `run()`을 호출한다.

`packages/create-agentica`는 별도 구현이 거의 없는 alias package다.

```javascript
#!/usr/bin/env node
import { run } from 'agentica';

await run();
```

따라서 `npx create-agentica` 계열 진입점은 결국 `agentica` CLI와 같은 command surface를 쓴다. scaffold 기능을 바꾸면 두 package의 사용자 경험이 같이 바뀐다.

## CLI Command Surface

`src/index.ts`는 `commander`로 command를 구성한다.

- `--version`
- `start`
- `start --project <project>`

`--project` choices는 `START_TEMPLATES`에 묶여 있다.

- `nodejs`
- `nestjs`
- `react`
- `react-native`
- `standalone`
- `nestjs+react`
- `nodejs+react`

`start` command action은 `@clack/prompts.intro()`를 한 번 호출하고 `start({ template })`를 호출한다. `start()` 내부에서도 `p.intro("Agentica Start Wizard")`를 다시 호출한다. 즉 현재 구현상 intro가 중복될 수 있다.

## Interactive Context

`askQuestions()`는 다음 context를 만든다.

```typescript
interface Context {
  projectAbsolutePath: string;
  packageManager: PackageManager;
  template: StarterTemplate;
  services: Service[];
  envList?: EnvInfo[];
  openAIKey: string | null;
  port?: number;
}
```

질문 순서:

1. project relative path
2. package manager: npm/yarn/pnpm/bun
3. template type
4. port: standalone 제외
5. connectors: react 제외
6. selected connector env vars
7. OpenAI API key

검증:

- project path는 빈 문자열 금지, `.`로 시작하는 relative path만 허용, 기존 경로 금지
- port는 `parseInt` 기준 숫자면 허용
- context shape는 tagged type을 unwrap한 뒤 `typia.assertGuard`로 검증

Agentica Next 설정을 wizard에 추가하려면 `Context`, prompt flow, typia guard, setup functions, tests를 모두 맞춰야 한다.

## Template Setup Functions

모든 setup은 `downloadTemplateAndPlaceInProject()`로 GitHub template repository를 받는다.

```typescript
downloadTemplate(`wrtnlabs/agentica.template.${template}`, {
  provider: "github",
  dir: project,
});
```

다운로드 뒤 `.github` directory를 제거한다.

### Standalone

`setupStandAloneProject()`:

- template: `standalone`
- 수정 파일: `src/index.ts`
- connector import/controller placeholder 삽입
- `.env`: `OPENAI_API_KEY` + connector envs
- selected connector packages install
- `prepare` script 실행

### NodeJS

`setupNodeJSProject()`:

- template: `nodejs`
- 수정 파일: `src/index.ts`
- services가 있으면 `BbsArticleService` import와 기존 controllers array를 regex로 제거/치환
- `.env`: `OPENAI_API_KEY`, `PORT`, connector envs
- selected connector packages install
- `prepare` script 실행

### NestJS

`setupNestJSProject()`:

- template: `nestjs`
- 수정 파일: `src/controllers/chat/ChatController.ts`
- services가 있으면 `BbsArticleService` import와 기존 controllers array를 regex로 제거/치환
- `.env`: `OPENAI_API_KEY`, `API_PORT`, connector envs
- selected connector packages install
- `prepare` script 실행

### React

`setupReactProject()`:

- template: `react`
- `.env`: `OPENAI_API_KEY`, `VITE_AGENTICA_WS_URL=ws://localhost:${port}/chat`
- selected connector packages install 호출은 하지만 prompt flow상 `react` template은 connector 선택을 건너뛴다.
- `prepare`는 실행하지 않는다.

### React Native

`setupReactNativeProject()`:

- template: `react-native`
- `.env`: `OPENAI_API_KEY`
- connector packages install
- `prepare`는 실행하지 않는다.

### Combined Templates

`nestjs+react`:

- `server`: `setupNestJSProject`
- `client`: `setupReactProject`

`nodejs+react`:

- `server`: `setupNodeJSProject`
- `client`: `setupReactProject`

같은 `Context`를 server/client에 공유한다. 따라서 port와 OpenAI key가 server/client `.env`에 각각 목적에 맞게 들어간다.

## Connector Codegen

connector source는 GitHub raw JSON이다.

```text
https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json
```

shape:

```typescript
interface ConnectorInfo {
  name: `@wrtnlabs/connector-${Service}`;
  envList: Env[];
}
```

helper:

- `serviceToConnector("google-map")` -> `@wrtnlabs/connector-google-map`
- `connectorToService("@wrtnlabs/connector-google-map")` -> `google-map`
- display name: hyphen을 space로 바꾸고 uppercase
- TypeScript class name: `capitalize("aws-s3")` -> `AwsS3`

generated import:

```typescript
import { GoogleMapService } from "@wrtnlabs/connector-google-map";
```

generated controller:

```typescript
{
name: "GoogleMap Connector",
protocol: "class",
application: typia.llm.application<GoogleMapService>(),
execute: new GoogleMapService(),
}
```

`insertCodeIntoAgenticaStarter()`는 placeholder를 찾아 detect-indent 기반으로 code를 넣는다.

- `/// INSERT IMPORT HERE`
- `/// INSERT CONTROLLER HERE`

주의:

- connector service name과 export class naming convention이 맞아야 한다.
- placeholder나 template controller array 모양이 바뀌면 regex replacement가 깨질 수 있다.
- generated controller는 runtime option/policy/selector config를 넣을 공간이 현재 없다.

## Env와 Package Manager

`writeEnvKeysToDotEnv()`는 `.env`가 있으면 newline 뒤에 `KEY=value`를 append하고, 없으면 새 파일을 만든다.

주의:

- value quoting/escaping을 하지 않는다.
- 같은 key 중복 제거를 하지 않는다.
- secret 입력값을 별도 secure storage로 다루지 않는다.

package manager command:

| manager | install all | install package | run command |
| --- | --- | --- | --- |
| npm | `npm install` | `npm install <pkg>` | `npm run <command>` |
| yarn | `yarn` | `yarn add <pkg>` | `yarn <command>` |
| pnpm | `pnpm install` | `pnpm install <pkg>` | `pnpm <command>` |
| bun | `bun install` | `bun install <pkg>` | `bun <command>` |

package manager detection은 `npm_config_user_agent` prefix 기반이고, 알 수 없으면 npm으로 fallback한다.

## Build와 Test

CLI build는 `unbuild`를 사용한다.

- entry: `src/index.ts`
- output: `dist`
- Node target: ES2022, Node 18
- typia rollup plugin을 첫 plugin으로 삽입
- commander, clack, nano-spawn, giget, typia 등은 inlineDependencies에 포함

Vitest setup:

- typia vite plugin
- globals enabled
- MSW server로 connectors-list raw URL mock
- GitHub API repo URL은 unhandled request allowlist

테스트 범위:

- `index.test.ts`: version/start command, invalid project option
- `connectors.test.ts`: connector list fetch, service/package naming, codegen
- `packages.test.ts`: install/run command, package manager detection
- `fs.test.ts`: create directory, `.env` append/write behavior using memfs
- `utils.test.ts`: capitalize, insertWithIndent
- `start.test.ts`: 실제 template download + install integration for standalone/nodejs/nestjs/react across npm/pnpm/bun; yarn todo

현재 test gap:

- `askQuestions()` interactive prompt flow는 직접 테스트하지 않는다.
- `react-native`, `nestjs+react`, `nodejs+react` setup path는 integration test에 없다.
- connector env var prompt cancellation path는 테스트하지 않는다.
- `.env` escaping/duplicate behavior는 정책으로 검증하지 않는다.

## Agentica Next 적용 결론

1. CLI scaffold는 Agentica Next config를 사용자에게 노출하는 첫 관문이다.
2. runtime/selector/compact config를 추가하려면 template repository, placeholder, codegen, `.env`, tests를 함께 바꿔야 한다.
3. core public API가 안정되기 전에는 CLI default template에 experimental runtime을 켜면 안 된다.
4. connector codegen은 class controller convention에 강하게 묶여 있으므로 capability registry/plugin 설계를 바로 이식하기 어렵다.
5. create-agentica는 alias package라 별도 migration surface가 작지만, CLI command 이름과 README는 같이 갱신해야 한다.
6. combined server/client templates는 server runtime config와 client RPC/chat config를 나눠 주입해야 한다.
7. `.env` writer는 단순 append 방식이므로 secret/complex value/duplicate key를 다루는 Agentica Next 설정에는 보강이 필요하다.
