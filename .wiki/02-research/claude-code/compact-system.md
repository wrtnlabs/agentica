# Claude Code Compact System 정밀 분석

## 근거 파일

Claude Code snapshot 기준으로 `src/services/compact/*` 전체와 compact boundary 소비 지점을 읽었다.

- `/home/samchon/github/samchon/claude-code/src/services/compact/compact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/autoCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/microCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/apiMicrocompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/sessionMemoryCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/grouping.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/postCompactCleanup.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/timeBasedMCConfig.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/compactWarningState.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/compactWarningHook.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/messages.ts`
- `/home/samchon/github/samchon/claude-code/src/QueryEngine.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/sessionStorage.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/toolSearch.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/compact/compact.ts`
- `/home/samchon/github/samchon/claude-code/src/processSlashCommand.tsx`

## 전체 구조

Claude Code의 compact는 하나의 요약 기능이 아니라 여러 계층의 context lifecycle이다.

| 계층 | 역할 | 핵심 파일 |
| --- | --- | --- |
| API-native context management | provider API의 thinking/tool result clearing 전략 생성 | `apiMicrocompact.ts` |
| microcompact | 오래된 tool result를 먼저 줄임 | `microCompact.ts`, `timeBasedMCConfig.ts` |
| auto compact | token threshold 기반으로 compact trigger 결정 | `autoCompact.ts` |
| full compact | 오래된 대화 요약, boundary 생성, post-compact restore | `compact.ts`, `prompt.ts` |
| partial compact | 선택 pivot 기준 앞/뒤만 요약하고 나머지 보존 | `compact.ts` |
| session memory compact | 별도 session memory를 summary source로 사용 | `sessionMemoryCompact.ts` |
| post cleanup | compact 이후 cache/state 정리 | `postCompactCleanup.ts` |

Agentica에 가져올 핵심은 "요약문 생성"이 아니라 "model-facing context를 재구성하고, 이어서 실행 가능한 상태를 복원하는 runtime transition"이다.

## Compact Boundary

주요 anchor:

- `createCompactBoundaryMessage()`: `utils/messages.ts:4530`
- `getMessagesAfterCompactBoundary()`: `utils/messages.ts:4643`
- SDK mutable history pruning: `QueryEngine.ts:917`
- preserved segment relink: `sessionStorage.ts:1839`
- discovered tool carry: `utils/toolSearch.ts:537`

Boundary는 `system` message의 `subtype: "compact_boundary"`로 들어가며 `compactMetadata`에 최소 `trigger`, `preTokens`, `userContext`, `messagesSummarized`를 담는다. full/partial/session-memory compact는 여기에 `preCompactDiscoveredTools`와 `preservedSegment`를 추가로 싣는다.

`getMessagesAfterCompactBoundary()`는 마지막 boundary부터의 slice만 model-facing context로 사용한다. QueryEngine은 boundary를 만나면 mutable history의 앞부분을 잘라 GC한다. 즉 compact는 transcript/UI scrollback과 model context를 분리한다.

`preservedSegment`는 partial/session-memory compact에서 보존된 최근 메시지를 on-disk transcript에 안전하게 재연결하기 위한 metadata다.

- `headUuid`: 보존 구간 첫 메시지
- `anchorUuid`: summary 또는 boundary
- `tailUuid`: 보존 구간 마지막 메시지

resume 시 `sessionStorage`는 tail에서 head까지 parent chain을 검증한 뒤, head의 parent를 anchor로 바꾸고 anchor의 다른 child를 tail 뒤로 붙인다. 검증이 실패하면 prune을 하지 않아 full history를 보존한다. 이 안전장치는 compact metadata가 잘못되어 대화가 유실되는 것보다 prompt가 커지는 쪽을 택한다.

## Full Compact Transaction

`compactConversation()`은 다음 순서로 실행된다.

1. pre-compact token count를 계산한다.
2. `pre_compact` hook을 실행하고 hook instruction을 사용자 instruction과 병합한다.
3. compact prompt를 만들고 summarizer를 호출한다.
4. compact request 자체가 prompt-too-long이면 API round 단위로 head를 잘라 최대 3회 재시도한다.
5. 기존 `readFileState`와 nested memory state를 비운다.
6. post-compact attachments를 병렬로 만든다.
7. session-start hook을 다시 실행한다.
8. compact boundary와 summary message를 만든다.
9. telemetry, prompt cache break notification, metadata re-append, optional transcript segment write를 수행한다.
10. `post_compact` hook을 실행한다.
11. `CompactionResult`를 반환한다.

`buildPostCompactMessages()`의 순서는 `boundaryMarker -> summaryMessages -> messagesToKeep -> attachments -> hookResults`다. Agentica도 compact 결과를 단순 history append가 아니라 ordering이 있는 commit으로 다뤄야 한다.

Manual `/compact` command도 같은 원칙을 따른다. `commands/compact/compact.ts`는 `LocalCommandResult`로 `type: "compact"`를 반환하고, `processSlashCommand.tsx`는 이를 일반 command stdout이 아니라 `buildPostCompactMessages()` transaction으로 처리한다. command input/stdout은 preserved tail에 합쳐져 compact boundary 뒤에 위치하고, compact 직후 resume ordering을 위해 stdout timestamp도 조정된다. 자세한 public command surface는 [Claude Code Slash Command Runtime 분석](./slash-command-runtime.md)에 분리했다.

## Summarizer 실행 방식

주요 anchor:

- tool 금지 policy: `compact.ts:1125`
- forked summarizer: `compact.ts:1188`
- streaming fallback: `compact.ts:1292`
- image/document stripping: `compact.ts:1294`
- compact boundary 이후만 summarize: `compact.ts:1296`
- max output token override: `compact.ts:1317`

Claude Code는 compact agent가 tool을 호출하지 못하게 `createCompactCanUseTool()`에서 모든 tool use를 deny한다. prompt도 "text only"를 강하게 요구한다.

기본 경로는 forked agent를 사용해 main conversation의 prompt cache prefix를 공유한다. 실패하면 별도 streaming query로 fallback한다. fallback query는 `getMessagesAfterCompactBoundary(messages)`에 summary request를 붙이고, image/document block을 placeholder로 바꾸며, reinjected attachment는 제거한다.

Prompt cache 공유 경로에서는 `maxOutputTokens`를 별도로 설정하지 않는다. main thread와 cache key가 달라지는 것을 피하기 위한 선택이다. Agentica도 compact를 별도 LLM request로 만들 때 model/vendor별 cache key와 request option mismatch를 고려해야 한다.

## Compact Prompt

`prompt.ts`는 compact summary에 다음을 요구한다.

- 사용자 요청과 의도
- 주요 기술 개념
- 파일과 코드 구간
- 에러와 수정
- 문제 해결 과정
- 모든 user message
- pending task
- current work
- optional next step

모델에는 `<analysis>`와 `<summary>`를 쓰게 하지만 `formatCompactSummary()`는 `<analysis>` 블록을 제거한다. 즉 고품질 요약을 위해 scratchpad는 허용하되, 다음 context에는 요약 결과만 넣는다.

Agentica는 이 prompt를 그대로 쓰기보다 function-calling 중심으로 바꿔야 한다.

- 선택된 operation과 취소된 operation
- 실행된 operation, arguments, return preview
- validation/json parse 실패와 retry history
- pending stack
- 현재 user intent
- 다음 call/describe에서 필요한 state

## Post-Compact Restore

Claude Code는 summary 외에도 다음 attachments를 재주입한다.

| attachment | 목적 |
| --- | --- |
| 최근 read file attachment | compact로 사라진 file content 복원 |
| async agent task status | background agent 중복 spawn 방지 및 결과 회수 경로 유지 |
| plan file reference | plan mode/task plan 유지 |
| plan mode reminder | compact 이후에도 plan mode 지시 유지 |
| invoked skills | 이미 사용한 skill 지침 복원 |
| deferred tools delta | compact summary로 사라진 tool reference 재공표 |
| agent listing delta | sub-agent 목록 재공표 |
| MCP instructions delta | MCP tool instruction 재공표 |
| session-start hook result | CLAUDE.md 등 session context 복원 |

Agentica에서 대응되는 restore 대상은 file이 아니라 operation/runtime state다.

- pending operation stack
- selected candidate set
- selected operation full schemas
- validation retry facts
- 최근 execute result preview/reference
- large result external reference
- current user prompt
- common/system prompt
- selector local index snapshot 또는 selected operation ids

## Microcompact

주요 anchor:

- compactable tool set: `microCompact.ts:41`
- cached microcompact entry: `microCompact.ts:253`
- cached delete result: `microCompact.ts:332`
- time-based trigger: `microCompact.ts:422`
- time-based content clearing: `microCompact.ts:446`

microcompact는 full summary 전의 경량 shrink 계층이다. compactable 대상은 file read, shell, grep/glob, web fetch/search, edit/write 등 tool result가 큰 도구다.

두 경로가 있다.

1. cached microcompact: message content는 그대로 두고 API layer에 `cache_edits` block을 넘긴다. 서버 cache를 보존하면서 특정 tool result를 지우기 위한 경로다.
2. time-based microcompact: server prompt cache TTL이 지나 cache hit를 기대하기 어려우면 오래된 tool result content를 `[Old tool result content cleared]`로 직접 바꾼다.

time-based microcompact는 main thread에만 적용한다. subagent는 생명주기가 짧아 gap-based eviction 가치가 낮기 때문이다.

Agentica 적용 시 microcompact는 "execute result budget"으로 번역해야 한다. class/http/mcp result를 full JSON으로 계속 넣지 않고, 오래된 대형 result는 preview와 reference로 나눠야 한다.

## Auto Compact

주요 anchor:

- effective context window: `autoCompact.ts:33`
- warning/error/auto threshold: `autoCompact.ts:93`
- auto compact gate: `autoCompact.ts:160`
- session memory 우선 compact: `autoCompact.ts:299`
- consecutive failure circuit breaker: `autoCompact.ts:281`

Auto compact는 모델 context window에서 summary output reserve를 뺀 effective window를 기준으로 threshold를 계산한다. threshold는 warning, error, auto compact, blocking 용도로 나뉜다. 실패가 연속 3회 발생하면 circuit breaker로 자동 compact를 중지한다.

또한 session memory compaction이 가능하면 legacy full compact보다 먼저 시도한다. session memory 결과가 threshold를 넘으면 fallback한다.

Agentica에는 현재 model context window table이 없다. 따라서 1차 설계는 `config.runtime.context.maxInputTokens`와 `outputReserveTokens`를 명시적으로 받는 방식이 안전하다.

## Session Memory Compact

주요 anchor:

- 기본 keep config: `sessionMemoryCompact.ts:57`
- API invariant 보존: `sessionMemoryCompact.ts:232`
- keep index 계산: `sessionMemoryCompact.ts:324`
- feature gate: `sessionMemoryCompact.ts:403`
- session memory result 생성: `sessionMemoryCompact.ts:437`
- threshold fallback: `sessionMemoryCompact.ts:604`

session memory compact는 이미 추출된 session memory를 summary source로 사용한다. 이때도 최근 메시지 일부는 그대로 보존한다. 보존 구간은 최소 token 수, 최소 text-block message 수, 최대 token cap으로 계산하며, tool_use/tool_result pair와 streaming assistant message id가 갈라지지 않도록 start index를 뒤로 확장한다.

Agentica에는 아직 별도 session memory 추출기가 없다. 당장 필요한 것은 사용자 memory보다 operation execution memory다. 따라서 session memory compact는 장기 단계로 두고, 1차는 history projection과 large result reference부터 시작한다.

## Grouping과 PTL Retry

`groupMessagesByApiRound()`는 assistant response id가 바뀌는 지점을 API round boundary로 본다. prompt-too-long retry는 가장 오래된 API round 그룹부터 제거한다. 사람 user turn 기준이 아니라 API round 기준인 이유는 SDK/agentic workload가 하나의 user prompt 안에서 여러 API round를 돌 수 있기 때문이다.

Agentica도 retry truncation을 user message 단위로만 잡으면 function call pair를 깨기 쉽다. 최소 단위는 "assistant tool call + tool result + 후속 assistant"가 API에 안전하게 들어가는 operation round여야 한다.

## Post Cleanup

`runPostCompactCleanup()`은 compact 후 다음 상태를 정리한다.

- microcompact state reset
- context collapse guard reset
- user context와 memory file cache reset
- system prompt section cache reset
- classifier approval/speculative check/beta tracing/cache reset
- session message cache reset

반대로 invoked skill content와 sent skill names는 의도적으로 유지한다. compact 후 full skill listing을 다시 넣는 비용이 크기 때문이다.

Agentica도 compact 후 무조건 모든 cache를 비우면 안 된다. local operation index, selected operation cache, token usage는 유지하고, model-facing projection cache와 stale result budget state만 정리해야 한다.

## Agentica에 적용할 결론

1. Compact는 `summary`가 아니라 `boundary + summary + preserved tail + restore attachments + cleanup`이다.
2. Boundary metadata는 public JSON과 internal runtime state를 분리해서 설계해야 한다.
3. `systemMessage` 호환 모드만으로는 preservedSegment, selected operations, large result refs를 충분히 담기 어렵다.
4. 큰 execute result는 full compact 전에 microcompact/result budget으로 먼저 줄여야 한다.
5. prompt-too-long retry는 user turn이 아니라 API/function-call round 단위로 해야 한다.
6. compact LLM request는 tool calling 금지, max output reserve, retry, no-summary/api-error handling이 필요하다.
7. compact 이후에는 pending stack, selected operations, validation feedback, result refs, system prompt를 다시 주입해야 한다.
8. `MicroAgentica`에는 이 runtime compact 계층을 넣지 않는다.
