# Agentica 영향면 분석

## 새 runtime 도입 시 영향받는 영역

### Core public API

영향:

- `IAgenticaConfig`
- `IAgenticaExecutor`
- `AgenticaContext`
- history/event JSON types

전략:

- 새 config는 `runtime` 또는 `experimental` namespace에 둔다.
- 기존 `executor` custom hook은 유지한다.
- default runtime 전환 전 opt-in으로 검증한다.

### Histories와 JSON

compact boundary 또는 projected result를 새 history type으로 추가하면 다음이 영향받는다.

- `histories/AgenticaHistory.ts`
- `json/IAgenticaHistoryJson.ts`
- `factory/histories.ts`
- `transformers/transformHistory.ts`
- `rpc` listener/service JSON 전달
- `chat` message renderer

초기에는 새 history type 없이 projector 내부에서만 result budget을 적용하는 방법이 더 안전하다.

`systemMessage`는 이미 history와 chat renderer에 있으므로 compact marker의 1차 호환 경로로 쓸 수 있다. 단, event union에는 없어서 runtime listener/RPC progress가 자동으로 생기지는 않는다.

chat renderer 확인 결과 `systemMessage.text`는 큰 System 카드로 그대로 노출된다. compact marker로는 짧은 문장만 넣고, summary/metadata/result refs는 internal state 또는 structured sidecar로 둔다.

### Events

새 runtime은 다음 event 후보를 만들 수 있다.

- `compact`
- `contextProject`
- `operationSearch`
- `runtimeTransition`

하지만 event 증가는 RPC/chat/JSON surface를 넓힌다. 1차 구현은 internal metrics/logging으로 시작하고, public event는 확정 후 추가한다.

RPC 확인 결과 `assistantMessage`와 `describe`도 final-only forwarding이다. compact progress event를 먼저 public streaming으로 여는 것은 현재 surface와 맞지 않는다.

### Vector Selector

local selector 도입은 `@agentica/vector-selector`와 중복된다.

정리 방향:

- core local selector: dependency-free, default candidate retrieval
- vector-selector: optional embedding/rerank strategy
- sqlite/postgres strategy: subpath export 또는 별도 package로 격리 검토

### Benchmark

selector 변경 검증에 직접 필요하다.

- 기존 `AgenticaSelectBenchmark`는 `orchestrate.select` 또는 custom executor select를 호출한다.
- local/hybrid selector를 adapter로 끼우면 benchmark 재사용 가능하다.

### Test

테스트 층 분리 필요:

- deterministic unit: tokenizer, operation index, projection, compaction policy
- LLM integration: existing `test/src/features/*`
- benchmark: expected operation quality

### Chat package

영향:

- `AgenticaChatMovie` event subscription과 final-only append flow
- `AgenticaChatMessageMovie` history type dispatch
- `AgenticaChatSystemMessageMovie` compact marker 노출 방식
- `AgenticaChatDescribeMessageMovie`/`AgenticaChatExecuteMessageMovie` full execute result display
- `AgenticaChatFunctionStackSideMovie` selected operation stack projection
- BBS/Shopping/Uploader examples

전략:

- compact/task/remote runtime은 chat에 바로 progress event를 흘리지 않는다.
- structured history type을 추가할 때는 chat renderer compile break를 의도적인 migration gate로 삼는다.
- large result는 model projection뿐 아니라 execute renderer에서도 preview/reference로 나눈다.
- BBS example은 `MicroAgentica` 비변경 회귀 확인에 사용한다.
- Shopping/Uploader example은 OpenAPI/HTTP controller와 arbitrary schema regression 확인에 사용한다.

### CLI와 create scaffold

영향:

- `agentica start --project <template>` choices
- GitHub template repository contract
- connector list fetch와 connector code generation
- `.env` key/value writing
- server/client combined template config split
- `create-agentica` alias package

전략:

- Agentica Next runtime은 core API가 안정되기 전까지 scaffold default로 켜지 않는다.
- experimental config를 노출한다면 template code, env, docs, CLI tests를 같은 phase에서 바꾼다.
- server template에는 runtime/selector/compact config를, client template에는 RPC/chat endpoint config를 분리해 주입한다.
- connector codegen은 기존 class-controller convention과 compatibility를 유지한다.
- `.env` writer는 secret/complex value/duplicate key 정책을 보강하기 전까지 단순 값만 넣는다.

### Website/docs/articles

영향:

- Next/Nextra docs route와 `_meta.ts` navigation
- TypeDoc API build pack list
- chat playground static build copy
- setup/core/event/history/websocket/plugin docs snippets
- public article redirect wrappers와 root `articles` positioning 원고
- landing static code/chat preview

전략:

- Agentica Next runtime은 "새 workflow graph"가 아니라 existing selector/caller/describer runtime의 internal optimization으로 문서화한다.
- local selector는 core no-DBMS path와 optional `@agentica/vector-selector` embedding strategy의 관계를 분명히 나눈다.
- context projector/result store/progressive read는 selector 이후의 다음 최적화 축으로 문서화한다.
- Claude Code의 file splitting은 filesystem feature가 아니라 controller/API/resource result slicing protocol로 번역한다.
- compact/history docs는 stale `AgenticaHistory.Text` 표현을 current `userMessage`/`assistantMessage`/`systemMessage` contract로 정리한 뒤 확장한다.
- public event/RPC docs는 `text` listener가 아니라 current `assistantMessage`/`userMessage`/`describe` contract를 기준으로 정리한다.
- CLI docs와 tutorial command는 실제 `agentica start` command/options/template matrix와 맞춘다.
- TypeDoc에 새 public package/API를 노출할지 구현 phase에서 결정한다.

주의:

- `pnpm --filter @agentica/website build`는 external TypeDoc JSON fetch와 `packages/chat` build를 함께 요구한다.
- Nextra build는 code fence를 compile하지 않으므로 docs snippet staleness는 별도 grep/fixture가 필요하다.
- `MicroAgentica` 문서는 no selector/no compact 원칙을 유지하고, event name snippet 정정만 허용한다.

## MicroAgentica 영향면

`MicroAgentica`는 변경하지 않는다.

허용되는 간접 영향:

- 공통 type export가 추가되는 정도
- shared utility 추가

금지되는 영향:

- conversate 흐름 변경
- selector 도입
- context compaction 자동 도입
- operation filtering
- history semantics 변경
