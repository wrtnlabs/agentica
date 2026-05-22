# Agentica Website/Docs/Articles 현재 구조

## 독해 범위

확인한 범위:

- `website/package.json`, `next.config.ts`, `app/*`, `build/*`, `content/*`, `components/*`, `public/articles/*`
- `website/content/docs/**`: setup, concepts, core, websocket, plugins
- `website/content/tutorial/**` 중 CLI/tutorial command surface 검색
- 루트 `articles/*.md`
- 루트 `docs/AgenticaFN.png`

이번 문서는 사용자-facing 문서와 배포 표면이 Agentica Next 설계에 어떤 제약을 주는지만 정리한다. 구현 source는 변경하지 않았다.

## Website 빌드와 배포 구조

`website`는 `@agentica/website` 패키지이며 Next 15/Nextra 4 기반 정적 문서 사이트다.

핵심 설정:

- `next.config.ts`: `nextra()` wrapper, `basePath: "/agentica"`, `output: "export"`, `trailingSlash: true`, image unoptimized.
- `app/layout.jsx`: Nextra docs `Layout`, `Navbar`, `getPageMap` 사용. `docsRepositoryBase`는 `https://github.com/wrtnlabs/agentica/tree/main/website`.
- `app/[[...mdxPath]]/page.jsx`: `generateStaticParamsFor("mdxPath")`와 `importPage()`로 MDX page를 정적으로 import한다. root path는 MDXContent를 직접 렌더링하고, 나머지는 Nextra wrapper를 씌운다.
- `content/_meta.ts`: root landing은 hidden full layout, docs/tutorial/playground/snippets/article redirect surface를 노출한다.
- `next-sitemap.config.js`: site URL은 `https://wrtnlabs.io/agentica`, output은 `./out`.

빌드 전처리:

- `build/playground.js`: `packages/chat`에서 `npm run build:static`을 실행하고 `packages/chat/dist`를 `website/public/playground`로 복사한다. 따라서 website build는 chat playground static output과 결합되어 있다.
- `build/typedoc.js`: 외부 `openapi`, `typia` TypeDoc JSON을 fetch하고, local `packages/benchmark`, `packages/core`, `packages/rpc`만 TypeDoc JSON으로 변환해 `public/api`에 merge한다.
- `packages/chat`, `packages/cli`, `packages/vector-selector`는 현재 TypeDoc website API build 대상이 아니다.
- `build/deploy.js`: `cwd: __dirname`에서 `npm run build`를 실행한 뒤 `${__dirname}/../public`을 `gh-pages`에 publish한다. 현재 Next static export 기본 산출물인 `out`과 publish 대상이 맞지 않고, `cwd`도 `website/build`라서 stale script일 가능성이 높다. 실제 배포 경로는 구현 전에 재검증해야 한다.

검색/배포 보조:

- `postbuild:pagefind`는 `.next/server/app`을 site input으로 삼아 `out/_pagefind`를 만든다.
- `postbuild:sitemap`은 `next-sitemap`을 실행한다.
- 정적 export, pagefind, sitemap, basePath가 한 번에 맞아야 하므로 docs route 추가는 build 검증이 필요하다.

## 문서 네비게이션

Docs navigation:

- Setup: `cli`, `manual`, `react-native`
- Concepts: `function-calling`, `compiler-driven-development`, `document-driven-development`
- Core: `index`, `controller/*`, `vendor`, `config`, `event`, `history`, `micro`
- WebSocket: `index`, `nodejs`, `nestjs`, `client`
- Plugins: `benchmark`, `openai-vector-store`, `vector-selector`
- Appendix: roadmap, related, API link

Tutorial navigation은 enterprise/productivity/react-native/coding 예제를 포함하고, productivity 예제 다수는 `npx agentica start <name>` CLI flow를 전제로 한다.

`website/public/articles/*.html`은 실제 article 본문이 아니라 Dev.to redirect wrapper다. Reddit에서 dev.to domain link가 shadow ban된다는 설명과 refresh meta tag를 가진다. 루트 `articles/*.md`는 별도 long-form 원고이며 Nextra content tree에 직접 연결되어 있지 않다.

## 현재 문서가 말하는 공개 계약

Function calling concept:

- Agentica는 LLM function calling 특화 framework로 설명된다.
- OpenAPI/Swagger, TypeScript class, compiler-generated schema, validation feedback이 핵심 가치로 반복된다.
- Orchestration은 `selector -> caller -> describer` 구조로 설명된다.
- 사용자는 복잡한 workflow/agent graph를 설계하지 않고 function/controller를 나열한다는 메시지가 강하다.

Core/history docs:

- `history.mdx`는 history archive/restore를 안내하며 token cost를 줄이려면 일부 history를 요약하거나 `select`/`execute`를 제거하고 `describe`를 유지할 수 있다고 설명한다.
- 현재 source의 `AgenticaHistory` union은 `userMessage`, `assistantMessage`, `systemMessage`, `select`, `cancel`, `execute`, `describe`다.
- 그러나 docs/snippet 일부는 과거 `AgenticaHistory.Text`, `type: "text"`, `role: "assistant" | "user"` 표현을 남기고 있다. Agentica Next에서 compact/history를 손대기 전 문서와 snippet의 current contract 정리가 선행되어야 한다.

Core/event docs:

- 현재 source의 `AgenticaEvent.Type`은 `userMessage`, `assistantMessage`, `initialize`, `select`, `call`, `cancel`, `execute`, `describe`, `validate`, `jsonParseError`, `request`, `response`다.
- `event.mdx`와 `micro.mdx`는 여전히 `agent.on("text", ...)`, `AgenticaEvent.Text.stream`, `AgenticaEvent.Text.join()` 예시를 사용한다.
- RPC source는 `assistantMessage`와 `userMessage`를 사용한다. docs의 `text` listener 예시는 stale contract다.

RPC/WebSocket docs:

- `@agentica/rpc`는 TGrid WebSocket RPC wrapper로 설명된다.
- docs 예시는 `IAgenticaRpcListener`에 `text`, `describe`, `select`, `execute`, `call`을 둔다.
- 실제 `IAgenticaRpcListener`는 mandatory `describe`, `assistantMessage`, optional `userMessage`, `initialize`, `select`, `cancel`, `call`, `execute`다.
- `AgenticaRpcService`는 `assistantMessage`와 `describe`를 `join()`한 뒤 JSON event를 listener로 보낸다. 즉 RPC도 현재는 final text forwarding 중심이다.

CLI docs:

- `setup/cli.mdx`는 `npx agentica start <directory> --manager pnpm/yarn`을 안내한다.
- 현재 `packages/cli/src/commands/start.ts`는 directory positional argument와 `--manager` option을 구현하지 않고 prompt로 project path/package manager를 묻는다.
- docs는 project type을 네 개라고 설명하지만 현재 `START_TEMPLATES`는 standalone, nodejs, nestjs, react, react-native, server-client-node, server-client-nest의 일곱 개다.
- docs는 embedded controllers prompt를 NodeJS/NestJS에 한정한다고 설명하지만 현재 CLI는 `react` template만 제외하고 connector 선택을 묻는다.
- tutorial 문서 다수도 `npx agentica start <name>`을 전제로 하므로 CLI 문서와 template contract의 동시 정리가 필요하다.

Vector selector docs:

- `plugins/vector-selector.mdx`는 `@agentica/vector-selector` 설치, PostgreSQL/connector-hive, SQLite/better-sqlite3/sqlite-vec, custom strategy를 설명한다.
- token 절감과 정확도 개선 수치를 benchmark repository 기준으로 제시한다.
- `config.mdx`와 `core/index.mdx` 일부는 과거 `@agentica/pg-vector-selector`와 `/docs/plugins/pg-vector-selector` 링크를 사용한다. 현재 package는 `@agentica/vector-selector`이고 docs route도 `/docs/plugins/vector-selector`다.
- `openai-vector-store.mdx`는 YouTube embed만 있어 실질 API/설정 설명이 없다.

MicroAgentica docs:

- `micro.mdx`는 MicroAgentica가 selector가 없는 경량 경로이며, 함수가 8개 미만이면 유리하고 8개 초과면 Agentica를 권장한다고 설명한다.
- 이 문서는 사용자의 비변경 요구와 일치한다. Agentica Next 문서는 MicroAgentica를 selector/compact/local RAG 실험 대상에서 명시적으로 제외해야 한다.
- 단, event 예시는 `text` listener를 사용하므로 contract 정리는 필요하다. 이것은 문서 정정이지 MicroAgentica runtime 변경 사유가 아니다.

## Articles 표면

루트 `articles` 세 파일은 제품 문서라기보다 외부 게시용 positioning 원고다.

- `i-made-mcp-alternative-solution-for-openai-and-all-other-llms.md`: MCP alternative, function calling, OpenAPI conversion, validation feedback, compiler-generated schema, `selector/caller/describer` orchestration을 설명한다. Agentica가 "복잡한 agent graph/workflow 없이 function calling으로 해결"한다는 메시지를 강하게 둔다.
- `new-backend-development-paradigm-in-the-new-ai-era.md`: backend OpenAPI 문서가 AI chatbot의 핵심 contract가 되고, compiler 기반 Swagger/OpenAPI generator가 필요하다는 narrative다. `@agentica/core`, `@samchon/openapi`, `typia`, `nestia`, `autoview`를 연결한다.
- `typia-accomplished-agentic-ai-with-typescript-compiler-enhanced-function-calling.md`: 초안 수준이며 section만 있고 본문이 거의 없다.

Agentica Next의 공개 설명은 이 positioning을 뒤집지 않아야 한다. Claude Code식 runtime, context compact, local RAG, policy/state를 도입하더라도 사용자 메시지는 "workflow graph를 요구하지 않는 function-calling-first runtime"이어야 한다.

## Agentica Next 적용 영향

문서 설계 원칙:

- 새 local selector는 "복잡한 workflow graph"가 아니라 existing `selector` 단계의 internal candidate retrieval optimization으로 설명한다.
- context compaction은 `history.mdx`의 수동 요약 문단을 확장하는 방향이 자연스럽다. 다만 현재 stale `Text` history 표현을 current `userMessage`/`assistantMessage`/`systemMessage`로 먼저 정리해야 한다.
- compact marker를 `systemMessage`로 시작하는 설계는 current source와 호환되지만, chat renderer가 System card로 그대로 노출하므로 문서에는 marker가 짧아야 한다는 제약을 적어야 한다.
- result budget/projector는 `describe` history가 context 유지에 중요하다는 기존 문서와 충돌하지 않게, full execute value와 model-facing projection을 구분해 설명한다.
- RPC/public event를 늘리기 전에는 `assistantMessage`/`describe` final-only forwarding과 optional listener compatibility를 지켜야 한다.
- `@agentica/vector-selector`는 optional embedding strategy로 남기고, core local selector는 DBMS/network/provider 없는 default path로 문서화한다.
- MicroAgentica 문서는 "비변경, no selector" 원칙을 유지한다. event name/snippet correction만 별도 docs cleanup으로 처리한다.

문서 개정 후보:

- `website/content/docs/setup/cli.mdx`: 실제 CLI prompt/option/template matrix와 일치시킨다.
- `website/content/docs/core/event.mdx`, `micro.mdx`, `websocket/*.mdx`, snippets: `text` event/listener를 current `assistantMessage`/`userMessage` contract로 정정한다.
- `website/content/docs/core/history.mdx`, `AgenticaHistorySnippet`: `Text` history를 current message histories로 정정하고 compact/history projection 장을 추가한다.
- `website/content/docs/core/config.mdx`, `core/index.mdx`: `@agentica/pg-vector-selector`를 `@agentica/vector-selector` 또는 새 core-local selector config로 정리한다.
- `website/content/docs/plugins/vector-selector.mdx`: PostgreSQL/SQLite/custom strategy는 optional comparison으로 유지하고, local no-DBMS selector와의 관계를 추가한다.
- `website/build/typedoc.js`: 새 public package/API가 docs에 필요하면 TypeDoc pack list에 추가한다. 특히 local selector를 `@agentica/vector-selector`에 남기면 vector-selector API docs 누락이 문제가 된다.
- `website/app/_constants/landing.ts`: landing code/conversation preview가 runtime public message와 어긋나지 않는지 검토한다.

## 검증 게이트

문서 변경 시 최소 확인:

```bash
pnpm --filter @agentica/website build
```

주의:

- `prebuild:typedoc`은 외부 `samchon.github.io` JSON fetch와 local package TypeDoc generation을 수행한다.
- `prebuild:playground`는 `packages/chat` static build를 요구한다.
- external network/API 상태와 package install 상태에 따라 build failure가 구현 source 문제인지 문서/환경 문제인지 구분해야 한다.

추가 static 검증 후보:

- docs code fence에서 `agent.on("text"`와 `IAgenticaRpcListener.text`가 남아 있는지 검색한다.
- docs code fence에서 `AgenticaHistory.Text`, `type: "text"`가 남아 있는지 검색한다.
- CLI docs의 `--manager`, `start <directory>`, template count가 current CLI와 일치하는지 검색한다.
- `@agentica/pg-vector-selector`와 `/docs/plugins/pg-vector-selector` stale reference를 검색한다.
- `basePath: "/agentica"` 기준으로 image/public article/playground path가 깨지지 않는지 확인한다.

권장 fixture:

- docs snippet compile test를 별도 lightweight job으로 둔다. Nextra build는 TypeScript snippet을 compile하지 않으므로 stale public API 예시가 쉽게 남는다.
- CLI help/docs snapshot test를 둔다. `setup/cli.mdx`의 command surface와 `packages/cli/src/index.ts` command/options를 비교하는 deterministic test가 필요하다.
