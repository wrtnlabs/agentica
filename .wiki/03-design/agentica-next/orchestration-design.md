# Agentica Orchestration 재설계

## 현행 Orchestration

`packages/core/src/orchestrate/execute.ts`는 다음 순서다.

1. ready가 아니면 initialize
2. stack이 있으면 cancel
3. select
4. stack이 비었으면 종료
5. call
6. describe
7. execute 결과가 있고 stack이 남아 있으면 반복

이 구조는 이해하기 쉽지만 context 관리와 recovery가 들어갈 자리가 좁다.

## 유지할 부분

`call.ts`는 강점이다.

- assistant empty message retry
- function arguments JSON parse failure feedback
- typia validation feedback
- validation repeated prompt
- class/http/mcp execution dispatch
- execute event 생성

새 runtime에서도 caller는 최대한 재사용한다.

## 교체할 부분

`initialize/cancel/select/call/describe`를 고정 pipeline으로 보는 관점을 버린다. 대신 한 turn을 아래 phase로 본다.

### 1. Prepare Context

- histories를 projected messages로 변환한다.
- result budget을 적용한다.
- 필요 시 microcompact를 적용한다.
- prompt-too-long 위험이면 full compact를 선제 수행한다.
- 활성 skill/approved plan/pending task/connector registry hot-swap 정보를 projection한다.
- memory/skill/connector prefetch를 시작하되, settled 결과만 zero-wait로 consume한다.
- compact boundary 이후 history, replacement store, collapse store, task budget carryover를 함께 본다.

### 2. Select Operations

- local operation index로 후보를 찾는다.
- selector strategy가 후보를 확정한다.
- stack을 갱신하고 select event를 dispatch한다.

### 3. Call Model

- 선택된 operation full schema만 tools에 넣는다.
- call request를 실행한다.
- tool calls가 없고 assistant message가 있으면 응답으로 종료 가능하다.
- streaming assistant/tool call은 곧바로 확정하지 않고 pending transcript에 둔다.
- streaming fallback이나 model fallback이 발생하면 pending assistant/tool_use를 tombstone 또는 discard하고 재시도한다.

### 4. Execute Operations

- operation metadata에 따라 병렬/순차 실행을 결정한다.
- 모든 tool call은 execute history 또는 failure history를 남긴다.
- abort/failure도 다음 request가 깨지지 않는 형태로 남긴다.
- user interaction, plan approval, scheduled trigger는 즉시 business operation 실행과 분리된 transition으로 처리한다.
- concurrency-safe operation batch와 exclusive operation을 나눈다.
- context modifier는 final result yield 순서가 아니라 operation order에 맞춰 적용한다.
- progress event는 즉시 내보내되, final execute result와 분리한다.
- 한 operation 실패가 sibling operation을 abort할지 여부는 operation kind별 정책으로 둔다.

### 4A. Drain Runtime Attachments

- pending task notification, memory attachment, skill discovery result, connector registry update를 model-visible attachment로 투영한다.
- slash/local command는 mid-turn attachment로 흘리지 않고 command processor로 보낸다.
- subagent는 자기 scope의 task notification만 본다.
- consumed command만 lifecycle started/completed를 기록한다.

### 5. Continue or Finish

- tool result가 있으면 다음 iteration으로 간다.
- describe가 필요한 경우 describe phase로 간다.
- max turns와 token budget을 체크한다.

### 6. Reactive Recovery

다음 오류는 별도 transition으로 처리한다.

- prompt too long
- max output tokens
- model/provider fallback
- malformed assistant/tool result invariant

## Transition 모델

```typescript
type AgenticaRuntimeTransition =
  | { reason: "next_turn" }
  | { reason: "selected"; count: number }
  | { reason: "no_operation" }
  | { reason: "compacted"; trigger: "manual" | "auto" | "reactive" }
  | { reason: "collapse_drain_retry"; committed: number }
  | { reason: "max_output_tokens_escalate" }
  | { reason: "max_output_tokens_recovery"; attempt: number }
  | { reason: "stop_hook_blocking" }
  | { reason: "token_budget_continuation" }
  | { reason: "validation_retry"; operation: string }
  | { reason: "awaiting_user"; interactionId: string }
  | { reason: "plan_mode_entered" | "plan_approved" | "plan_rejected" }
  | { reason: "connector_registry_updated" }
  | { reason: "scheduled"; scheduleId: string }
  | { reason: "prompt_too_long_retry" }
  | { reason: "max_turns"; turn: number }
  | { reason: "aborted" };
```

테스트는 "입력 state와 fake deps가 있을 때 어떤 transition이 나오는가"로 작성한다.

## Config 초안

```typescript
interface IAgenticaRuntimeConfig {
  selector?: {
    type?: "llm" | "local" | "hybrid";
    topK?: number;
    minScore?: number;
  };
  context?: {
    maxTurns?: number;
    maxInputTokens?: number;
    autoCompact?: boolean;
    resultBudget?: {
      maxCharacters?: number;
      preserveRecent?: number;
    };
  };
  mode?: {
    defaultMode?: "default" | "plan" | "acceptEdits" | "dontAsk" | "auto";
    allowUserQuestions?: boolean;
    allowPlanMode?: boolean;
  };
  connectors?: {
    allowExternalNetwork?: boolean;
    allowRuntimeRegistryUpdate?: boolean;
  };
}
```

기존 `IAgenticaConfig`에 바로 많은 필드를 추가하기보다 `runtime` 또는 `experimental` namespace를 두는 편이 안전하다.

## Plan/User Interaction Loop

Claude Code의 plan 도구군은 다음 구조다.

1. EnterPlanMode가 runtime permission mode를 `plan`으로 바꾼다.
2. 모델은 read-only 탐색과 plan 작성만 한다.
3. ExitPlanMode가 사용자 또는 team lead approval을 받는다.
4. 승인된 plan artifact와 복원할 permission mode를 runtime state에 저장한다.
5. 다음 model call에서 approved plan을 짧게 projection하고 실행을 시작한다.

Agentica에서는 이를 `Agentica.conversate()` 안의 일반 assistant message로 흘리지 말고 runtime transition으로 둔다. UI/RPC가 interaction을 렌더링하지 못하는 channel이면 해당 tool/mode를 비활성화해야 한다.

## Streaming/Tool Execution Loop

Claude Code `StreamingToolExecutor`에서 가져올 operation 실행 원칙:

- model streaming 중 operation call이 도착하면 즉시 enqueue한다.
- operation metadata의 `isConcurrencySafe(args)`가 true인 operation끼리만 병렬 실행한다.
- exclusive operation은 앞선 operation이 끝날 때까지 뒤를 막는다.
- progress는 즉시 render/RPC projection으로 보내고, final execute result는 operation order로 정렬한다.
- fallback/discard가 발생하면 old operation id에 대한 result는 synthetic error로 닫아 tool call/result pairing을 보존한다.
- sibling abort는 모든 operation 실패에 적용하지 않는다. Claude Code도 Bash error만 sibling Bash subprocess를 죽이고 read/web fetch 실패는 독립으로 둔다.

Agentica 초안:

```typescript
interface AgenticaOperationExecutionPolicy {
  isConcurrencySafe(args: unknown): boolean;
  interruptBehavior?: "block" | "cancel";
  siblingFailurePolicy?: "ignore" | "cancel-same-kind" | "cancel-batch";
  applyContextModifierOrder?: "operation-order" | "completion-order";
}
```

`MicroAgentica`의 단순 call path는 이 loop를 공유하지 않는다. `Agentica` runtime wrapper가 operation execution policy를 읽어 `call.ts`를 감싸는 방식으로 시작한다.

## Migration 전략

1. legacy executor는 그대로 둔다.
2. 새 runtime은 `config.executor`를 통해 opt-in 가능하게 한다.
3. local selector는 legacy executor에서도 사용할 수 있게 독립 함수로 만든다.
4. 충분히 검증되면 `Agentica` 기본 executor를 hybrid runtime으로 전환한다.
5. `MicroAgentica`는 opt-in 대상에서도 제외한다.
