# Agentica Core 구조 지도

## Facade

### `Agentica`

`Agentica`는 full orchestration facade다.

보유 상태:

- `operations_`: controller에서 합성된 operation collection
- `stack_`: selector가 쌓은 candidate operation selections
- `histories_`: user/assistant/select/execute/describe 등 누적 history
- `listeners_`: event listener map
- `executor_`: 기본 또는 custom executor
- `semaphore_`: vendor request concurrency limiter
- `token_usage_`: source별 token usage
- `ready_`: initialize 이후 여부

`conversate()`는 user message event를 먼저 dispatch하고, `executor_`에 `getContext()` 결과를 넘긴 뒤, event에서 history를 수집해 `histories_`에 append한다.

### `MicroAgentica`

`MicroAgentica`는 변경 금지 대상이다.

차이:

- selector stack이 없다.
- operation 전체를 `call()`에 직접 넘긴다.
- function 수가 적은 경우 단순함이 장점이다.

## Operation Composition

`AgenticaOperationComposer.compose()`는 controller 목록을 operation array로 변환한다.

- controller가 하나이거나 function names가 전역 unique이면 원래 function name을 사용한다.
- 이름 충돌이 있으면 `_${controllerIndex}_${functionName}` 형태로 operation name을 만든다.
- `config.capacity`가 있으면 operation array를 groups로 나눈다.
- `flat` map과 controller별 `group` map을 만든다.

이 구조는 local operation index의 입력으로 적합하다.

## Orchestration

기본 executor는 `orchestrate/execute.ts`다.

흐름:

1. initialize
2. cancel
3. select
4. call
5. describe
6. 반복

한계:

- context projection 단계가 없다.
- compaction/recovery phase가 없다.
- transition reason이 없다.
- selector 후보 축소가 LLM 중심이다.

## Selector

`orchestrate/select.ts`는 candidate function list를 tool result처럼 먼저 제공하고, `selectFunctions` tool call을 유도한다.

특징:

- `capacity`가 있으면 divided group별 병렬 selector를 돌린다.
- `eliticism`이 true면 1차 선택 후보끼리 다시 최종 selector를 돌린다.
- JSON parse/type validation feedback을 selector에도 적용한다.
- hallucinated function name을 validation failure로 되돌리는 보강이 있다.

Agentica Next에서는 이 selector를 폐기하기보다 `LLMSelector` adapter로 보존한다.

## Caller

`orchestrate/call.ts`는 가장 보존 가치가 높은 영역이다.

특징:

- selected operation schemas를 tools로 전달한다.
- assistant empty message를 retry한다.
- tool call arguments JSON parse 실패 시 corrective request를 보낸다.
- typia validation failure를 detailed feedback으로 되돌린다.
- validation repeated prompt로 반복 오류를 다룬다.
- class/http/mcp protocol별 executor를 호출한다.
- execute event로 success/failure를 통일한다.

Agentica Next의 runtime loop에서도 caller validation feedback loop는 재사용한다.

## History Projection

`factory/decodeHistory()`는 history를 OpenAI chat messages로 변환한다.

현재 execute history는 operation schema와 result value를 full JSON으로 tool message에 넣는다. 긴 result가 누적될 경우 context 폭증의 핵심 지점이다.

Agentica Next에서는 `decodeHistory()`를 직접 고치기보다 별도 `AgenticaContextProjector`를 두고, legacy path와 compact-aware path를 분리하는 편이 안전하다.

## Request Wrapper

`utils/request.ts`는 OpenAI SDK chat completion 호출을 감싼다.

- stream 기본값은 true다.
- request/response event를 dispatch한다.
- usage를 `AgenticaTokenUsageAggregator`로 누적한다.
- backoffStrategy를 config에서 받는다.

prompt-too-long reactive recovery를 구현하려면 이 wrapper 또는 runtime loop에서 provider error classification이 필요하다.

