# Claude Code State/Swarm Runtime 분석

## 범위

대상은 Claude Code snapshot의 다음 경로다.

- `/home/samchon/github/samchon/claude-code/src/state/*`
- `/home/samchon/github/samchon/claude-code/src/utils/swarm/*`
- `/home/samchon/github/samchon/claude-code/src/utils/teammateContext.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/agentContext.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/teammateMailbox.ts`

이 문서는 Agentica에 source package 변경을 가하지 않고, 향후 `Agentica` 전용 runtime wrapper 설계에 반영할 지식을 정리한다. `MicroAgentica`는 적용 대상이 아니다.

## 핵심 결론

Claude Code의 `AppState`는 React UI 상태가 아니다. 작업, 팀, 권한, 원격 연결, MCP/Plugin registry, bridge, speculative state, prompt suggestion, browser/tmux/computer-use 상태까지 담는 runtime state hub다.

Swarm은 sub-agent 호출 문법이 아니다. 다음을 묶은 runtime subsystem이다.

- team config file
- shared task list
- mailbox
- permission request/response
- pane backend 또는 in-process executor
- cleanup boundary
- idle/shutdown lifecycle

Agentica에 필요한 것은 "Claude Code식 UI"가 아니라 이 분리 원칙이다.

## AppState Store

`src/state/store.ts`는 작지만 중요한 store abstraction이다.

- `getState()`
- `setState(updater)`
- `subscribe(listener)`
- optional `onChange(newState, oldState)`

`setState`는 updater 결과가 `Object.is(next, prev)`이면 listener를 부르지 않는다. 변경이 있으면 state를 교체하고, `onChange`를 먼저 실행한 뒤 subscribers를 호출한다.

Agentica 적용 원칙:

- runtime state mutation은 직접 흩뿌리지 않고 단일 setter를 통과해야 한다.
- state diff side effect는 observer에서 처리해야 한다.
- event emitter와 LLM history append는 state store 자체의 책임이 아니다.

## AppStateProvider와 Selector Discipline

`src/state/AppState.tsx`는 React provider지만 구조적 교훈은 UI 밖에서도 유효하다.

- store는 provider mount 시 한 번만 생성한다.
- nested provider를 금지한다.
- `useSyncExternalStore`로 slice만 구독한다.
- selector가 새 object를 반환하면 매번 re-render되므로 금지한다.
- setter만 필요한 component는 state subscribe 없이 stable setter를 받는다.
- provider 밖에서도 안전하게 읽는 helper가 따로 있다.

Agentica는 React hook이 필요 없지만 같은 제약이 필요하다.

```ts
interface AgenticaRuntimeStateStore {
  getState(): AgenticaRuntimeState;
  setState(updater: (prev: AgenticaRuntimeState) => AgenticaRuntimeState): void;
  subscribe(listener: () => void): () => void;
}
```

runtime state를 public event와 분리하면 selector/cache invalidation, connector hot-swap, task notification을 통제하기 쉬워진다.

## AppStateStore의 Runtime 영역

`src/state/AppStateStore.ts`의 state는 매우 넓다. Agentica 관점에서 특히 중요한 축은 다음이다.

| 영역 | Claude Code state | Agentica 적용 |
| --- | --- | --- |
| task | `tasks`, `foregroundedTaskId`, `viewingAgentTaskId`, `agentNameRegistry` | long-running operation/task registry |
| permission | `toolPermissionContext`, worker/channel permission callbacks | call-time policy gate와 pending interaction |
| remote | `remoteConnectionStatus`, background task count | remote session state와 reconnect state |
| bridge | bridge enabled/session/reconnect/url/error fields | external runtime transport state |
| mcp/plugin | clients/tools/commands/resources, plugin status | connector registry hot-swap |
| team | `teamContext`, teammate registry | team/member/mailbox runtime |
| inbox | pending/processed mailbox messages | internal message bus projection |
| speculation | speculation status/result | optional future prefetch/runtime hint |
| mode | plan/default/acceptEdits, ultraplan, effort | runtime mode and policy |

중요한 점은 AppState가 모든 원본 데이터를 담으려 하지 않는다는 것이다. task output, mailbox, team config, remote sidecar 같은 durable artifact는 별도 파일/transport에 있고 AppState에는 현재 화면과 runtime 판단에 필요한 pointer/state만 있다.

Agentica도 history JSON에 모든 runtime data를 넣으면 안 된다. public JSON은 compatibility surface로 남기고, runtime state는 internal wrapper에 둔다.

## onChangeAppState

`src/state/onChangeAppState.ts`는 state diff에서 side effect를 모으는 choke point다.

확인한 역할:

- permission mode 변경을 외부 session metadata와 SDK notification으로 sync한다.
- `isUltraplanMode` 같은 mode state를 external metadata로 변환한다.
- main loop model 변경을 settings와 model override에 반영한다.
- expanded view, verbose, UI panel visibility 같은 설정을 persist한다.
- settings 변경 시 auth/cache/env를 invalidate하거나 재적용한다.

Agentica 적용 원칙:

- runtime state 변경과 외부 side effect를 같은 곳에 섞지 않는다.
- state diff observer를 두고, observer가 connector registry invalidation, selector cache clear, compact marker sync, pending interaction event를 담당한다.
- permission mode 변경은 operation failure가 아니라 runtime mode transition이다.

초안:

```ts
interface AgenticaRuntimeStateObserver {
  onChange(args: {
    previous: AgenticaRuntimeState;
    next: AgenticaRuntimeState;
    source?: AgenticaRuntimeTransitionSource;
  }): Promise<void> | void;
}
```

## Selectors와 Viewed Agent Routing

`src/state/selectors.ts`는 input routing을 명확히 분리한다.

- 현재 보고 있는 in-process teammate task가 유효하면 입력을 teammate에게 보낸다.
- local agent task를 보고 있으면 named agent로 라우팅한다.
- 그 외에는 leader input이다.

Agentica가 team runtime을 도입할 때 user input은 항상 main `Agentica.conversate()`로만 들어가는 게 아니다. runtime state에는 active recipient가 필요하다.

```ts
type AgenticaInputTarget =
  | { type: "leader" }
  | { type: "team_member"; memberId: string }
  | { type: "task"; taskId: string };
```

초기 구현은 public API에 노출하지 않고 internal routing으로만 둔다.

## Teammate View Helpers

`src/state/teammateViewHelpers.ts`는 retained task view lifecycle을 관리한다.

- teammate view에 진입하면 task output/messages를 retain하고 terminal eviction을 막는다.
- 다른 teammate로 전환하면 이전 retained task를 release한다.
- view exit 때 retained marker를 정리한다.
- running teammate stop은 `AbortController.abort()`로 처리하고, terminal task dismiss는 eviction 대상으로 전환한다.

Agentica 적용 원칙:

- task output reference는 view/read cursor와 lifecycle이 분리되어야 한다.
- stop은 failure가 아니다. stop, dismiss, evict는 서로 다른 transition이다.
- source package 구현 시 task state를 직접 제거하기 전에 notification/read cursor를 확인해야 한다.

## AsyncLocalStorage Context

`utils/teammateContext.ts`와 `utils/agentContext.ts`는 인프로세스 동시 실행에서 전역 상태 충돌을 피한다.

구분:

- process-based teammate: env var와 dynamic team context로 identity를 전달한다.
- in-process teammate: `AsyncLocalStorage`로 `agentId`, `agentName`, `teamName`, color, plan mode requirement, parent session id, abort controller를 전달한다.
- analytics/telemetry context도 별도 `AgentContext`로 둔다.

Agentica 적용 원칙:

- runtime state는 공유되더라도 execution identity는 async context로 격리한다.
- background operation이 병렬로 실행될 때 "현재 agent"를 전역 변수로 두면 안 된다.
- tool executor, selector, policy gate가 필요한 execution-local 값을 context object 또는 AsyncLocalStorage adapter에서 읽게 한다.

초안:

```ts
interface AgenticaExecutionContext {
  agentId?: string;
  teamId?: string;
  taskId?: string;
  parentSessionId?: string;
  abortSignal?: AbortSignal;
}
```

## Team File Registry

`utils/swarm/teamHelpers.ts`는 team을 `~/.claude/teams/{team}/config.json` 같은 파일 registry로 관리한다.

Team file에 들어가는 주요 정보:

- team name, description, createdAt
- lead agent id, lead session id
- hidden pane ids
- team-wide allowed paths
- members
- member별 name, agent type, model, prompt, color
- plan mode required
- pane id, cwd, worktree path, session id
- backend type
- active/idle marker
- current permission mode

파일 기반 registry의 장점은 pane 기반 프로세스와 in-process teammate가 같은 coordination artifact를 공유할 수 있다는 점이다.

Agentica 적용 원칙:

- 팀 상태는 메모리 map만으로 두지 않는다. durable/session adapter를 둔다.
- in-memory state는 빠른 routing/notification용이고, team registry는 cleanup/reconnect/inspection에 쓰인다.
- DBMS 없는 local mode에서는 JSON file adapter부터 시작할 수 있다.

초안:

```ts
interface AgenticaTeamRegistryAdapter {
  read(teamId: string): Promise<AgenticaTeamManifest | undefined>;
  write(team: AgenticaTeamManifest): Promise<void>;
  remove(teamId: string): Promise<void>;
}
```

## Mailbox

`utils/teammateMailbox.ts`는 agent별 inbox JSON file을 둔다. 메시지는 `from`, `text`, `timestamp`, `read`, optional color/summary를 가진다. 쓰기와 read marker 변경에는 lock을 사용한다.

Mailbox message 종류:

- plain teammate message
- idle notification
- permission request/response
- sandbox permission request/response
- plan approval request/response
- shutdown request/approved/rejected
- task assignment
- team permission update
- mode set request

Agentica 적용 원칙:

- team communication을 model transcript에 바로 inline하지 않는다.
- mailbox message를 LLM에 보여줄 때는 projection adapter를 거친다.
- permission/shutdown/plan approval은 plain chat이 아니라 typed control message다.
- "읽음" 상태와 "모델에 투영됨" 상태를 분리해야 한다.

초안:

```ts
interface AgenticaMailboxAdapter {
  send(target: AgenticaMailboxTarget, message: AgenticaMailboxMessage): Promise<void>;
  read(target: AgenticaMailboxTarget): Promise<AgenticaMailboxEntry[]>;
  markRead(target: AgenticaMailboxTarget, entryId: string): Promise<void>;
}
```

## Swarm Backend Layering

`utils/swarm/backends/types.ts`는 두 레벨을 분리한다.

1. `PaneBackend`: tmux/iTerm2 pane 조작
2. `TeammateExecutor`: teammate spawn/message/terminate/kill/isActive

`PaneBackendExecutor`는 pane backend를 `TeammateExecutor`로 감싼다. `InProcessBackend`도 같은 `TeammateExecutor` 인터페이스를 구현한다.

```ts
type AgenticaTeamExecutor = {
  spawn(config: AgenticaTeamMemberSpawnConfig): Promise<AgenticaTeamMemberSpawnResult>;
  sendMessage(memberId: string, message: AgenticaTeamMessage): Promise<void>;
  terminate(memberId: string, reason?: string): Promise<boolean>;
  kill(memberId: string): Promise<boolean>;
  isActive(memberId: string): Promise<boolean>;
};
```

Agentica는 tmux/iTerm2 pane 제어를 core에 가져올 필요가 없다. 그러나 executor abstraction은 가져올 가치가 있다.

초기 Agentica backend:

- `in-process`: 같은 Node.js process에서 async context 격리
- `local-child-process`: 별도 process adapter는 후순위
- `external-pane`: core 밖 optional adapter. tmux/iTerm2 같은 terminal pane backend가 필요할 때만 붙인다.
- `remote`: remote session adapter와 연결

## Backend Detection

`utils/swarm/backends/registry.ts`는 backend 선택을 session lifetime 동안 cache한다.

선택 원칙:

- non-interactive session은 in-process를 강제한다.
- 명시 mode가 `in-process`면 in-process다.
- 명시 mode가 `tmux`면 pane backend다.
- auto mode에서는 tmux/iTerm2 안이면 pane backend를 우선하고, 그렇지 않으면 in-process다.
- pane backend가 unavailable이면 in-process fallback을 session state로 기록한다.

Agentica 적용 원칙:

- backend auto detection 결과는 한 turn마다 흔들리면 안 된다.
- session 시작 시 snapshot 또는 명시 setting을 잡고 runtime state에 기록한다.
- fallback은 warning/event가 아니라 runtime state transition으로 남긴다.

`backends/teammateModeSnapshot.ts`는 CLI/config의 teammate mode를 session startup에 capture한다. 이후 config가 바뀌어도 같은 session의 backend mode가 갑자기 바뀌지 않는다. UI에서 override를 명시적으로 해제할 때만 snapshot을 새 mode로 갱신한다.

## Tmux/iTerm2 Pane Backend 세부

Pane backend의 핵심은 terminal 조작 자체가 아니라 "teammate process를 어디에 띄웠는지"를 `TeammateExecutor` 뒤에 숨기는 것이다. `PaneId`는 opaque string이고, 팀 파일에는 `tmuxPaneId`라는 legacy 이름으로 저장되지만 실제 backend는 tmux 또는 iTerm2일 수 있다.

`PaneBackend`가 제공하는 축:

- availability/running-inside detection
- teammate pane creation
- command injection
- border color/title/status와 layout rebalance
- kill
- hide/show

### Detection과 mode 고정

`backends/detection.ts`는 module load 시점의 original `TMUX`, `TMUX_PANE` 값을 capture한다. Shell tool 실행 중 `TMUX`가 바뀌거나 외부 tmux server가 존재하더라도 leader session 판정을 흔들지 않기 위해서다. iTerm2는 `TERM_PROGRAM`, `ITERM_SESSION_ID`, `env.terminal`을 보고, 실제 사용 가능성은 `it2 session list`로 확인한다. `it2 --version`만으로는 Python API enable 여부를 알 수 없기 때문이다.

`backends/registry.ts` 선택 순서:

1. 이미 tmux 안이면 native tmux backend
2. iTerm2이고 tmux 선호 설정이 아니며 `it2`가 가능하면 iTerm2 backend
3. iTerm2지만 `it2`가 불가능하고 tmux가 있으면 tmux fallback
4. tmux/iTerm2 밖이지만 tmux binary가 있으면 external tmux session
5. 모두 실패하면 install/setup 안내 error

non-interactive 또는 explicit `in-process` mode는 pane backend를 피한다. auto mode에서 pane backend가 unavailable이면 in-process fallback marker를 세운다.

### TmuxBackend

inside tmux:

- leader pane id는 startup에 capture한 `TMUX_PANE`다.
- 첫 teammate는 leader pane을 기준으로 `split-window -h -l 70% -P -F '#{pane_id}'`로 만든다.
- 이후 teammate는 현재 window의 pane list에서 leader를 제외하고 target pane을 고른 뒤 teammate count에 따라 vertical/horizontal split을 번갈아 쓴다.
- layout은 `select-layout main-vertical`로 맞추고 leader pane을 `30%` 폭으로 resize한다.
- pane border status는 window option `pane-border-status top`으로 켜고, pane title/border style에 teammate color/name을 반영한다.

tmux 밖:

- `tmux -L claude-swarm-${process.pid}` socket을 쓰는 external session을 만든다.
- session 이름은 `claude-swarm`, window 이름은 `swarm-view`다.
- 첫 teammate는 initial pane을 사용하고, 다음 teammate부터 같은 window를 split한다.
- layout은 external session에서는 `tiled`로 rebalance한다.

공통:

- pane creation은 lock으로 직렬화한다.
- pane 생성 직후 shell init을 기다리기 위해 짧은 delay를 둔다.
- 명령 전송은 `send-keys -t <pane> <command> Enter`다.
- kill은 `kill-pane -t <pane>`다.
- hide/show는 tmux에만 있으며 hidden session `claude-hidden`으로 `break-pane`했다가 `join-pane`으로 되돌린다.

### ITermBackend

iTerm2 backend는 `it2` CLI와 Python API가 모두 필요하다.

- leader session id는 `ITERM_SESSION_ID`에서 colon 뒤 session id를 파싱한다.
- 첫 teammate는 leader session 기준 `it2 session split -v -s <leaderSessionId>`를 시도하고 fallback으로 current session split을 쓴다.
- 이후 teammate는 마지막 teammate session을 target으로 `it2 session split -s <sessionId>`를 쓴다.
- target session이 사라진 경우 `it2 session list`로 stale id를 prune하고 재시도한다.
- 새 pane id는 `Created new pane: <session-id>` output에서 파싱한다.
- 명령 전송은 `it2 session run -s <paneId> <command>`다.
- kill은 `it2 session close -f -s <paneId>`다.
- styling/title/rebalance는 no-op이다. 각 `it2` 호출이 Python process를 띄워 비용이 크기 때문이다.
- hide/show는 tmux의 break/join 같은 primitive가 없어 지원하지 않는다.

`It2SetupPrompt.tsx`는 `uvx`가 아니라 `uv tool install it2`, `pipx install it2`, `pip install --user it2`, `pip3 install --user it2` 순으로 설치 경로를 제안한다. 설치는 project cwd가 아니라 home directory에서 실행한다. project-local `pip.conf`나 `uv.toml`이 package source를 악의적으로 바꾸는 것을 피하기 위해서다. 설치 후에는 iTerm2 Settings의 Python API enable 상태를 `it2 session list`로 검증한다.

### PaneBackendExecutor

`PaneBackendExecutor`는 terminal pane을 teammate executor로 감싼다.

spawn 흐름:

1. `agentName@teamName`으로 deterministic `agentId`를 만든다.
2. teammate color를 할당하고 pane을 만든다.
3. 첫 teammate가 inside tmux이면 pane border status를 켠다.
4. teammate binary path와 CLI args를 만든다.
5. permission mode, model, settings, plugin dir, teammate mode snapshot, chrome flags를 inherited flag로 전달한다.
6. provider/config/proxy/cert env를 allowlist 방식으로 전달한다.
7. pane에 `cd <cwd> && env ... <binary> --agent-id ...` command를 주입한다.
8. initial prompt는 CLI stdin/argv가 아니라 file mailbox로 보낸다.
9. leader exit cleanup hook에 spawned pane kill을 등록한다.

중요한 제한:

- graceful terminate는 pane process를 바로 죽이지 않고 shutdown request를 mailbox에 쓴다.
- force kill만 backend `killPane`을 호출한다.
- `isActive()`는 pane 존재를 매번 probe하지 않고 executor map 기준의 best-effort다.
- pane process로 넘기는 env/flag는 broad inheritance가 아니라 explicit allowlist다.
- plan-mode required이면 bypass permission 같은 mode 전파를 제한한다.

### Teams Dialog와 discovery

`teamDiscovery.ts`는 team file을 읽어 `team-lead`를 제외하고 `isActive !== false`면 running, false면 idle로 표시한다. `hiddenPaneIds`, `backendType`, `tmuxPaneId`, `mode`, `worktreePath`, `prompt`도 UI projection에 포함한다.

`components/teams/TeamsDialog.tsx`는 team runtime control surface다.

- `Enter`: detail 진입 또는 teammate pane focus
- `k`: backendType으로 backend class를 찾아 pane kill, team member 제거, task unassign, terminated inbox 기록
- `s`: shutdown request를 mailbox에 기록
- `h`/`H`: backend가 지원할 때 hide/show
- `p`: idle teammate prune 또는 prompt expand
- `shift+tab`: permission mode cycle

mode 변경은 team file을 즉시 갱신하고 teammate mailbox에 `mode_set_request`를 보낸다. pane focus는 tmux면 `select-pane`, external tmux면 swarm socket, iTerm2면 `it2 session focus`를 쓴다.

### Agentica 적용 판단

Agentica core가 tmux/iTerm2 pane을 직접 지원할 이유는 약하다. 대신 다음 원칙을 가져온다.

- backend 선택은 session 시작 시 snapshot으로 고정한다.
- executor interface는 in-process, local-child-process, remote, optional external-pane을 동일하게 다룬다.
- spawn은 lock/transaction으로 직렬화하고 실패 시 registry/mailbox/task state를 반쯤 남기지 않는다.
- initial prompt와 control message는 command line이 아니라 mailbox/adapter로 전달한다.
- child process env/flag inheritance는 allowlist와 policy mode를 거친다.
- graceful terminate, force kill, idle, hidden, stopped를 서로 다른 state transition으로 둔다.
- UI/RPC가 pane id나 mailbox path를 public history에 흘리지 않도록 adapter projection을 둔다.

## InProcessBackend

`InProcessBackend`는 `ToolUseContext`를 받아 AppState에 접근한다.

spawn 흐름:

1. `spawnInProcessTeammate()`로 teammate context와 task state를 만든다.
2. AppState task registry에 등록한다.
3. `startInProcessTeammate()`로 agent execution loop를 background에서 시작한다.
4. `agentId`, `taskId`, `AbortController`를 반환한다.

message/terminate/kill:

- message는 mailbox에 쓴다.
- graceful terminate는 shutdown request를 mailbox로 보낸 뒤 task에 shutdown requested를 표시한다.
- force kill은 AbortController를 abort하고 task state를 terminal로 바꾼다.

Agentica 적용 원칙:

- child agent는 function call result가 아니라 task state를 가져야 한다.
- graceful terminate와 force kill을 분리한다.
- long-running child loop는 parent turn abort와 독립된 lifecycle abort controller를 가진다.

## InProcess Runner

`utils/swarm/inProcessRunner.ts`는 Agentica에 가장 중요한 참고 자료다.

핵심 특징:

- 일반 `runAgent()`를 재사용한다.
- teammate별 system prompt를 만들고 swarm addendum을 붙인다.
- 팀 coordination tool을 필수 tool로 주입한다.
- 전체 teammate conversation buffer를 유지한다.
- token threshold를 넘으면 teammate history만 compact한다.
- compact 후 microcompact/content replacement state를 reset한다.
- task.messages mirror도 함께 compact해 AppState memory가 무한히 커지지 않게 한다.
- 각 prompt iteration마다 per-turn abort controller를 만든다.
- lifecycle abort는 teammate 전체 종료이고, work abort는 현재 turn interrupt다.
- 완료 후 task를 completed로 끝내지 않고 idle로 둔다.
- idle 상태에서 mailbox, in-memory pending message, shared task list, shutdown request를 polling한다.
- shutdown request는 자동 승인하지 않고 모델에게 판단시키는 prompt로 넣는다.

Agentica 적용 원칙:

- sub-agent/team member는 one-shot call이 아니라 resumable loop일 수 있다.
- parent history를 그대로 복사하지 않고 child-local history를 별도 관리한다.
- child-local compaction은 parent compaction과 분리한다.
- idle은 terminal status가 아니다.
- task list claim과 mailbox polling은 runtime loop의 input source다.

초안:

```ts
interface AgenticaTeamMemberRuntimeState {
  id: string;
  name: string;
  status: "starting" | "running" | "idle" | "stopping" | "stopped" | "failed";
  taskId?: string;
  backend: "in-process" | "local-child-process" | "external-pane" | "remote";
  permissionMode: AgenticaRuntimeMode;
  awaitingPlanApproval?: boolean;
  currentWorkAbortController?: AbortController;
}
```

## Permission Sync

`utils/swarm/permissionSync.ts`는 worker가 leader에게 tool permission을 요청하는 구조다.

두 계층이 공존한다.

1. file-based pending/resolved permission directory
2. mailbox-based permission request/response

in-process teammate는 가능한 경우 leader의 ToolUseConfirm dialog queue를 직접 사용한다. bridge가 없으면 mailbox로 fallback한다.

중요한 원칙:

- permission request는 tool input, description, suggested rules, worker identity를 포함한다.
- response는 approve/reject뿐 아니라 updated input, permission update rule을 포함할 수 있다.
- permission update는 worker context만이 아니라 leader shared permission context에도 반영될 수 있다.
- worker의 `acceptEdits` 변환 상태가 leader mode를 오염시키지 않도록 preserve mode 옵션을 둔다.
- sandbox network permission은 tool permission과 별도 typed message다.

Agentica 적용 원칙:

- policy gate 결과 `ask`는 model repair loop로 보내면 안 된다.
- pending permission은 `AgenticaPendingInteraction`으로 runtime state에 둔다.
- 승인 결과는 operation input을 수정할 수 있어야 한다.
- permission rule update는 selector/cache invalidation과 연결될 수 있다.

## Prompt and Workflow Strategy

Swarm prompt 전략은 "많은 history를 던져주는" 방식이 아니다.

확인한 전략:

- teammate prompt는 team message XML wrapper로 주입된다.
- agent definition prompt와 team addendum을 분리한다.
- custom agent system prompt는 replace/append/default mode가 있다.
- team-essential tool은 allowed tool list와 별도로 보장한다.
- task list에서 claim한 작업은 self-contained prompt로 변환한다.
- peer message는 summary/color/source metadata와 함께 전달된다.

Agentica 적용 원칙:

- worker context projection은 parent transcript dump가 아니라 task brief, allowed operation, expected output contract 중심이어야 한다.
- team-essential operation은 custom allowed operation list가 있더라도 주입할 수 있어야 한다.
- peer/control message는 typed projection adapter를 거쳐야 한다.

## Agentica 적용 설계

### Runtime Store

`AgenticaRuntimeState`에 store/observer를 붙인다.

```ts
interface AgenticaRuntimeState {
  histories: AgenticaHistory[];
  prompt?: AgenticaUserMessageHistory;
  projectedMessages?: OpenAI.ChatCompletionMessageParam[];
  resources?: Map<string, AgenticaResourceState>;
  approvals?: Map<string, AgenticaApprovalGrant>;
  results?: Map<string, AgenticaResultReference>;
  tasks?: Map<string, AgenticaTaskRuntimeState>;
  teams?: Map<string, AgenticaTeamRuntimeState>;
  connectors?: Map<string, AgenticaConnectorClientState>;
  remoteSessions?: Map<string, AgenticaRemoteSessionState>;
  mode?: AgenticaRuntimeMode;
  pendingInteractions?: Map<string, AgenticaPendingInteraction>;
  registryVersion?: number;
}
```

이 state는 `Agentica` internal이다. `IAgenticaHistoryJson`에 그대로 serialize하지 않는다.

### State Observer

초기 observer 책임:

- permission mode sync
- connector registry version 증가와 selector cache invalidation
- task terminal notification queue
- compact boundary marker projection
- remote reconnect/status transition logging
- team member idle/shutdown notification

### Team Runtime

초기 TeamRuntime은 다음 adapter를 가진다.

- `AgenticaTeamRegistryAdapter`
- `AgenticaMailboxAdapter`
- `AgenticaTeamExecutor`
- `AgenticaPermissionSyncAdapter`

기본 구현은 DBMS가 아니라 local file/in-memory adapter로 시작한다. remote/durable adapter는 후속 phase에서 붙인다.

### Public Surface 보류

다음은 바로 public event/RPC/history로 열지 않는다.

- team mailbox raw message
- permission request raw payload
- in-process teammate transcript
- remote SDK event
- task output full payload

먼저 internal runtime projection으로 검증한 뒤 필요하면 public JSON version을 올린다.

## MicroAgentica 비적용

`MicroAgentica`는 현재 경량 function-call facade가 장점이다.

금지:

- runtime state store 주입
- team/mailbox runtime 연결
- compact boundary history 추가
- permission mode/pending interaction 추가
- local RAG selector 기본 연결

`call.ts`는 공유 경로이므로 policy gate를 직접 넣으면 `MicroAgentica`까지 흔든다. 초기 구현은 `Agentica` 전용 runtime wrapper에서만 처리한다.

## 남은 확인 항목

- team runtime event의 외부 표면은 `remote-bridge-server-runtime.md`의 SDK/control surface와 함께 볼 것
