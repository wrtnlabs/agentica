# Claude Code Query Loop 정밀 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/query.ts`
- `/home/samchon/github/samchon/claude-code/src/query/deps.ts`
- `/home/samchon/github/samchon/claude-code/src/query/config.ts`
- `/home/samchon/github/samchon/claude-code/src/query/tokenBudget.ts`
- `/home/samchon/github/samchon/claude-code/src/query/stopHooks.ts`
- `/home/samchon/github/samchon/claude-code/src/services/tools/StreamingToolExecutor.ts`
- `/home/samchon/github/samchon/claude-code/src/services/tools/toolOrchestration.ts`

참고: `query.ts`는 type-only로 `./query/transitions.js`를 import하지만 snapshot의 `src/query` 디렉터리에는 대응 `.ts` 파일이 확인되지 않았다. 이 문서는 `query.ts` 안의 실제 `return { reason: ... }`와 `transition: { reason: ... }` literal을 기준으로 정리한다.

## 핵심 구조

Claude Code의 `query.ts`는 단순 API wrapper가 아니라 generator 기반 runtime loop다. 확인한 주요 anchor는 다음과 같다.

- `QueryParams`: `query.ts:181`
- loop state type: `query.ts:204`
- public generator `query()`: `query.ts:219`
- 내부 `queryLoop()`: `query.ts:241`
- dependency injection: `query.ts:263`, `query/deps.ts:21`
- immutable runtime config snapshot: `query.ts:295`, `query/config.ts:29`

Agentica의 현재 `execute.ts`가 선형 절차라면, Claude Code는 매 반복마다 state를 갱신하고 `continue` reason을 기록하는 상태 머신에 가깝다.

## Loop State가 들고 가는 것

`State`에는 다음 범주가 들어간다.

- conversation messages
- tool execution context
- auto compact tracking
- max output token recovery count
- reactive compact 시도 여부
- pending tool use summary
- stop hook active flag
- turn count
- previous transition reason
- max output token override
- stop hook 재진입 여부

이 중 Agentica에 바로 필요한 것은 `messages/histories`, `operation stack`, `compaction tracking`, `retry/recovery state`, `turn count`, `transition reason`이다.

## 한 iteration의 흐름

실제 순서는 다음과 같이 읽힌다.

1. compact boundary 이후 메시지만 query 후보로 만든다.
2. tool result budget을 먼저 적용한다. `query.ts:370`
3. snip/history trimming을 적용한다.
4. microcompact를 적용한다. `query.ts:414`
5. context collapse가 있으면 auto compact보다 먼저 projection한다.
6. auto compact를 시도한다. `query.ts:454`
7. model streaming을 시작한다. `query.ts:659`
8. tool_use block이 streaming 중 도착하면 `StreamingToolExecutor`가 즉시 받을 수 있다. `query.ts:563`
9. streaming fallback, model fallback, prompt-too-long, max-output-tokens를 별도 recovery branch로 처리한다.
10. tool result를 normalize하여 다음 iteration의 user message로 넣는다.
11. stop hooks, token budget continuation, max turns를 처리한다. `query.ts:1309`
12. 다음 state를 만들고 loop를 계속한다. `query.ts:1715`

중요한 점은 compaction이 모델 호출 이전의 proactive path와 모델 오류 이후의 reactive path 양쪽에 존재한다는 것이다.

## Context 준비 단계의 세부 순서

`query.ts`의 prepare 단계는 단순히 history를 API message로 바꾸는 곳이 아니다.

실제 순서:

- `getMessagesAfterCompactBoundary()`로 compact boundary 이후만 가져온다.
- `applyToolResultBudget()`으로 tool result aggregate budget을 적용한다. agent/session resume이 필요한 query source에서는 replacement record를 session storage에 남긴다.
- `HISTORY_SNIP`이 켜져 있으면 snip compact를 먼저 적용하고, 제거한 token 수를 autocompact threshold에 반영한다.
- `deps.microcompact()`를 적용한다. cached microcompact는 실제 API usage의 `cache_deleted_input_tokens`를 본 뒤 boundary message를 늦게 yield한다.
- `CONTEXT_COLLAPSE`가 켜져 있으면 granular collapse projection을 autocompact보다 먼저 적용한다. collapse summary는 REPL history array가 아니라 collapse store/commit log에 있다.
- `deps.autocompact()`를 실행한다. 성공하면 `buildPostCompactMessages()`를 yield하고 `messagesForQuery`를 post-compact messages로 교체한다.
- task budget이 있으면 compact 직전의 final context window를 빼서 `taskBudget.remaining`을 유지한다.

Agentica 적용:

- context projector는 history array만 입력으로 삼으면 부족하다. replacement store, collapse store, compact tracking, task budget carryover 같은 side state가 필요하다.
- proactive compact와 read-time projection은 분리한다. projection만 바꾸는 collapse와 summary를 history에 쓰는 compact를 같은 이벤트로 보면 안 된다.
- result budget 적용은 compact보다 앞에 둬야 한다. compact가 이미 줄어든 tool result id/reference를 기준으로 동작해야 하기 때문이다.

## Model call과 streaming 처리

Claude Code는 model call을 한 번 시작하면 바로 assistant message를 transcript로 확정하지 않는다.

확인한 정책:

- `getRuntimeMainLoopModel()`은 permission mode와 plan-mode 200k 초과 여부를 보고 main loop model을 고른다.
- `queryModelWithStreaming`에는 fast mode, MCP tools, pending MCP server 여부, agent definitions, advisor/effort, taskBudget, queryTracking이 들어간다.
- `createDumpPromptsFetch()`는 session당 한 번 만들어 request body closure retention을 줄인다.
- streaming fallback이 발생하면 이미 yield된 assistant partial을 tombstone 처리하고, old tool_use id에 대한 pending tool result를 버린다.
- tool input backfill은 yield용 clone에만 적용한다. 원본 assistant message는 prompt cache byte stability 때문에 수정하지 않는다.
- prompt-too-long, media-size, max-output-tokens 같은 recoverable error는 일단 withheld한다. recovery 가능성이 끝난 뒤에만 사용자/SDK에 surface한다.
- tool_use block은 streaming 중 `StreamingToolExecutor.addTool()`로 바로 들어갈 수 있다.
- fallback model retry에서는 protected thinking signature block을 제거하고 다시 요청한다. model-bound signature를 fallback model에 replay하면 API가 실패하기 때문이다.

Agentica 적용:

- streaming delta를 public history로 곧장 확정하지 않는다. fallback/tombstone 또는 retry를 고려한 pending assistant state가 필요하다.
- operation call id와 tool result pairing은 fallback/retry 시 폐기 가능해야 한다.
- model call option은 static config가 아니라 runtime state projection이다. connector registry, permission mode, task budget, model fallback state가 들어간다.

## Recovery 전략

Claude Code는 recoverable error를 바로 사용자에게 보여주지 않는다.

- prompt-too-long은 streaming 중 withheld한 뒤 collapse drain 또는 reactive compact를 시도한다.
- max-output-tokens는 output token cap을 한 번 높여 재시도하고, 그래도 안 되면 meta user message로 이어 쓰게 한다.
- model fallback은 기존 partial assistant/tool_use를 tombstone 처리하고 새 모델로 전체 request를 재시도한다.
- stop hook blocking error는 assistant response 뒤에 붙여 같은 turn을 이어간다.
- streaming/tool abort는 모든 tool_use에 대응 tool_result를 합성해 API invariant를 깨지 않게 한다.
- API error assistant message에는 stop hooks를 돌리지 않는다. error -> hook blocking -> retry -> error의 death spiral을 막기 위해서다.

Agentica에는 최소한 prompt-too-long reactive compact와 max turns guard가 먼저 필요하다.

확인한 terminal/retry reason:

- terminal: `blocking_limit`, `image_error`, `model_error`, `aborted_streaming`, `prompt_too_long`, `completed`, `stop_hook_prevented`, `aborted_tools`, `hook_stopped`, `max_turns`
- retry/continue: `collapse_drain_retry`, `reactive_compact_retry`, `max_output_tokens_escalate`, `max_output_tokens_recovery`, `stop_hook_blocking`, `token_budget_continuation`, `next_turn`

## Dependency Injection

`query/deps.ts`는 production dependency를 `callModel`, `microcompact`, `autocompact`, `uuid`로 좁게 분리한다. 테스트가 모듈 mocking 대신 deps override로 query loop를 검증할 수 있게 만든다.

Agentica Next도 이 패턴을 따라야 한다.

```typescript
interface AgenticaRuntimeDeps {
  request: AgenticaContext["request"];
  select: AgenticaSelector;
  call: AgenticaCaller;
  compact: AgenticaCompactor;
  uuid: () => string;
  now: () => Date;
}
```

## Tool execution runtime

Tool execution은 두 path가 있다.

- streaming path: `StreamingToolExecutor`
- batch path: `runTools()`

`StreamingToolExecutor` 원칙:

- tool_use가 streaming 중 들어오면 queue에 넣고 즉시 실행 가능 여부를 본다.
- `isConcurrencySafe` tool끼리는 병렬 실행할 수 있다.
- non-concurrency-safe tool은 단독 실행되고, 뒤의 tool 시작을 막는다.
- progress message는 order와 무관하게 즉시 yield한다.
- final tool_result는 tool_use 수신 순서를 지키며 yield한다.
- Bash tool이 error result를 만들면 sibling abort controller로 병렬 Bash subprocess를 중단한다. Read/WebFetch 같은 독립 tool error는 sibling을 죽이지 않는다.
- streaming fallback이 발생하면 queued/in-progress result는 synthetic `streaming_fallback` error로 버려 old tool_use_id 누수를 막는다.
- user interruption은 tool의 `interruptBehavior()`가 `cancel`인 경우에만 synthetic rejection으로 바뀐다. 기본은 block이다.

`runTools()` batch path:

- consecutive read-only/concurrency-safe tool은 batch로 묶어 병렬 실행한다.
- non-read-only tool은 단일 batch로 serial 실행한다.
- concurrent batch의 context modifier는 tool result yield 뒤 tool_use order대로 적용한다.
- concurrency 한도는 `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` 또는 기본 10이다.

Agentica 적용:

- operation concurrency는 단순 `Promise.all`이 아니다. operation-local `isConcurrencySafe(args)`와 context modifier ordering이 필요하다.
- progress event와 final execute history는 분리한다.
- 실패한 operation이 sibling operation을 abort할지 여부는 operation kind별 정책이다.

## Attachment drain과 runtime side effects

Tool 실행 뒤 query loop는 다음 model iteration을 만들기 전에 attachment를 drain한다.

확인한 동작:

- queued command/task notification snapshot을 가져와 attachment로 만든다.
- `Sleep` tool이 실행됐으면 `later` priority까지 drain하고, 아니면 `next` priority만 drain한다.
- slash command는 mid-turn attachment에서 제외한다. slash command는 turn 종료 후 command processor로 가야 한다.
- main thread는 `agentId === undefined` queue만 drain하고, subagent는 자기 `agentId`의 task-notification만 drain한다.
- memory prefetch는 turn 시작부터 실행되고, settled 상태일 때만 zero-wait consume한다. 이미 Read/Write/Edit한 memory는 중복 attachment에서 걸러진다.
- skill discovery prefetch는 tool 실행 중에 병렬로 진행되고, 완료되면 skill attachment로 주입된다.
- consumed prompt/task-notification command만 queue에서 제거하고 command lifecycle started/completed를 통지한다.
- tool list는 다음 iteration 전 `refreshTools()`로 갱신될 수 있다. 새 MCP server가 연결되면 다음 turn부터 tool projection이 바뀐다.
- top-level session은 주기적으로 task summary를 생성할 수 있다. subagent/fork는 제외된다.

Agentica 적용:

- model-visible attachment는 public history append와 다르다. queue drain, lifecycle notification, connector registry refresh, memory/skill prefetch consume은 runtime transition이다.
- connector/tool registry는 turn 중 바뀔 수 있으므로 다음 iteration 전 refresh boundary가 필요하다.
- subagent queue scoping은 명시적으로 둔다. process-global queue를 그대로 공유하면 parent/subagent transcript가 오염된다.

## Stop hooks와 turn-end side work

`query/stopHooks.ts`는 turn 종료 직전의 hook/side-work를 담당한다.

확인한 동작:

- main/sdk query source에서는 cache-safe params snapshot을 저장한다. `/btw`와 SDK side question이 이 snapshot을 읽는다.
- template job 실행 중이면 turn assistant messages를 분류해 job state를 쓴다.
- bare mode가 아니면 prompt suggestion, extract memories, auto dream을 fire-and-forget으로 시작한다.
- main thread에서만 Chicago MCP computer-use cleanup을 한다. subagent가 process-wide lock을 풀면 main cleanup이 깨지기 때문이다.
- `executeStopHooks()`는 progress/attachment/blocking error/prevent continuation을 yield한다.
- blocking error는 meta user message로 다음 iteration에 붙는다.
- prevent continuation은 structured `hook_stopped_continuation` attachment를 만들고 turn을 종료한다.
- hooks가 실행됐으면 summary system message를 만든다. hook error가 있으면 UI notification도 추가한다.
- teammate이면 Stop hook 통과 후 TaskCompleted hook과 TeammateIdle hook도 실행한다.

Agentica 적용:

- turn-end hook은 "assistant response 후처리"가 아니라 continuation 여부를 바꿀 수 있는 policy/runtime phase다.
- hook blocking result는 schema validation retry와 다른 transition으로 남긴다.
- parent/subagent/team hook scope를 분리해야 한다.

## Token budget continuation

`query/tokenBudget.ts`는 global turn token budget을 보고 자동 continuation 여부를 판단한다.

정책:

- agentId가 있거나 budget이 없으면 stop이다.
- 90% 미만이면 meta user nudge를 넣어 계속한다.
- 3회 이상 continuation 이후 최근 증가량이 500 token 미만이면 diminishing returns로 early stop한다.
- stop 시 continuation count, percentage, turn tokens, budget, duration을 analytics로 남긴다.

Agentica 적용:

- max turns와 별개로 token-budget continuation guard가 필요하다.
- continuation은 user-visible prompt가 아니라 meta message/transition으로 처리한다.

## Agentica에 가져올 원칙

- executor는 선형 function이 아니라 transition-aware loop여야 한다.
- compaction/recovery/tool execution은 별도 deps로 뺀다.
- 모든 반복은 `reason`을 남겨 테스트와 관측을 가능하게 한다.
- recoverable API error는 바로 history에 고정하지 말고, 내부 recovery path를 먼저 태운다.
- streaming assistant/tool_use는 fallback 전까지 pending 상태로 취급한다.
- tool concurrency는 operation metadata와 context modifier ordering으로 제어한다.
- attachment/memory/skill/command drain은 model-visible context projection과 public history persistence를 분리한다.
- `MicroAgentica`에는 이 구조를 넣지 않는다.
