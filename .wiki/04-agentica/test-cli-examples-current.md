# Agentica Test CLI/Examples 현재 구조

## 근거 파일

- `test/package.json`
- `test/src/index.ts`
- `test/src/TestGlobal.ts`
- `test/src/cli/index.ts`
- `test/src/cli/micro.ts`
- `test/src/examples/websearch.ts`
- `test/src/examples/websocket-client-hook.ts`
- `test/src/examples/websocket-client-main.ts`
- `test/src/examples/internal/IWrtnWebSearchApplication.ts`
- `test/src/internal/BbsArticleService.ts`
- `test/src/internal/IBbsArticle.ts`
- `test/src/utils/ConsoleScanner.ts`

## Test Package Surface

`@agentica/test`는 private package이며 main script는 다음과 같다.

- `pnpm start`: `ts-node src`
- `pnpm build`: `tsc --noEmit`
- `pnpm lint`: `eslint .`

`src/index.ts`만 `DynamicExecutor.validate()`로 자동 feature tests를 실행한다. `src/cli/*`와 `src/examples/*`는 자동 runner 대상이 아니라 수동 실행용 script/example이다.

`TestGlobal.ts`는 `.env`를 읽어 typia로 env shape를 검증한다.

환경 변수:

- `CHATGPT_API_KEY`
- `CHATGPT_BASE_URL`
- `CHATGPT_OPTIONS`
- `OPENROUTER_API_KEY`

`.env` 파일은 존재하지만 민감값을 문서에 복사하지 않는다.

## CLI Scripts

### `test/src/cli/index.ts`

Agentica + shopping backend manual CLI다.

흐름:

1. `CHATGPT_API_KEY`가 없으면 message를 출력하고 종료한다.
2. GitHub raw shopping swagger를 fetch한다.
3. `OpenApiConverter.upgradeDocument`와 `HttpLlm.application`으로 HTTP LLM application을 만든다.
4. `/shoppings/customers` path만 남긴다.
5. shopping backend에 customer authenticate/create + activate handshake를 수행한다.
6. `Agentica`를 구성한다.
7. initialize/select/call/execute/cancel event를 console에 출력한다.
8. execute event마다 `logs/{function.name}.log`에 arguments/response를 쓴다.
9. `ConsoleScanner`로 반복 입력을 받고 `$exit`, `$usage` command를 처리한다.

주의:

- 자동 테스트가 아니라 interactive/manual script다.
- external GitHub raw swagger와 shopping backend에 의존한다.
- `logs` directory가 없으면 execute log write에서 실패할 수 있다.
- `href` 값에 `htts://127.0.0.1/NodeJS` typo가 있지만 backend auth payload의 참고값으로만 보인다.
- Agentica Next selector/result budget 변경 후 shopping real flow를 수동 재현하는 데 유용하다.

### `test/src/cli/micro.ts`

MicroAgentica + BBS class controller manual CLI다.

흐름:

1. `CHATGPT_API_KEY`가 없으면 message를 출력하고 종료한다.
2. `typia.llm.controller<BbsArticleService>("bbs", new BbsArticleService())`로 class controller를 만든다.
3. `MicroAgentica`를 구성한다.
4. assistant/call/execute event를 console에 출력한다.
5. execute event마다 `logs/{function.name}.log`에 arguments/response를 쓴다.
6. `ConsoleScanner`로 `$exit`, `$usage`와 일반 conversation을 처리한다.

이 script는 `MicroAgentica` 비변경 회귀를 사람이 확인하는 표면이다. Agentica Next runtime 기능을 여기에 연결하면 안 된다.

## Example Scripts

### `examples/websearch.ts`

MicroAgentica custom class application example이다.

- `typia.llm.application<IWrtnWebSearchApplication>()`로 schema를 만든다.
- controller execute는 `search(props)`를 구현하고 console에 props를 출력한다.
- config에서 `executor.describe = null`로 describe를 끈다.
- `systemPrompt.common`과 `systemPrompt.execute`를 빈 문자열로 override한다.
- conversation 후 execute history를 JSON으로 출력한다.

의미:

- describe 없는 MicroAgentica function call path를 보여준다.
- custom system prompt override가 빈 문자열이어도 tool execution이 되는지 보는 재현 script다.
- Agentica Next가 `MicroAgentica` prompt/describe path를 바꾸지 않았는지 확인하는 보조 표면이다.

### `examples/websocket-client-main.ts`

RPC WebSocket client example이다.

- `WebSocketConnector<null, IAgenticaRpcListener, IAgenticaRpcService>`를 만든다.
- listener는 `assistantMessage`, `select`, `execute`, `describe`를 console 출력한다.
- `ws://localhost:3001`에 연결한다.
- `driver.conversate("Hello, what you can do?")`를 호출한다.
- 작업 후 connector를 닫는다.

의미:

- server는 이 repo script 안에 포함되어 있지 않고 별도 실행되어야 한다.
- RPC listener의 public event subset을 수동 확인하는 example이다.
- compact/task/remote event를 RPC에 추가할 때 기존 listener shape와 ordering을 깨지 않아야 한다.

### `examples/websocket-client-hook.ts`

더 작은 RPC WebSocket client example이다.

- listener는 `userMessage`, `assistantMessage`, `describe`만 제공한다.
- `driver.conversate("I wanna create an article with file uploading.")`를 호출한다.

의미:

- partial listener object가 정상 동작하는지 보여주는 사용 예다.
- optional listener 추가 시 기존 minimal listener가 깨지면 안 된다.

## Internal Fixtures

### BBS Fixture

`test/src/internal/BbsArticleService.ts`와 `IBbsArticle.ts`는 in-memory CRUD class controller다.

functions:

- `index(): IBbsArticle[]`
- `create({ input }): IBbsArticle`
- `update({ id, input }): void`
- `erase({ id }): void`

DTO 특징:

- `id`: UUID format tag
- `created_at`, `updated_at`: date-time format tag
- `thumbnail`: `null` 또는 image URI/content media type tag
- `IUpdate`: `Partial<ICreate>`

의미:

- class controller schema generation, format tags, nullable URI, partial update DTO, void return을 함께 다룬다.
- MicroAgentica와 chat BBS example이 같은 성격의 fixture를 쓴다.
- local selector tokenizer/scorer 테스트를 만들 때 class method name/description/DTO field source로 재사용하기 좋다.

### Web Search Fixture

`IWrtnWebSearchApplication`은 단일 `search({ keyword })` 함수만 가진다.

의미:

- 작은 function catalog에서 model이 keyword argument를 구성하는지 보는 최소 fixture다.
- describe disabled path와 함께 MicroAgentica regression에 적합하다.

### ConsoleScanner

`ConsoleScanner.read(question)`은 매 호출마다 `readline.createInterface`를 만들고 한 줄 입력 후 close한다. CLI scripts만 사용하는 작은 helper다.

## Agentica Next 적용 결론

1. `test/src/features`는 자동 e2e gate, `test/src/cli`와 `test/src/examples`는 수동 재현 harness로 구분한다.
2. Agentica shopping CLI는 external swagger/backend/API key에 의존하므로 deterministic CI gate가 아니다.
3. Micro CLI와 websearch example은 `MicroAgentica` 비변경 수동 회귀 표면이다.
4. RPC WebSocket examples는 optional listener compatibility와 event ordering을 보존해야 하는 public surface 예시다.
5. BBS internal fixture는 class controller, format tag, nullable field, partial DTO, void return regression에 재사용할 수 있다.
6. result budget/compact 구현 뒤에는 `logs` 출력과 execute value reference/preview 구조가 충돌하지 않는지 확인해야 한다.
