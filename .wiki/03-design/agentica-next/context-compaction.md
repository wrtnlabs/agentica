# 컨텍스트 압축 설계

## 목표

Agentica는 긴 대화와 반복 function calling에서 history가 계속 커진다. 압축 계층은 비용 절감뿐 아니라 prompt-too-long 실패 복구를 위해 필요하다.

이 문서의 압축 계층은 `Agentica` 대상이다. `MicroAgentica`는 단순함이 핵심이므로 자동 압축 runtime을 넣지 않는다.

## 설계 원칙

- 압축은 history를 삭제하는 기능이 아니라 다음 turn을 안전하게 계속하기 위한 context projection이다.
- tool/function call과 result의 pairing invariant를 깨면 안 된다.
- user turn이 아니라 API/function-call round 단위의 안전한 절단 지점이 필요하다.
- validation feedback, failed arguments, pending function selection은 summary에 반드시 남겨야 한다.
- compact 후에는 summary 외에 실행 지속에 필요한 operational attachment를 복원해야 한다.
- 압축 request에서는 tool calling을 금지한다.
- public history와 model-facing projected context를 분리한다.

## 단계

### Microcompact

큰 function result를 먼저 줄인다.

- 오래된 read/search/list 성격 결과는 stub으로 치환한다.
- 큰 JSON/HTML/text result는 preview와 reference로 나눈다.
- class/http/mcp 결과 모두에 공통으로 적용하되, operation metadata로 opt-out할 수 있게 한다.
- cache를 보존하는 provider-specific clearing과 실제 history content replacement는 별도 전략으로 둔다.

필요 타입:

```typescript
interface IAgenticaResultBudgetConfig {
  maxResultCharacters?: number;
  maxResultTokens?: number;
  preserveRecentResults?: number;
}
```

### Auto Compact

token estimate가 threshold를 넘으면 summary를 만든다.

- context window에서 output reserve를 뺀 effective window를 기준으로 한다.
- `warning`, `autoCompact`, `blocking` threshold를 분리한다.
- auto compact 실패가 반복되면 circuit breaker를 둔다.
- `MicroAgentica`에는 이 threshold runtime을 연결하지 않는다.

### Reactive Compact

LLM API가 prompt-too-long 계열 오류를 반환하면 즉시 사용자에게 실패를 노출하지 않는다.

1. 오류 assistant message를 내부적으로 보류한다.
2. compact를 시도한다.
3. post-compact messages로 같은 turn을 재시도한다.
4. compact request 자체가 prompt-too-long이면 오래된 operation/API round를 잘라 재시도한다.
5. 한 번 실패하면 error를 노출하고 stop hook/describe로 들어가지 않는다.

### Manual Compact Command

Claude Code의 `/compact`는 local command지만 stdout text를 일반 user turn 뒤에 붙이지 않는다. command result가 `compact`이면 command input/stdout을 preserved tail에 합치고, compact boundary와 summary를 먼저 만든 뒤 post-compact messages를 재구성한다.

Agentica의 manual compact도 같은 transaction이어야 한다.

- command input은 user intent로 저장하되 다음 model request의 새 user prompt로 취급하지 않는다.
- compact result는 `boundary -> summary -> preserved tail -> restore attachments` 순서를 지킨다.
- compact command 출력은 chat UI용 짧은 marker와 internal metadata로 나눈다.
- compact 후 microcompact/result-budget state를 reset하되 operation index와 selected candidate cache는 유지한다.
- remote/headless manual compact는 allowlist된 local command로만 허용한다.

### Compact Boundary

압축 후 history에는 boundary가 필요하다.

보존해야 할 metadata:

- compact trigger: manual/auto/reactive
- pre-compact token estimate
- post-compact token estimate
- last summarized history id
- summarized history ids
- preserved history ids
- selected/discovered operation names
- pending stack
- 최근 validation failure 요약
- large result reference 목록

초기 구현에서는 이 metadata를 public `systemMessage.text`에 모두 넣지 않는다. `systemMessage`는 사람이 보는 짧은 marker로 쓰고, 구조화된 metadata는 internal runtime state로 둔다. 공개 JSON 확장은 [Runtime Public Surface 설계](./runtime-public-surface-design.md)의 phase를 따른다.

## Post-Compact Restore

Claude Code에서 가장 중요한 부분은 compact 후 필요한 context를 다시 붙이는 것이다. Agentica에서는 다음을 복원해야 한다.

- 현재 user request
- compact summary
- pending operation stack
- 최근 function result preview/reference
- validation feedback history
- operation search index의 selected candidates
- system common prompt
- operation policy/runtime metadata
- local selector가 이미 좁힌 candidate set

`@agentica/core`는 파일 시스템을 전제로 하면 안 되므로 restore source는 pluggable이어야 한다.

Claude Code의 post-compact restore는 file/plan/skill/tool/agent/MCP attachment를 복원한다. Agentica의 대응물은 operation schema, selected candidates, pending stack, validation retry facts, execute result refs다.

## Prompt 설계

Compact prompt는 다음 섹션을 요구한다.

- 사용자 요청과 의도
- 호출된 functions와 arguments
- function result의 핵심 값
- 실패한 validation과 수정 방향
- 현재 pending task
- 다음 turn에서 바로 이어가기 위한 state

Claude Code처럼 "모든 사용자 메시지"를 장황하게 요구하는 방식은 library 사용자에게 과할 수 있다. Agentica는 function calling 중심이므로 function selection/call/validation/result 상태를 우선한다.

## 구현 위치

권장 위치:

- `packages/core/src/context/AgenticaContextManager.ts`
- `packages/core/src/context/AgenticaCompaction.ts`
- `packages/core/src/orchestrate/compact.ts`
- `packages/core/src/context/AgenticaContextProjector.ts`
- `packages/core/src/context/AgenticaRuntimeState.ts`
- 장기 단계: `packages/core/src/histories/AgenticaCompactHistory.ts`

기존 history JSON과 호환성을 유지하려면 1차는 `systemMessage` marker와 internal runtime state로 시작한다. 새 compact history type은 transformHistory, decodeHistory, RPC, chat renderer를 동시에 준비할 때 추가한다.

## Claude Code에서 직접 배운 불변식

- compact 결과 ordering은 중요하다: boundary, summary, preserved tail, restore attachments, hook results 순서가 필요하다.
- compact 후 cache cleanup은 선별적으로 해야 한다. operation index와 token usage까지 무조건 비우면 안 된다.
- compact LLM request는 tool calling을 명시적으로 금지해야 한다.
- prompt-too-long retry는 가장 오래된 안전 round부터 제거해야 한다.
- boundary metadata가 깨지면 data loss보다 full history 보존을 선택해야 한다.
