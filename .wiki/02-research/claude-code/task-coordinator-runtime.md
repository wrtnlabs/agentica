# Claude Code Task/Coordinator Runtime 정밀 분석

## 범위

대상은 `/home/samchon/github/samchon/claude-code/src/tasks`, `/home/samchon/github/samchon/claude-code/src/utils/task`, `/home/samchon/github/samchon/claude-code/src/coordinator`다.

주요 근거 파일:

| 파일 | 관찰 지점 |
| --- | --- |
| `src/Task.ts` | task type/status/base state/id/output path 계약 |
| `src/tasks.ts` | task registry와 feature-gated task loading |
| `src/utils/task/framework.ts` | task registration, polling, output offset, eviction, notification |
| `src/utils/task/diskOutput.ts` | disk-backed task output, security flags, delta/tail read |
| `src/tasks/LocalShellTask/*` | background shell, prompt stall watchdog, orphan cleanup |
| `src/tasks/LocalAgentTask/LocalAgentTask.tsx` | async agent lifecycle, progress, pending message, foreground/background |
| `src/tasks/LocalMainSessionTask.ts` | main query backgrounding |
| `src/tasks/RemoteAgentTask/RemoteAgentTask.tsx` | remote session polling, sidecar restore, completion checker |
| `src/tasks/InProcessTeammateTask/*` | in-process teammate lifecycle and mailbox bridge |
| `src/tasks/DreamTask/DreamTask.ts` | memory consolidation task |
| `src/tasks/stopTask.ts` | shared stop transition |
| `src/coordinator/coordinatorMode.ts` | coordinator mode prompt and worker orchestration rules |

## Task Contract

Claude Code의 task는 "도구 실행 결과"가 아니라 long-running work를 AppState, disk output, message queue, SDK event로 연결하는 runtime primitive다.

`src/Task.ts`의 핵심 계약:

- `TaskType`: `local_bash`, `local_agent`, `remote_agent`, `in_process_teammate`, `local_workflow`, `monitor_mcp`, `dream`.
- `TaskStatus`: `pending`, `running`, `completed`, `failed`, `killed`.
- `TaskStateBase`: `id`, `type`, `status`, `description`, `toolUseId`, `startTime`, `endTime`, `totalPausedMs`, `outputFile`, `outputOffset`, `notified`.
- `Task` interface는 현재 polymorphic `kill()`만 가진다. spawn/render는 type별 구현으로 밀려 있다.
- task id는 type prefix와 random 8자 조합이다. prefix는 bash `b`, agent `a`, remote `r`, teammate `t`, workflow `w`, monitor `m`, dream `d`다.
- `createTaskStateBase()`는 생성 시점부터 `outputFile`을 `getTaskOutputPath(id)`로 고정하고 `outputOffset=0`, `notified=false`로 시작한다.

의미:

- task identity, output reference, notification 여부가 task 생성 시점부터 묶인다.
- task 종료와 알림은 별도 단계다. 종료됐지만 아직 모델/SDK/UI에 알리지 않은 task는 AppState에 남을 수 있다.
- `outputOffset`은 "다음 polling 때 어디서부터 읽을지"를 나타내는 runtime cursor다.

`src/tasks.ts`는 registry 역할을 한다. 기본 task는 `LocalShellTask`, `LocalAgentTask`, `RemoteAgentTask`, `DreamTask`이고, `LocalWorkflowTask`, `MonitorMcpTask`는 feature flag로 require된다. 현재 공개 snapshot에서는 feature-gated 구현 일부가 보이지 않으므로, 설계 원칙만 반영한다.

## AppState Integration

`src/state/AppStateStore.ts`는 unified task state를 `tasks: { [taskId: string]: TaskState }`로 가진다. 여기에 `agentNameRegistry`, `foregroundedTaskId`, `viewingAgentTaskId`가 붙는다.

중요한 점:

- task는 UI용 상태가 아니라 headless/SDK/remote 경로에서도 쓰는 central runtime state다.
- remote viewer mode에서는 local `AppState.tasks`가 비고 remote daemon child의 background task count만 event-sourced로 보인다.
- foreground task와 background task는 같은 task state 안에서 `isBackgrounded`로 갈라진다.
- teammate view는 별도 `viewingAgentTaskId`로 leader transcript와 child transcript를 전환한다.

Agentica 적용 시 AppState라는 이름을 그대로 가져올 필요는 없다. 다만 runtime state에 task map, foreground/background marker, output cursor, registry version을 둬야 한다.

## Output Store

`src/utils/task/diskOutput.ts`는 task output을 memory가 아니라 disk-backed append log로 둔다.

핵심 구조:

- output dir은 project temp dir 아래 session id별 `tasks` 경로다.
- 첫 호출 때 captured session id를 고정한다. `/clear` 등으로 session이 바뀌어도 이미 돌던 background task output path가 흔들리지 않는다.
- output cap은 5GB다.
- `DiskTaskOutput`은 append queue를 가지고 단일 drain loop로 파일에 쓴다.
- `appendTaskOutput()`은 fire-and-forget append다.
- `flushTaskOutput()`은 현재 pending write가 끝날 때까지 기다린다.
- `getTaskOutputDelta(taskId, fromOffset, maxBytes)`는 파일 전체가 아니라 offset 이후 일부만 읽는다.
- `getTaskOutput(taskId, maxBytes)`는 tail read를 하고 생략량을 prefix로 붙인다.
- `evictTaskOutput()`은 memory map만 비우고 파일은 남긴다.
- `cleanupTaskOutput()`은 파일까지 삭제한다.
- `initTaskOutput()`은 `O_NOFOLLOW`, `O_EXCL`을 사용해 symlink-following과 기존 파일 덮어쓰기를 막는다.
- `initTaskOutputAsSymlink()`는 agent transcript 같은 별도 파일을 task output path에 symlink한다. 실패하면 일반 output file로 fallback한다.

Claude Code의 중요한 분리:

- 원본 출력은 disk에 둔다.
- model-facing 알림에는 output file reference만 넣는다.
- UI는 tail/delta를 읽는다.
- 완료 후에도 파일을 즉시 지우지 않고 memory writer만 evict할 수 있다.

Agentica에 그대로 필요한 원칙이다. 대형 operation result, long-running workflow log, remote connector log를 history JSON에 직접 넣지 말고 `AgenticaResultReference` 또는 `AgenticaTaskOutputRef`로 관리해야 한다.

## Framework Polling

`src/utils/task/framework.ts`는 task 공통 lifecycle을 담당한다.

주요 흐름:

- `registerTask()`가 AppState에 task를 넣고 SDK `task_started`를 낸다.
- local-agent류 task를 replacement register할 때는 startTime/messages/pendingMessages/diskLoaded 같은 기존 상태를 보존한다.
- `generateTaskAttachments()`는 running task의 output delta를 읽고 `outputOffset` patch를 만든다.
- terminal이면서 `notified`된 task는 lazy GC 대상이 된다.
- `applyTaskOffsetsAndEvictions()`는 async read 이후 fresh state를 다시 확인해 offset patch와 eviction을 적용한다. 읽는 동안 status가 바뀐 task를 되살리지 않기 위한 guard다.
- `pollTasks()`는 attachment를 만든 뒤 offsets/evictions를 적용하고, attachment별 task-notification을 queue에 넣는다.

이 구조에서 주목할 점:

- async output read와 AppState update 사이 race를 인정하고 fresh state 재검사를 한다.
- generic polling은 output delta와 terminal eviction에 집중한다.
- type별 task는 자기 completion notification을 직접 보낼 수 있다. 이중 notification을 피하기 위해 `notified` flag가 central guard다.

## Task Notification

generic task notification은 XML-like block이다.

포함 필드:

- `task-id`
- optional `tool-use-id`
- `task-type`
- `output-file`
- `status`
- `summary`

LocalAgent/LocalShell/RemoteAgent는 type-specific notification을 별도로 만든다. 특히 agent notification은 summary/result/usage/worktree 정보를 붙이고, remote review는 output file reference가 아니라 review text를 직접 다음 model turn에 주입하기도 한다.

중요한 원칙:

- notification은 history commit과 다르다.
- notification은 다음 model turn에 "runtime에서 발생한 사실"을 전달하는 channel이다.
- `notified`는 "사용자에게 보였는가"보다 "모델/SDK notification queue에 넣었는가"에 가깝다.
- terminal task cleanup은 notification이 끝난 뒤에만 안전하다.

Agentica에서는 이를 public event로 바로 열지 말고 internal runtime notification으로 시작하는 것이 맞다. RPC/chat 공개는 `Runtime Public Surface 설계`의 Phase 3 이후가 적절하다.

## Local Shell Task

`src/tasks/LocalShellTask/LocalShellTask.tsx`와 `killShellTasks.ts`의 핵심은 shell command를 foreground/background task로 다루는 것이다.

주요 기능:

- `spawnShellTask()`는 background shell task를 등록하고 result handler를 붙인다.
- `registerForeground()`는 foreground shell task를 만든다.
- `backgroundTask()`와 `backgroundAll()`은 foreground 작업을 background로 넘긴다.
- task result가 오면 flush/cleanup 후 `completed`, `failed`, `killed` 중 하나로 전이한다.
- `enqueueShellNotification()`은 output file, status, exit code, summary를 queue에 넣는다.
- `killTask()`는 shell process kill, cleanup, unregister, status `killed`, `notified=true`, output eviction을 수행한다.
- `killShellTasksForAgent()`는 agent가 종료될 때 그 agent가 spawn한 shell task를 찾아 죽이고, 죽은 agent 앞으로 queued notification을 제거한다.

prompt stall watchdog:

- 5초마다 output size 증가를 본다.
- 45초 이상 output이 정체되면 tail 1024 bytes를 읽는다.
- 마지막 줄이 `y/n`, `yes/no`, `press enter`, `continue`, `overwrite`류 prompt처럼 보이면 status 없는 task-notification을 보낸다.
- monitor kind task는 이 watchdog notification에서 제외된다.

Agentica 적용:

- HTTP/MCP function call 자체는 보통 짧지만, 외부 job/streaming/export/report 생성 같은 장기 operation은 shell task와 같은 stop/notify/output-ref 모델을 가져야 한다.
- "멈춘 것 같은 작업"과 "실패한 작업"을 구분해야 한다. prompt stall은 실패가 아니라 user intervention 필요 신호다.
- operation owner가 종료되면 그 owner가 만든 background 작업을 어떻게 처리할지 cleanup boundary가 필요하다.

## Local Agent Task

`src/tasks/LocalAgentTask/LocalAgentTask.tsx`는 async sub-agent의 실제 lifecycle을 담당한다.

상태:

- agent id, prompt, selected agent, agent type, model
- abort controller와 cleanup handler
- result/error/progress
- retrieved flag
- display messages
- `pendingMessages`
- foreground/background marker
- retain/evictAfter/diskLoaded

progress tracker:

- tool use count
- cumulative input/output token
- recent tool activities 최대 5개
- `SyntheticOutput`은 preview에서 제외
- tool metadata를 이용해 read/search 활동 설명을 미리 만든다.

message path:

- `queuePendingMessage()`는 running/background agent에게 보낼 user message를 pending queue에 넣는다.
- `drainPendingMessages()`는 tool round boundary에서 pending messages를 꺼낸다.
- `appendMessageToLocalAgent()`는 UI display message만 붙인다.

lifecycle:

- `registerAsyncAgent()`는 이미 backgrounded 상태로 task를 등록한다.
- `registerAgentForeground()`는 foreground agent를 등록하고 background signal promise를 둔다.
- `backgroundAgentTask()`는 foreground agent를 background로 넘기고 signal을 resolve한다.
- `unregisterAgentForeground()`는 foreground에서 끝난 task를 제거한다.
- `completeAgentTask()`와 `failAgentTask()`는 terminal 상태로 바꾸지만, notification은 AgentTool 쪽에서 보낸다.
- `killAsyncAgent()`는 abort, cleanup, status `killed`, runtime ref 제거, output eviction을 수행한다.

의미:

- sub-agent는 function call의 nested promise가 아니라 메시지를 계속 받을 수 있는 task다.
- foreground/background 전환은 UI만의 문제가 아니라 query loop control flow다.
- completion과 notification을 분리해야 중복 알림, race, SDK event 순서 문제가 줄어든다.

## Main Session Backgrounding

`src/tasks/LocalMainSessionTask.ts`는 메인 사용자 query 자체를 background task로 돌리는 기능이다.

특징:

- `LocalAgentTaskState`를 재사용하되 `agentType`은 main-session 계열로 둔다.
- task id prefix는 별도 `s` 계열을 쓴다.
- task output은 main transcript가 아니라 task별 sidechain transcript symlink다. `/clear` 이후에도 background query output을 보존하기 위해서다.
- `registerMainSessionTask()`는 이미 backgrounded task를 등록한다.
- `foregroundMainSessionTask()`는 선택한 main session을 foreground로 올리고 기존 foreground를 background로 내린다.
- `startBackgroundSession()`은 query stream을 sidechain에 쓰고, message/progress를 AppState에 반영한다.
- foreground에서 끝난 main session은 XML notification을 보내지 않고 SDK termination만 낸다. background에서 끝난 경우에만 notification을 queue에 넣는다.

Agentica 적용:

- `Agentica.conversate()` 자체를 task로 backgrounding할지 여부는 public surface 영향이 크다.
- 1차 구현에서는 외부 operation/workflow만 task화하고, main conversate backgrounding은 후속 phase로 미루는 편이 안전하다.
- 단, compaction/resume 설계에서는 "진행 중인 turn의 sidechain transcript" 개념을 남겨야 한다.

## Remote Agent Task

`src/tasks/RemoteAgentTask/RemoteAgentTask.tsx`는 local task와 다른 축을 추가한다.

remote task type:

- `remote-agent`
- `ultraplan`
- `ultrareview`
- `autofix-pr`
- `background-pr`

주요 구성:

- `registerCompletionChecker(remoteTaskType, checker)`로 remote task type별 completion 판단을 추가할 수 있다.
- sidecar metadata를 persist한다. session resume 때 remote task를 복구하기 위해서다.
- `restoreRemoteAgentTasks()`는 sidecar를 읽고 remote session 상태를 확인해 AppState task를 재구성하고 polling을 재시작한다.
- 404/archived는 sidecar를 drop할 수 있지만 auth/recoverable error는 삭제하지 않는다.
- `checkRemoteAgentEligibility()`는 로그인, remote environment, git repo, git remote, GitHub app, policy precondition을 확인한다.

polling:

- `startRemoteSessionPolling()`은 1초 간격으로 session events를 poll한다.
- 새 assistant text나 JSON event를 task output에 append한다.
- archived session은 completed notification 후 output eviction과 sidecar removal로 이어진다.
- custom completion checker가 있으면 그 결과가 terminal 전이를 결정할 수 있다.
- ultraplan/long-running task는 result event만으로 완료 처리하지 않는다.
- remote review는 `<remote-review>`와 `<remote-review-progress>` tag를 별도로 해석한다.
- idle 상태는 여러 번 연속 확인한 뒤에야 의미 있게 처리한다.
- API error 중에도 review timeout은 계속 확인한다.
- kill은 local state를 `killed/notified`로 바꾸고 SDK terminated를 낸 뒤 remote session archive, output eviction, sidecar removal을 수행한다.

Agentica 적용:

- remote connector나 durable workflow가 생기면 AppState memory만으로는 부족하다. sidecar metadata와 restore path가 필요하다.
- auth failure는 task failure와 다르다. recoverable registry/session error로 보존해야 한다.
- "remote job이 결과 event를 냈다"와 "Agentica turn이 이 job을 완료로 간주한다"는 분리해야 한다.

## In-process Teammate Task

`src/tasks/InProcessTeammateTask`는 teammate agent를 task로 다룬다.

상태:

- `TeammateIdentity`: agent id/name, team name, color, plan mode requirement, parent session id.
- prompt/model/selectedAgent
- abort/currentWorkAbort/unregister
- awaiting plan approval
- permission mode
- messages, pending user messages, in-progress tool use ids
- idle/shutdownRequested/onIdleCallbacks
- last reported usage counters

기능:

- `requestTeammateShutdown()`은 running task에 shutdownRequested만 세운다.
- `appendTeammateMessage()`는 UI message를 capped history로 붙인다.
- `injectUserMessageToTeammate()`는 terminal task가 아니면 pending user message와 recent UI message를 추가한다.
- `findTeammateTaskByAgentId()`는 같은 id의 terminal task가 남아 있어도 running task를 우선한다.
- `getRunningTeammatesSorted()`는 UI consistency를 위해 agentName으로 정렬한다.

Agentica 적용:

- team/mailbox를 도입할 때 child agent는 operation call이 아니라 task lifecycle을 가져야 한다.
- user-visible name과 internal UUID를 분리해야 한다.
- teammate transcript는 memory/UI cap과 full transcript 저장소를 분리해야 한다.

## Dream Task

`src/tasks/DreamTask/DreamTask.ts`는 auto-dream memory consolidation 작업을 UI task로 보여주는 구현이다.

특징:

- phase는 `starting`, `updating` 정도로 단순하다.
- sessionsReviewing, filesTouched, turns를 기록한다.
- turns는 30개로 cap을 둔다.
- model-facing task notification은 없다. 완료/실패/kill 시 `notified=true`로 두어 eviction 가능하게 한다.
- kill 시 consolidation lock mtime을 rollback해 다음 session에서 재시도할 수 있게 한다.
- filesTouched는 Edit/Write tool_use 관찰 기반이지 exhaustive audit이 아니다.

Agentica 적용:

- 모든 task가 LLM에게 알려져야 하는 것은 아니다.
- background maintenance task는 UI/telemetry에는 보이되 model context에는 넣지 않는 계층이 필요하다.

## Stop Task

`src/tasks/stopTask.ts`는 TaskStopTool과 SDK stop_task가 공유하는 control path다.

규칙:

- task id로 AppState task를 찾는다.
- running이 아니면 `not_running`.
- task type 구현이 없으면 `unsupported_type`.
- 없으면 `not_found`.
- type별 `kill()`에 위임한다.
- local shell은 pending exit-code notification을 억제하기 위해 notified marker를 다루고, SDK termination은 별도로 낸다.

Agentica 적용:

- stop은 exception이나 operation failure가 아니라 control transition이다.
- user-visible status text는 "stopped"가 맞지만 internal terminal reason은 별도 enum으로 보존해야 한다.
- public event로 열 때도 `operationFailed`에 섞지 말고 `taskStopped` 또는 `runtimeControl` 계열로 나눠야 한다.

## Coordinator Mode

`src/coordinator/coordinatorMode.ts`는 Claude Code의 coordinator prompt와 worker context를 만든다.

runtime gate:

- `isCoordinatorMode()`는 feature flag와 `CLAUDE_CODE_COORDINATOR_MODE` env를 함께 본다.
- `matchSessionMode()`는 resumed session mode와 현재 env가 다르면 env를 맞춘다.

worker context:

- worker에게 허용되는 도구 목록을 만든다.
- simple mode에서는 Bash/Read/Edit만 준다.
- 일반 mode에서는 `ASYNC_AGENT_ALLOWED_TOOLS`에서 internal worker tools를 제외한다.
- worker가 쓸 수 있는 MCP server names를 포함한다.
- scratchpad feature가 켜져 있으면 scratchpad directory도 포함한다.

system prompt의 핵심:

- coordinator의 역할은 worker orchestration, synthesis, user communication이다.
- worker는 `subagent_type: worker`로 launch한다.
- worker 결과를 그대로 relay하지 말고 coordinator가 종합해야 한다.
- task notification 같은 internal signal에 감사/인사하지 않는다.
- agent를 launch한 뒤에는 무엇을 launch했는지 짧게 말하고 멈춘다. 결과를 지어내지 않는다.
- workflow phase를 research, synthesis, implementation, verification으로 나눈다.
- read-only 작업은 병렬화하고, write-heavy 작업은 같은 file area에서 하나씩 처리한다.
- verification은 다른 area의 implementation과 병렬 가능하다.
- worker failure는 같은 worker에 error context를 주고 계속할 수 있다.
- worker stop은 TaskStop으로 하고, stopped worker도 SendMessage로 계속 이어갈 수 있다.
- worker prompt는 self-contained여야 한다.
- coordinator는 "based on your findings" 같은 책임 전가 문구를 쓰지 않고 직접 synthesize한다.
- done criteria는 tests/typecheck/commit 등으로 구체화한다.

Agentica 적용:

- coordinator는 prompt template 하나가 아니라 runtime mode다.
- worker가 볼 tool/capability set은 coordinator context projection에서 계산해야 한다.
- worker prompt는 parent history 전체를 복사하지 말고 task 목적, allowed operations, output contract, verification requirement를 self-contained로 만들어야 한다.
- 병렬성은 LLM에게 맡기는 것이 아니라 runtime policy로 제한해야 한다.

## Agentica 적용 설계 결론

Agentica가 Claude Code에서 배워와야 할 것은 "sub-agent를 많이 띄운다"가 아니라 task runtime 분리다.

필수 primitive:

```ts
interface AgenticaTaskRuntimeState {
  id: string;
  type: "operation" | "workflow" | "agent" | "maintenance" | "remote";
  status: "pending" | "running" | "completed" | "failed" | "stopped";
  owner?: string;
  operationKey?: string;
  description: string;
  outputRef?: AgenticaTaskOutputRef;
  outputOffset: number;
  notified: boolean;
  startedAt: number;
  endedAt?: number;
  resumeRef?: string;
  foreground?: boolean;
}
```

```ts
interface AgenticaTaskOutputRef {
  kind: "file" | "adapter" | "memory";
  uri: string;
  maxInlineBytes?: number;
  digest?: string;
}
```

```ts
interface AgenticaTaskNotification {
  taskId: string;
  type: AgenticaTaskRuntimeState["type"];
  status?: AgenticaTaskRuntimeState["status"];
  summary: string;
  outputRef?: AgenticaTaskOutputRef;
  operationKey?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}
```

도입 원칙:

- `MicroAgentica`에는 연결하지 않는다.
- public event union에 바로 추가하지 않는다.
- `Agentica` runtime wrapper 내부에서 먼저 검증한다.
- 장기 output은 history JSON이 아니라 output reference로 둔다.
- notification과 terminal cleanup을 분리한다.
- stop/cancel은 failure와 분리한다.
- restore 가능한 task는 sidecar/resume metadata를 가진다.
- worker/coordinator는 prompt convention이 아니라 runtime mode와 capability projection을 가진다.

## Agentica 단계별 반영안

1. `AgenticaRuntimeState.tasks`와 `AgenticaTaskOutputStore`를 internal type으로 설계한다.
2. execute/call result 중 대형 payload를 outputRef로 projection하는 경로를 만든다.
3. long-running operation만 opt-in task로 등록한다.
4. task notification은 internal queue로 두고, 다음 LLM turn context projection에만 넣는다.
5. task stop을 public API로 열기 전에 SDK/RPC/chat adapter가 이를 표현할 수 있는지 점검한다.
6. coordinator mode는 sub-agent public API보다 늦게 도입한다. 먼저 selector/policy/verification phase를 runtime task로 분리한다.
7. remote/durable workflow는 sidecar restore와 auth recoverability가 준비된 뒤 연다.

## 남은 확인점

- `src/state` 전체 selector/onChange/store migration은 `state-swarm-runtime.md`에 1차 반영했다.
- `src/bridge`, `src/remote`, `src/server`, `src/cli/transports`, SDK control/core schema는 `remote-bridge-server-runtime.md`에 반영했다. remote task public surface를 열 때 그 문서의 reliability class와 control taxonomy를 재확인해야 한다.
- coordinator mode와 team/swarm backend의 연결부는 `state-swarm-runtime.md`에 1차 반영했다. 다만 tmux/iTerm2 pane command와 UI dialog 연결 세부는 후순위다.

## Monitor/Workflow 추가 독해

`LocalShellTask.tsx`, `utils/task/framework.ts`, `utils/task/sdkProgress.ts`를 추가 확인했다.

확인한 핵심:

- `LocalShellTask`에는 `kind: "bash" | "monitor"`가 있다. monitor는 feature-gated이며 script exit를 "condition met"으로 해석하지 않고 stream 종료/실패/정지로 따로 표시한다.
- background shell task는 `TaskOutput`이 disk output을 소유한다. task state는 AppState에 등록되고 notification은 XML tag 형태로 pending queue에 들어간다.
- stall watchdog은 output growth가 멈추고 tail이 `(y/n)`, `Press Enter`, directed question 등 prompt처럼 보일 때만 notification을 만든다. monitor kind에는 적용하지 않는다.
- task notification은 `notified` flag를 atomically set해 중복 enqueue를 막는다.
- `registerTask`는 SDK `task_started` event를 enqueue하되 resume/replacement task는 새 start로 emit하지 않는다.
- `generateTaskAttachments`는 output delta offset만 patch한다. async disk read 중 task가 terminal state로 바뀐 것을 stale snapshot으로 덮지 않기 위함이다.
- `emitTaskProgress`는 background agent와 workflow progress를 같은 SDK `task_progress` shape로 보낸다.
- `LocalWorkflowTask`/`MonitorMcpTask` 독립 구현 파일은 공개 snapshot에 보이지 않는다. workflow/monitor 흔적은 task type/progress/label/gate에 남아 있는 수준이다.

Agentica 적용:

- monitor류 작업은 "성공/완료" semantics가 일반 shell/operation과 다르므로 status taxonomy에 별도 result reason을 둔다.
- progress event는 task owner별 내부 shape가 달라도 public/SDK projection은 공통으로 낮춰야 한다.
- disk output delta는 offset patch로 관리하고, stale task snapshot merge를 금지한다.
