# Agentica Sub-agent/Runtime 설계

이 문서는 Claude Code `AgentTool` 분석을 Agentica Next 설계로 번역한 초안이다. 지금은 구현하지 않고 `.wiki` 계획서로만 유지한다.

## 목표

Agentica의 기존 public facade는 유지하면서 내부 실행을 phase lifecycle 중심으로 재구성한다.

목표:

- context projection과 compaction을 runtime이 관리한다.
- local RAG selector와 기존 selector를 같은 phase로 끼울 수 있다.
- long-running call/workflow를 task로 관찰할 수 있다.
- operation policy와 permission gate를 selection/call 양쪽에 둔다.
- MicroAgentica는 변경하지 않는다.

## Runtime primitive

제안 type:

```ts
interface AgenticaRuntimePhase<Input, Output> {
  name: string;
  source: AgenticaEventSource | "compact" | "policy" | "task";
  run(ctx: AgenticaRuntimeContext, input: Input): Promise<Output>;
  cleanup?(ctx: AgenticaRuntimeContext): Promise<void>;
}
```

이 type은 당장 public export가 아니라 internal 설계 anchor다.

기존 agent와 매핑:

| 기존 | runtime phase |
| --- | --- |
| initialize | `InitializePhase` |
| select | `SelectPhase` |
| vector selector | `LocalRetrievePhase` + `SelectPhase` |
| call | `CallPhase` |
| validate/jsonParseError retry | `CallRepairPhase` |
| describe | `DescribePhase` |
| cancel | `CancelPhase` |
| compact | `CompactPhase` |
| policy | `PolicyGatePhase` |

## Sub-agent는 1차 목표가 아니다

Claude Code의 sub-agent는 매우 강력하지만 Agentica에 바로 이식하면 scope가 커진다.

1차 목표:

- sub-agent API를 만들기보다 runtime phase를 먼저 만든다.
- "selection reviewer", "policy reviewer", "describe reviewer"처럼 내부 phase를 독립 실행 가능하게 만든다.
- 이후 필요하면 phase를 background task로 승격한다.

## Team Member Runtime은 Sub-agent보다 크다

Claude Code `utils/swarm` 추가 분석 결과, swarm teammate는 단순 sub-agent call이 아니다.

차이:

- sub-agent: parent가 한 번 작업을 위임하고 결과를 받는 실행 단위
- teammate: 독립 identity, mailbox, task list, permission mode, idle loop, shutdown negotiation을 가진 장기 실행 member

Agentica에서 1차 구현은 sub-agent public API가 아니라 internal `AgenticaTeamRuntime`이어야 한다.

```ts
interface AgenticaTeamExecutor {
  spawn(config: AgenticaTeamMemberSpawnConfig): Promise<AgenticaTeamMemberSpawnResult>;
  sendMessage(memberId: string, message: AgenticaTeamMessage): Promise<void>;
  terminate(memberId: string, reason?: string): Promise<boolean>;
  kill(memberId: string): Promise<boolean>;
  isActive(memberId: string): Promise<boolean>;
}
```

초기 backend는 in-process만 구현 대상으로 둔다. tmux/iTerm2 같은 pane backend는 Agentica core의 목표가 아니다. 다만 Claude Code의 `PaneBackendExecutor` 구조처럼 executor interface는 backend를 숨겨야 한다. 그래야 후속 phase에서 local child process, remote session, 외부 TUI adapter를 붙여도 team/mailbox/task lifecycle을 다시 설계하지 않는다.

Agentica 적용 원칙:

- backend mode는 session 시작 시 snapshot으로 고정한다.
- `spawn`, `sendMessage`, `terminate`, `kill`, `isActive` contract는 backend와 무관하게 유지한다.
- initial prompt와 shutdown/mode/permission control은 CLI argv가 아니라 mailbox/control adapter로 전달한다.
- env/flag inheritance가 필요한 backend는 allowlist와 policy mode를 거쳐야 한다.
- external pane id, mailbox path, local process command는 public history/RPC event에 노출하지 않는다.
- graceful terminate와 force kill은 별도 transition으로 둔다.

## In-process Member Loop

Claude Code `inProcessRunner`는 일반 agent loop를 재사용하되 teammate 전용 lifecycle을 덧씌운다.

Agentica에 옮길 원칙:

- member별 execution identity는 AsyncLocalStorage 또는 명시 context object로 격리한다.
- parent history dump를 넘기지 않고 member-local history를 유지한다.
- member-local token budget을 넘으면 parent와 별도로 compact한다.
- parent turn abort와 member lifecycle abort를 분리한다.
- 현재 work abort는 member를 죽이지 않고 idle 상태로 되돌린다.
- idle은 terminal 상태가 아니다. mailbox/task-list input을 기다리는 상태다.
- shutdown request는 자동 승인하지 않고 member에게 판단시키거나 policy로 gate한다.

```ts
interface AgenticaTeamMemberRuntimeState {
  id: string;
  name: string;
  status: "starting" | "running" | "idle" | "stopping" | "stopped" | "failed";
  taskId?: string;
  backend: "in-process" | "local-child-process" | "external-pane" | "remote";
  permissionMode: AgenticaRuntimeMode;
  currentWorkAbortController?: AbortController;
}
```

이 구조는 `Agentica` internal runtime state에만 둔다. public `Agentica.conversate()` 계약은 유지한다.

## Agent definition의 Agentica식 번역

Claude Code `AgentDefinition`을 그대로 가져오지 않는다. Agentica에는 operation/controller 중심 metadata가 더 적합하다.

제안 metadata:

```ts
interface AgenticaOperationMetadata {
  operationKey: string;
  controller: string;
  function: string;
  protocol: "http" | "class" | "mcp";
  summary: string;
  keywords: string[];
  domains: string[];
  sideEffect: "read" | "write" | "destructive" | "unknown";
  requiresConfirmation?: boolean;
  requiredContext?: string[];
  costHint?: "low" | "medium" | "high";
}
```

이 metadata는 `AgenticaOperation`을 변경하지 않고 local index에서 관리한다.

## Task model

Claude Code는 async/background agent를 task로 관리한다. 추가로 확인한 `tasks`/`utils/task` 구조를 보면 task model의 본질은 다음 분리다.

- runtime state: status, owner, foreground/background, notification 여부
- output store: disk/adaptor reference, offset, tail/delta read
- notification queue: 다음 model turn에 넣을 runtime signal
- SDK/UI event: 사용자에게 보이는 progress/termination
- cleanup/eviction: terminal transition 이후 별도 처리

Agentica에도 장기 실행 workflow가 필요하면 task model을 둔다. 단, public event union에 바로 추가하지 않고 `Agentica` internal runtime wrapper 안에서 먼저 검증한다.

초기 internal event:

- `taskStart`
- `taskProgress`
- `taskComplete`
- `taskFail`
- `taskStop`

주의:

- public event union에 바로 추가하지 않는다.
- 먼저 optional internal listener 또는 experimental config로 제한한다.
- RPC/chat 영향을 확인한 뒤 public JSON으로 승격한다.
- task output은 execute history에 inline하지 않고 `AgenticaTaskOutputRef`로 둔다.
- terminal status와 notification/eviction은 분리한다.
- stop은 실패가 아니라 control transition이다.
- remote/durable task는 sidecar resume metadata가 준비된 뒤 연다.

초안:

```ts
interface AgenticaTaskRuntimeState {
  id: string;
  type: "operation" | "workflow" | "agent" | "maintenance" | "remote";
  status: "pending" | "running" | "completed" | "failed" | "stopped";
  owner?: string;
  operationKey?: string;
  outputRef?: AgenticaTaskOutputRef;
  outputOffset: number;
  notified: boolean;
  startedAt: number;
  endedAt?: number;
  resumeRef?: string;
}
```

## Policy gate

Call 직전 policy gate를 둔다.

입력:

- operation metadata
- arguments
- user prompt/history
- prior approvals
- controller policy

출력:

- `allow`
- `ask`
- `deny`
- `allowWithWarning`

selector 단계에서도 policy를 쓰되, 최종 방어선은 call 직전이어야 한다.

## Context projection

Claude Code sub-agent는 parent context를 그대로 넘기지 않고 agent별로 줄이거나 변형한다. Agentica도 phase별 projection이 필요하다.

예:

- `LocalRetrievePhase`: recent user prompt, operation index, compact summary
- `SelectPhase`: retrieved operations, high-level history, user locale/timezone
- `CallPhase`: selected operations, exact required arguments, validation repair history
- `DescribePhase`: execute results, user-facing output preference
- `CompactPhase`: full histories, operation references, token usage

## Cleanup 규약

각 phase가 외부 resource를 쓰면 cleanup이 필요하다.

예:

- MCP temporary connection
- local index write lock
- background task registry
- streaming response finalizer
- telemetry/progress tracker
- team registry, mailbox lock, child execution abort controller

현재 Agentica orchestration은 cleanup boundary가 약하다. runtime phase를 만들 때 `try/finally` 중심으로 이동한다.

## 도입 순서

1. 문서와 type-only 설계 확정
2. local operation index internal 구현
3. selector를 phase wrapper로 감싸기
4. context projector 추가
5. compact summary를 `systemMessage` 호환 모드로 추가
6. policy metadata inference 추가
7. call-time policy gate experimental 추가
8. task runtime/outputRef internal 구현 검토
9. task event/RPC/chat 확장 검토

이 순서를 지키면 public API와 MicroAgentica를 흔들지 않고 Claude Code의 장점을 흡수할 수 있다.
