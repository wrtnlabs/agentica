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
- workflow state가 명시적 transition으로 모델링되어 있지 않아 복구 경로를 붙이기 어렵다.
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

### 3단계: Context Budget과 Microcompact

core history에 token/result budget 개념을 넣는다.

- model별 context window와 output reserve를 설정할 수 있게 한다.
- tool/function result가 너무 크면 preview와 persisted payload로 분리하는 hook을 둔다.
- read/search/list 성격의 operation result는 오래된 내용을 요약 또는 stub으로 치환한다.
- OpenAI tool_call/tool result pairing invariant를 깨지 않도록 history transformation을 테스트한다.

### 4단계: Full Compact

manual/auto compact를 추가한다.

- `AgenticaCompactHistory` 또는 compact boundary system history를 추가한다.
- summary prompt는 tool 호출이 불가능한 별도 request로 실행한다.
- compact 후에는 summary만 넣지 않고, 최근 user intent, pending operations, selected operations, failed validations, large result references를 재주입한다.
- prompt-too-long API error를 감지하면 reactive compact 후 같은 turn을 재시도한다.

### 5단계: Stateful Loop

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

### 6단계: Tool/Operation Policy 확장

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

### 7단계: Interaction/Connector/Team Runtime

Claude Code의 Plan/Config/Skill/Web/MCP/Team/Schedule 도구군을 반영해 runtime subsystem을 분리한다.

- plan mode와 user question은 interaction runtime으로 둔다.
- config는 registry 기반으로 관리하고 prompt를 registry에서 생성한다.
- MCP/Web/remote connector는 auth, domain, binary result, source attribution, registry hot-swap metadata를 가진다.
- scheduled task는 session-only/durable, jitter, auto-expiry, ownership을 명시한다.
- team runtime은 shared task list, mailbox, cleanup boundary를 포함한다.

이 단계도 `Agentica` 전용이다. `MicroAgentica`는 비변경 regression 대상이다.

### 8단계: Capability Registry와 Reload

초기에는 public marketplace를 열지 않더라도 내부 capability pack registry를 둔다.

- capability source declaration, materialized cache, installed pack, enabled pack, active projection을 분리한다.
- install은 enablement intent를 먼저 기록하고, materialization 실패는 recovery 가능한 failed item으로 남긴다.
- validation은 runtime loader보다 strict하게 실행해 manifest, procedure frontmatter, connector config, hook config를 검사한다.
- MCPB/DXT 또는 archive 기반 connector bundle은 content cache, extraction, userConfig, secure storage, runtime projection을 분리한다.
- failed/flagged/needs-config capability는 숨기지 않고 control plane item으로 노출한다.
- old materialization은 concurrent session safety를 위해 orphan marker로 보존하고 local RAG/search exclusion을 적용한다.
- `/reload-capabilities` 성격의 explicit boundary에서 operation/procedure/connector/hook projection과 connector reconnect key를 교체한다.

## 우선순위 결론

가장 먼저 할 일은 context 압축이 아니라 local operation index다. 이유는 Agentica의 정체성이 function calling framework라서, 함수 수가 늘 때 selector 품질과 비용이 먼저 무너진다. Local selector를 core에 넣으면 `@agentica/vector-selector`의 무거운 의존성을 즉시 우회하고, 이후 compact와 stateful loop에도 같은 index를 재사용할 수 있다.

## 검증 연결

구현 phase별 test/benchmark gate는 [Agentica Next 검증 전략](./verification-strategy.md)을 따른다.

- local operation index는 API key 없는 deterministic unit test가 우선이다.
- selector 통합은 `AgenticaSelectBenchmark`로 plain/local/hybrid를 비교한다.
- stateful runtime과 compact는 기존 base/streaming/validate/RPC e2e를 깨지 않는지 먼저 본다.
- `MicroAgentica` benchmark/test는 비변경 regression gate로만 사용한다.
