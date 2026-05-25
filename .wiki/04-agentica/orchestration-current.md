# Agentica 현재 Orchestration/Prompt 구조

이 문서는 `packages/core/src/orchestrate/*`와 `packages/core/prompts/*`를 기준으로 현재 Agentica 실행 흐름을 정리한다.

## Top-level execute

`execute(executor)`는 `Agentica.conversate()`에서 만든 `AgenticaContext`를 받아 다음 순서로 돈다.

1. `ctx.ready() === false`이면 initialize 처리
2. `ctx.stack.length !== 0`이면 cancel 처리
3. select 처리
4. stack이 비어 있으면 종료
5. `while (true)` call 처리
6. describe가 꺼져 있지 않으면 describe 처리
7. `executes.length === 0 || ctx.stack.length === 0`이면 종료, 아니면 반복

중요한 현재 특성:

- phase별 cleanup hook은 없다.
- runtime state는 `histories`, `stack`, `ready` 중심이다.
- `executor` config로 각 phase를 일부 교체할 수 있다.
- `initialize`는 `executor.initialize` 값 해석이 특이하다. `true` 또는 function일 때만 initializer agent를 쓰고, 그 외에는 바로 `ctx.initialize()`로 ready 처리한다.

## Initialize

`initialize(ctx)`는 previous histories, user input, initialize system prompt, common prompt를 보내고 `getApiFunctions` getter tool을 제공한다.

LLM이 getter tool을 호출하면 `ctx.initialize()`가 실행되어 ready가 된다. non-stream 응답에서 tool call이 없으면 assistant message만 dispatch하고 ready가 되지 않을 수 있다.

Agentica Next 메모:

- initialize는 실제 operation list를 주입하는 phase라기보다 "도구 사용 의도 확인"에 가깝다.
- local RAG selector를 도입하면 initialize를 줄이거나 lazy ready로 바꾸는 선택지가 있다.

## Select

`select(ctx)`는 operation 수가 capacity를 넘으면 `ctx.operations.divided` 단위로 병렬 step을 수행한다. 이후 `eliticism`이 켜져 있으면 각 chunk에서 뽑힌 후보를 다시 하나의 selection step에 넣는다.

selection request 구성:

- assistant tool call `getApiFunctions`
- tool result로 candidate operations list 주입
- previous histories
- current user input
- empty assistant message reasoning 보정
- select system prompt
- parse/validation feedback messages
- common prompt

retry logic:

- `selectFunctions` arguments를 lenient parse한다.
- parse failure는 JSON parse prompt로 feedback한다.
- validation failure는 validation prompt로 feedback한다.
- hallucinated function name은 runtime validation error로 만들어 feedback한다.

처리:

- valid reference는 `selectFunctionFromContext()`가 `ctx.stack.push()`하고 `select` event를 dispatch한다.
- assistant reasoning payload를 select history/event에 붙일 수 있다.

위험:

- policy gate가 없다.
- selection에서 destructive/write operation을 다루는 별도 metadata가 없다.
- parallel chunk step에서 모은 events는 eliticism 여부에 따라 이후 replay된다.

## Cancel

`cancel(ctx)`는 select와 거의 같은 구조다. 차이점은 candidate list와 validation 기준이다.

핵심:

- 현재 stack에서 취소할 operation을 고른다.
- hallucinated cancel target은 `ctx.stack` 기준으로 validation failure가 된다.
- `cancelFunctionFromContext()`는 stack에서 해당 operation을 제거하고 `cancel` event를 dispatch한다.
- prompt는 적절한 cancel target이 없으면 말하지 말고 아무것도 하지 말라고 지시한다.

Agentica Next 메모:

- cancel은 workflow state transition에 해당한다.
- runtime phase로 분리하면 stack mutation을 event-sourced state update로 바꾸는 것이 좋다.

## Call

`call(ctx, operations)`는 current histories, user input, execute system prompt, common prompt를 보내고 selected operations를 tools로 제공한다.

호출 후 각 function tool call에 대해 `predicate()`를 수행한다.

`predicate()` 단계:

1. `operation.function.parse()`로 JSON parse
2. parse 실패 시 `jsonParseError` event dispatch 후 correction
3. `operation.function.validate()`로 type validation
4. validation 실패 시 `validate` event dispatch 후 correction
5. 성공하면 `executeFunction()`

correction:

- JSON parse failure는 `json_parse_error.md` prompt를 사용한다.
- validation failure는 `validate.md`와 반복 실패 시 `validate_repeated.md`를 결합한다.
- life가 0 이하가 되면 실패 execute event를 만든다.

execute:

- class: controller callback 또는 object method 호출
- http: custom execute 또는 `HttpLlm.propagate`
- mcp: `client.callTool({ name, arguments }).then(v => v.content)`

성공/실패 모두 `createExecuteEvent()`로 감싸며, class/http/mcp 실행 error는 throw하지 않고 `success: false` execute event가 된다.

중요 장점:

- call 단계의 parse/type correction loop는 견고하다.
- validation feedback이 runtime state를 반영할 수 있다.
- 반복 validation prompt는 같은 error path 반복 시 구조 재설계를 요구한다.

위험:

- unknown tool call은 조용히 무시한다.
- call 직전 permission/policy gate가 없다.
- result semantic layer가 없다. `success`는 execution exception 중심이고 domain-level non-error를 표현하지 못한다.
- MicroAgentica도 `call()`을 공유하므로 이 파일 변경은 MicroAgentica 영향이 크다.

## Describe

`describe(ctx, histories)`는 execute histories만 decode해서 LLM에 주고 markdown description을 생성한다.

특징:

- histories가 비면 바로 return한다.
- previous full conversation을 넣지 않고 execute histories 중심이다.
- non-stream/stream 모두 `describe` event를 dispatch한다.

Agentica Next 메모:

- describe phase는 result projection의 대표 예다.
- compact 이후에도 user-facing 설명 품질을 유지하려면 execute result summary와 원본 result reference를 분리해야 한다.

## Prompt 구조

| prompt | 역할 |
| --- | --- |
| `common.md` | locale, timezone, current ISO datetime |
| `initialize.md` | helpful assistant + supplied tools 사용 |
| `select.md` | `getApiFunctions()` 결과에서 function selection |
| `cancel.md` | 준비된 function cancel, 없으면 침묵 |
| `execute.md` | JSON schema compliance와 missing information 처리 |
| `validate.md` | `IValidation.IFailure` 기반 argument correction |
| `validate_repeated.md` | 반복 error path에서 root cause 재분석 요구 |
| `json_parse_error.md` | malformed JSON correction |
| `describe.md` | function call result를 상세 markdown으로 설명 |

Claude Code와 비교하면 Agentica prompt는 phase별로 간결하고 validation prompt가 강하다. 반면 tool policy, context projection, phase-specific memory, cleanup 지침은 거의 없다.

## 보존할 것과 바꿀 것

보존:

- call 단계 validation feedback loop
- `AgenticaOperationSelection` stack model의 public 의미
- event/history JSON 계약
- custom executor hook

바꿀 것:

- phase별 context projector 추가
- selection 전 local operation index 추가
- call 직전 policy gate 추가
- result semantic interpreter 추가
- cleanup/finalizer boundary 추가
- compact를 `systemMessage` 호환 모드부터 도입

MicroAgentica 주의:

- `call()`과 `describe()`는 MicroAgentica와 공유된다.
- Agentica 전용 policy/runtime 강화는 shared function을 직접 바꾸기보다 wrapper phase에서 먼저 처리해야 한다.
