# Agentica 강화 로드맵

## 범위 원칙

`MicroAgentica`는 현재 형태가 장점이다. 함수 수가 적은 경우 모든 operation을 직접 노출하는 단순한 facade로 남겨야 하며, context compaction, local RAG selector, stateful loop 같은 무거운 runtime 기능을 넣지 않는다.

이 로드맵의 변경 대상은 `Agentica`다. `MicroAgentica`와 공유할 수 있는 저수준 유틸리티가 생기더라도 공개 동작과 orchestration 구조는 건드리지 않는다.

## 현재 Agentica의 구조적 한계

현재 `@agentica/core`의 `Agentica` runtime은 `Agentica.conversate()`가 executor를 호출하고, 기본 executor가 `initialize -> cancel -> select -> call -> describe`를 수행하는 구조다.

이 구조는 function calling validation에는 강하지만 다음 약점이 있다.

- history가 무한히 커져도 압축 계층이 없다.
- selector가 LLM 호출과 operation 전체 열거에 강하게 의존한다.
- `capacity` 기반 divide-and-conquer는 함수 수가 많아질 때 비용과 hallucination을 근본적으로 해결하지 못한다.
- `@agentica/vector-selector`는 외부 embedding/search strategy를 강제하고, 현재 패키지는 `better-sqlite3`, `sqlite-vec`, Cohere 등 무거운 의존성을 가진다.
- operation metadata가 read-only, destructive, concurrency-safe, permission 같은 runtime policy를 표현하지 못한다.
- tool result 크기, max turns, token budget, prompt-too-long recovery가 없다.
- 큰 class/http/mcp result를 preview/reference로 materialize하는 result store가 없다.
- Claude Code의 `FileRead`처럼 큰 자료를 line/page/item/jsonPath/offset 단위로 나누어 읽는 progressive read protocol이 없다.
- model-facing context, public history, audit 원본, chat render projection, resume sidecar가 충분히 분리되어 있지 않다.
- workflow state가 명시적 transition으로 모델링되어 있지 않아 복구 경로를 붙이기 어렵다.
- long-running task output, offset/tail read, stop, notification queue가 없다.
- plan/user-interaction, connector auth, scheduled task, team mailbox처럼 일반 function call이 아닌 runtime transition 표면이 없다.

## 방향성

기존 workflow orchestrator를 폐기해도 된다는 전제라면, Agentica의 다음 runtime은 "function selector + caller"가 아니라 "stateful agent loop"여야 한다.

목표 구조:

- `Agentica` facade는 유지한다.
- `MicroAgentica` facade와 기본 동작은 유지한다.
- 내부 executor는 `AgenticaLoop` 또는 `AgenticaRuntime`으로 교체 가능하게 만든다.
- history 관리는 별도 `AgenticaContextManager`가 맡는다.
- function selection은 `AgenticaOperationIndex`와 local search를 기본으로 한다.
- LLM selector는 local search의 reranker 또는 fallback으로 낮춘다.
- vector selector는 optional advanced selector로 남기되 core path에서는 DBMS가 필요 없어야 한다.
- `AgenticaContextProjector`가 public history에서 model-facing request를 만든다.
- `AgenticaResultStore`가 큰 execute result의 preview/reference/digest/range metadata를 관리한다.
- `AgenticaSegmentedContentReader`가 파일 시스템이 아닌 controller/API/resource result 전반의 segmented read를 담당한다.
- `AgenticaRuntimeStateStore`와 transition log가 prompt-too-long, stop, permission, registry reload, task notification을 function-call failure와 분리한다.

## 단계별 작업

### 1단계: Local Operation Index

core에 dependency-free operation index를 추가한다.

- name, controller name, function name, description, parameter names, parameter descriptions, HTTP method/path/tags, protocol을 tokenization한다.
- BM25에 가까운 lexical scoring을 구현한다.
- exact name, prefix, camelCase split, path segment match에 가중치를 준다.
- 결과는 `AgenticaOperationSearchResult`로 reason/score/matchedFields를 포함한다.

이 단계만으로 `@agentica/vector-selector` 없이도 큰 API surface에서 후보를 줄일 수 있다.

상태: 2026-05-24에 1차 구현 완료. `packages/core/src/selector/AgenticaOperationIndex.ts`와 `IAgenticaConfig.selector` opt-in mode가 들어갔다. 남은 일은 benchmark 비교와 compact/resume state 연결이다.

### 2단계: Selector 재설계

기존 `select.ts`를 바로 제거하지 않고 새 selector를 병행 도입한다.

- `config.selector.type = "local" | "llm" | "hybrid"` 형태를 추가한다.
- 기본값은 처음에는 기존 호환을 위해 `"llm"` 또는 `"hybrid"`로 둔다.
- hybrid는 local index로 top-K를 만든 뒤 기존 LLM selector가 top-K 안에서 순서/필요성을 판정한다.
- hallucinated function name 검증은 유지한다.

상태: 2026-05-24에 opt-in 병행 경로까지 구현했다. 기본값은 `"llm"`이며, `hybrid`는 local top-K를 기존 LLM selector의 candidate catalog로 넘긴다. LLM selector의 hallucinated function validation은 전체 registry가 아니라 이번 candidate catalog 기준으로 보정했다.

### 3단계: Context Projector와 Result Budget

core history를 바로 줄이기 전에 model-facing context projection을 분리한다. 이 단계가 compact보다 먼저다.

- model별 context window와 output reserve를 설정할 수 있게 한다.
- tool/function result가 너무 크면 preview와 persisted payload로 분리하는 hook을 둔다.
- read/search/list 성격의 operation result는 오래된 내용을 요약 또는 stub으로 치환한다.
- OpenAI tool_call/tool result pairing invariant를 깨지 않도록 history transformation을 테스트한다.
- public `IAgenticaHistoryJson` 호환성은 유지하고, 내부 projector가 만든 request만 먼저 바꾼다.
- chat render projection은 core history 직렬화와 분리할 수 있게 metadata를 남긴다.

### 4단계: Progressive Read와 Result Materialization

Claude Code의 파일 분할 읽기, `Grep`/`Glob` cap, task output cursor를 Agentica의 general result protocol로 번역한다.

- `line`, `page`, `item`, `jsonPath`, `byte` range descriptor를 둔다.
- HTTP/OpenAPI response, class controller result, MCP resource, remote output, task log를 같은 segment shape로 다룬다.
- search/list/read operation은 `limit`, `offset`, `truncated`, `digest`, `version`을 반환할 수 있어야 한다.
- 같은 digest/version의 반복 결과는 전체 재주입 대신 unchanged stub으로 projection한다.
- write/destructive operation은 직전 read/search 결과의 digest/version freshness를 call 직전 precondition으로 확인한다.
- adapter가 full payload persistence를 제공하지 못하면 preview-only fallback으로 동작한다.

### 5단계: Compact Lifecycle

manual/auto compact를 추가한다.

- `AgenticaCompactHistory` 또는 compact boundary system history를 추가한다.
- summary prompt는 tool 호출이 불가능한 별도 request로 실행한다.
- compact 후에는 summary만 넣지 않고, 최근 user intent, pending operations, selected operations, failed validations, large result references를 재주입한다.
- prompt-too-long API error를 감지하면 reactive compact 후 같은 turn을 재시도한다.
- compact restore에는 result refs, segment refs, task output cursor, selector candidate state를 포함한다.

### 6단계: Stateful Loop

`execute.ts`의 선형 executor를 상태 머신으로 대체한다.

상태 예시:

- `prepare_context`
- `select_operations`
- `call_model`
- `execute_tools`
- `append_results`
- `compact_retry`
- `describe_or_finish`
- `abort`

각 transition은 reason과 metrics를 남긴다. 테스트는 transition 단위로 작성한다.

### 7단계: Tool/Operation Policy와 Task Runtime

`AgenticaOperation`은 function metadata이고, runtime policy는 별도 wrapper가 필요하다.

- `readOnly`
- `destructive`
- `concurrencySafe`
- `permission`
- `maxResultSize`
- `searchHint`
- `defer`
- `alwaysLoad`

처음에는 optional metadata로 시작해 class/http/mcp controller에서 점진적으로 주입할 수 있게 한다.

long-running work는 function result가 아니라 output reference와 cursor를 가진 task primitive로 둔다.

- task output은 inline history가 아니라 output reference에 append한다.
- model context에는 terminal summary와 필요한 tail만 projection한다.
- stop은 validation error가 아니라 runtime transition이다.
- notification dedup과 output offset을 state에 보존한다.
- context diagnostics는 raw history가 아니라 projected model request를 기준으로 token/category breakdown을 계산한다.

### 8단계: Interaction/Connector/Team Runtime

Claude Code의 Plan/Config/Skill/Web/MCP/Team/Schedule 도구군을 반영해 runtime subsystem을 분리한다.

- plan mode와 user question은 interaction runtime으로 둔다.
- config는 registry 기반으로 관리하고 prompt를 registry에서 생성한다.
- MCP/Web/remote connector는 auth, domain, binary result, source attribution, registry hot-swap metadata를 가진다.
- scheduled task는 session-only/durable, jitter, auto-expiry, ownership을 명시한다.
- team runtime은 shared task list, mailbox, cleanup boundary를 포함한다.

이 단계도 `Agentica` 전용이다. `MicroAgentica`는 비변경 regression 대상이다.

### 9단계: Capability Registry와 Reload

초기에는 public marketplace를 열지 않더라도 내부 capability pack registry를 둔다.

- capability source declaration, materialized cache, installed pack, enabled pack, active projection을 분리한다.
- install은 enablement intent를 먼저 기록하고, materialization 실패는 recovery 가능한 failed item으로 남긴다.
- validation은 runtime loader보다 strict하게 실행해 manifest, procedure frontmatter, connector config, hook config를 검사한다.
- MCPB/DXT 또는 archive 기반 connector bundle은 content cache, extraction, userConfig, secure storage, runtime projection을 분리한다.
- failed/flagged/needs-config capability는 숨기지 않고 control plane item으로 노출한다.
- old materialization은 concurrent session safety를 위해 orphan marker로 보존하고 local RAG/search exclusion을 적용한다.
- `/reload-capabilities` 성격의 explicit boundary에서 operation/procedure/connector/hook projection과 connector reconnect key를 교체한다.

## 우선순위 결론

첫 구현 대상이었던 local operation index는 2026-05-24에 들어갔다. 이제 가장 먼저 할 일은 context 압축 자체가 아니라 `AgenticaContextProjector + AgenticaResultStore + Progressive Read`다.

이유는 Agentica가 general purpose agent라서 함수 선택에 성공한 뒤에도 큰 HTTP/class/MCP 결과, 긴 조사 세션, 반복 read/list/search, task output이 곧바로 context와 UI를 압박하기 때문이다. Claude Code의 compact는 혼자 서 있지 않고 file splitting, result reference, task output cursor, attachment restore 위에서 동작한다. Agentica도 먼저 큰 결과를 작게 투영하고 다시 읽을 수 있는 구조를 만든 뒤 compact를 붙여야 한다.

## 검증 연결

구현 phase별 test/benchmark gate는 [Agentica Next 검증 전략](./verification-strategy.md)을 따른다.

- local operation index는 API key 없는 deterministic unit test가 우선이다.
- selector 통합은 `AgenticaSelectBenchmark`로 plain/local/hybrid를 비교한다.
- context projector/result store/progressive read는 large result fixture와 pairing invariant unit test가 우선이다.
- stateful runtime과 compact는 기존 base/streaming/validate/RPC e2e를 깨지 않는지 먼저 본다.
- `MicroAgentica` benchmark/test는 비변경 regression gate로만 사용한다.
