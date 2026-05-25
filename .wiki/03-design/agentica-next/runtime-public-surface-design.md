# Runtime Public Surface 설계

## 목표

Agentica에 Claude Code식 runtime, local selector, context projection, compact를 넣더라도 기존 public API를 한 번에 깨지 않기 위한 공개 표면 설계다.

대상은 `Agentica`다. `MicroAgentica`는 제외한다.

## 현재 제약

- `systemMessage`는 history에는 있지만 event에는 없다.
- `Agentica.conversate()`는 event를 통해 history commit 후보를 모은다.
- `IAgenticaRpcListener`는 core event 전체를 노출하지 않는다.
- `assistantMessage`와 `describe` RPC forwarding은 final-only다.
- chat UI는 `systemMessage`를 렌더링하지만 compact 전용 UI는 없다.

## 단계별 공개 전략

### Phase 0: Internal Runtime State

새 runtime은 먼저 public discriminant 없이 내부 state로만 동작한다.

```typescript
interface AgenticaRuntimeState {
  histories: AgenticaHistory[];
  prompt: AgenticaUserMessageHistory;
  stack: AgenticaOperationSelection[];
  projection: AgenticaContextProjection;
  compact?: AgenticaCompactRuntimeState;
  tasks?: Record<string, AgenticaTaskRuntimeState>;
  teams?: Record<string, AgenticaTeamRuntimeState>;
  remoteSessions?: Record<string, AgenticaRemoteSessionState>;
  interaction?: AgenticaInteractionRuntime;
  connectorRegistryVersion?: number;
  capabilityRegistryVersion?: number;
}

interface AgenticaCompactRuntimeState {
  boundaryId: string;
  trigger: "manual" | "auto" | "reactive";
  preTokens: number;
  postTokens?: number;
  summarizedHistoryIds: string[];
  preservedHistoryIds: string[];
  selectedOperations: AgenticaOperationRef[];
  pendingStack: AgenticaOperationRef[];
  resultRefs: AgenticaResultReference[];
}
```

이 단계에서는 event union, JSON union, RPC listener를 건드리지 않는다.

### Phase 0A: Interaction Compatibility

사용자 질문, plan approval, proactive user message를 바로 public event로 열지 않는다.

1차 호환 방식:

- local/TUI adapter는 runtime interaction callback을 받아 자체 UI를 렌더링한다.
- RPC/chat adapter는 렌더링 불가능한 interaction kind를 opt-out한다.
- history에는 필요한 경우 짧은 `systemMessage` marker만 남긴다.

예:

```text
Plan approved. Runtime will continue from the approved plan.
```

질문 선택지, approval metadata, 사용자의 notes 전체를 public history text에 넣지 않는다. 이는 resume/debug sidecar 또는 adapter state에 둔다.

### Phase 0B: Internal Task Compatibility

task runtime도 compact와 같은 원칙을 따른다. Claude Code는 task output, notification, SDK event, cleanup을 분리하지만, Agentica의 기존 public event에는 아직 대응 discriminant가 없다.

1차 호환 방식:

- long-running operation output은 internal `AgenticaTaskOutputRef`로 둔다.
- history에는 필요한 경우 짧은 `systemMessage` marker만 남긴다.
- 다음 model turn에는 runtime notification projection만 넣고, chat UI에 긴 log를 그대로 렌더링하지 않는다.
- stop/cancel은 operation failure event에 섞지 않는다.
- RPC/chat public listener는 열지 않는다.

예:

```text
Background task completed. Runtime output is available as an internal reference.
```

이 문장은 사용자-facing transcript에 남길 수 있는 최소 marker다. 실제 output uri, tail, usage, owner, resume metadata는 internal state 또는 adapter sidecar에 둔다.

### Phase 0C: Remote Runtime Compatibility

remote/bridge runtime도 public event로 바로 열지 않는다. Claude Code는 remote SDK event를 REPL message로 projection할 때 success result, auth status, rate-limit event, tool-use summary를 의도적으로 무시하거나 system marker로 낮춘다. Agentica도 같은 adapter layer가 필요하다.

1차 호환 방식:

- remote SDK/control event는 internal `AgenticaRemoteMessageAdapter`를 통과한다.
- permission request는 `call` listener에 섞지 않고 interaction runtime으로 넘긴다.
- reconnect/heartbeat/auth refresh는 task failure가 아니라 remote session state transition이다.
- remote progress/status는 chat/RPC에 바로 streaming하지 않는다.
- remote compact boundary는 짧은 system marker와 internal compact metadata로 나눈다.
- SDK `assistant`/`result`/`stream_event`/`system/*` message와 Agentica public event는 1:1 대응이 아니다.
- SDK `control_request`/`control_response`/`control_cancel_request`는 public chat transcript가 아니라 runtime control channel이다.
- worker epoch, delivery ack, sequence high-water mark, internal transcript event queue depth는 public history에 넣지 않는다.
- CLI renderer의 QR/status/keyboard toggle은 adapter UI state다. public runtime event로 노출하지 않는다.

예:

```text
Remote session reconnected. Runtime state was refreshed.
```

실제 transport kind, worker epoch, session JWT, sequence number, pending permission map은 public history text에 넣지 않는다.

### Phase 0D: Team/Swarm Runtime Compatibility

team/mailbox runtime도 public event로 바로 열지 않는다. Claude Code `utils/swarm`은 team registry, mailbox, permission sync, in-process runner, pane backend를 내부 runtime subsystem으로 다룬다.

1차 호환 방식:

- team registry는 internal runtime state와 local adapter에 둔다.
- mailbox raw payload는 public history에 넣지 않는다.
- idle notification, shutdown, permission request, sandbox request, plan approval은 typed control message로만 처리한다.
- teammate transcript는 parent transcript에 자동 병합하지 않는다.
- team member status 변화는 task notification projection으로만 최소 반영한다.
- permission request는 `call` listener에 섞지 않고 interaction runtime으로 넘긴다.
- external pane id, process command, inherited env, local mailbox path, worktree cleanup path는 public history/RPC event에 넣지 않는다.
- mode change, shutdown request, kill, idle notification은 chat text가 아니라 typed runtime control message로 처리한다.

예:

```text
Team member is idle. Runtime can assign new work.
```

실제 mailbox file path, member color, permission suggestions, updated input, pending request id는 internal state 또는 adapter sidecar에 둔다.

### Phase 0E: Capability Registry Compatibility

plugin/capability registry도 public event로 바로 열지 않는다. Claude Code plugin runtime은 settings intent, known marketplace state, installed plugin metadata, loaded plugin projection을 분리한다.

1차 호환 방식:

- capability source declaration과 materialized source cache는 internal state에 둔다.
- install/update/uninstall 결과는 registry version bump와 pending reload marker로만 반영한다.
- background update는 running session projection을 바꾸지 않는다.
- dependency demotion은 runtime diagnostics에 둔다.
- userConfig secret value, install path, cache path는 history/RPC에 넣지 않는다.
- connector artifact source URL, redirect final URL, local artifact path, content hash는 public history에 넣지 않고 diagnostics/reference로만 둔다.
- failed/flagged/needs-config capability의 상세 recovery action은 internal control plane에 둔다.
- validation error/warning은 CLI/devtool 결과로는 stable shape를 갖되, chat history에는 전체 schema dump를 넣지 않는다.
- reload 결과 count는 diagnostic marker로 남길 수 있지만 connector secret/config path는 public event에 넣지 않는다.
- SDK/RPC reload response는 structured adapter result로 두고, chat history에는 reload summary marker만 남긴다.

예:

```text
Capability registry changed. Runtime reload is required before new capabilities are active.
```

실제 marketplace manifest, versioned cache path, dependency closure, secure-storage key, pending update detail은 internal state 또는 adapter diagnostics에 둔다.

### Phase 0F: Connector Auth Recovery Compatibility

MCP auth/UI 분석 결과 connector auth 회복 경로는 public history에 그대로 흘리면 안 된다.

1차 호환 방식:

- `needsAuth`, `needsStepUp`, `manualCallbackRequired`는 internal connector state에 둔다.
- chat history에는 짧은 diagnostic marker만 남긴다.
- browser authorization URL, callback URL, OAuth state, secure-storage key, refresh failure detail은 history/RPC event에 넣지 않는다.
- interactive UI는 browser URL copy와 manual callback paste를 제공할 수 있지만, headless/RPC adapter는 callback capability를 명시해야 한다.
- auth success 후 reconnect/discover 결과는 structured adapter result로 두고, history에는 "connector reloaded" 수준의 marker만 둔다.
- SDK-hosted MCP JSON-RPC message, outer control request id, IDE file update notification, experiment gate sync는 public history에 넣지 않는다.
- dynamic connector set mutation은 SDK/RPC adapter response로 `added`, `removed`, `errors`를 반환할 수 있지만, handshake pending과 subsequent discovery는 internal connector state로 둔다.

예:

```text
Connector authentication changed. Runtime capabilities were refreshed.
```

### Phase 0G: Runtime Command Surface Compatibility

slash command를 단순 user text로 열지 않는다. Claude Code의 `prompt`/`local`/`local-jsx` 구분을 Agentica에도 옮긴다.

1차 호환 방식:

- prompt command는 model input으로 확장될 수 있는 command로만 둔다.
- local command는 runtime control action으로 두고 typed result를 반환한다.
- interactive UI command는 core가 아니라 adapter command로 둔다.
- command output은 public history, model-visible hidden message, UI-only state 중 목적지를 명시한다.
- noninteractive/RPC/remote bridge에서 실행 가능한 command는 allowlist로 제한한다.
- manual compact는 local command이지만 normal user message로 저장하지 않고 compact transaction으로 처리한다.
- context diagnostics는 raw history가 아니라 projected model request를 기준으로 계산한다.
- memory edit command는 persistent instruction source control plane으로 두고 core public event에는 짧은 marker만 남긴다.
- clear/resume/branch/rewind는 transcript append가 아니라 session/history transaction이다.
- model/fast/effort/advisor/login/logout은 runtime state observer와 cache invalidation을 타야 한다.
- copy/export/browser/editor/GitHub setup은 adapter intent 또는 integration wizard로 두고 core event에는 최소 marker만 남긴다.
- prompt workflow command의 allowed operation override는 command invocation scope에만 적용한다.
- `/btw` 같은 side question은 main conversation append가 아니라 fork/side-query preview로 처리한다. 결과를 public history에 자동 저장하지 않는다.
- skills/agents/tasks command는 capability/agent/task registry의 materialized view와 control surface다. text command result가 아니라 registry projection과 typed mutation으로 둔다.
- terminal setup, keybindings, native install, voice enable처럼 local machine state를 바꾸는 command는 `adapterIntent`보다 강한 local mutation 분류를 둔다. backup/restore, exclusive create, platform/remote-SSH gate, device permission probe를 public history와 분리한다.
- Chrome/Desktop/Mobile/Web setup은 browser/device/account integration이다. URL, token, QR, extension state, local `gh` token은 public model context에 넣지 않는다.
- connector registry command는 UI와 direct mutation subcommand를 동시에 가질 수 있다. direct mutation도 registry version bump와 refresh transition으로 처리한다.

예:

```text
Runtime command completed. Model context was refreshed.
```

실제 command args, hidden meta messages, editor path, memory file path, compact summary metadata, remote bridge request id는 internal state 또는 adapter sidecar에 둔다.

초기 command result union은 다음 정도로 시작한다.

```typescript
type AgenticaLocalCommandResult =
  | { type: "text"; text: string; display: "user" | "system" }
  | { type: "skip" }
  | { type: "compact"; transaction: AgenticaCompactTransaction }
  | { type: "sessionSwitch"; sessionId: string }
  | { type: "permissionUpdate"; updates: AgenticaPermissionUpdate[] }
  | { type: "diagnostic"; summary: string; detailsRef?: string }
  | { type: "sideQuery"; queryId: string; previewRef: string }
  | { type: "registryMutation"; registry: "connector" | "capability" | "agent" | "task"; version: number }
  | { type: "localMachineMutation"; summary: string; auditRef?: string }
  | { type: "adapterIntent"; intent: AgenticaAdapterIntent };
```

remote/RPC/headless allowlist는 default-deny로 둔다. bridge-safe prompt command라도 shell/editor/browser side effect가 prompt 내부에서 유도될 수 있으므로 command-scoped allowed operation과 client capability를 함께 검사한다.

### Phase 0H: UI Adapter/Render Projection Compatibility

Claude Code UI adapter 분석 결과, render projection은 model context projection과 같지 않다. `Messages.tsx`는 원본 message를 normalize/filter/group/collapse/virtualize하고, fullscreen transcript는 compact 이전 scrollback을 보존할 수 있지만 query/model projection은 compact boundary 이후를 쓴다.

Agentica도 chat/RPC/terminal adapter로 보이는 surface를 core history와 1:1로 묶지 않는다.

1차 호환 방식:

- `AgenticaHistory[]`는 canonical public history로 유지한다.
- model-facing request는 context projector가 만든다.
- UI-facing rows는 adapter-local `AgenticaRenderProjection`이 만든다.
- compact/task/remote/capability marker는 짧은 render row로만 보여준다.
- large execute result는 full value 대신 preview와 reference로 렌더링한다.
- search/collapse/expand/selection/cursor/scroll state는 adapter sidecar에 둔다.
- prompt input의 paste/image/editor/stash/suggestion state는 public history에 넣지 않는다.
- transcript/export/plain-text renderer는 markdown/card renderer와 별도 projection을 쓴다.
- `MicroAgentica` chat path에는 Agentica Next projection state를 강제하지 않는다.

예:

```text
Tool result was shortened for display. Full value is available as a runtime reference.
```

실제 operation arguments/value 전체, local file/editor path, clipboard payload, image binary, search positions, scroll anchor, collapsed group metadata는 public history text에 넣지 않는다.

초기 adapter projection은 다음 정도로 시작한다.

```typescript
interface AgenticaRenderMessageRow {
  id: string;
  sourceHistoryIds: string[];
  kind:
    | "user"
    | "assistant"
    | "operationSelection"
    | "operationResult"
    | "diagnostic"
    | "compactMarker"
    | "taskMarker"
    | "system";
  visibility: "normal" | "collapsed" | "hidden";
  status?: "streaming" | "running" | "resolved" | "failed";
  title?: string;
  bodyPreview?: string;
  bodyRef?: string;
  searchText?: string;
  metadataRef?: string;
}
```

adapter 내부에는 public row와 별도로 render cache/viewport state를 둘 수 있다.

```typescript
interface AgenticaRenderProjectionState {
  rows: AgenticaRenderMessageRow[];
  rowAnchor?: {
    id: string;
    sourceHistoryId?: string;
    fallbackIndex: number;
  };
  rowStaticHints: Record<string, "static" | "dynamic">;
  collapsedGroups: Record<string, boolean>;
  expandedRows: Record<string, boolean>;
  search?: {
    query: string;
    matchCount: number;
    currentIndex: number;
  };
}
```

이 type은 core event union이 아니라 chat/adapter package의 display helper로 시작한다. 추후 terminal adapter를 만들더라도 custom Ink/Yoga renderer는 core dependency로 들이지 않는다.

세부 규칙:

- row id는 source history id와 render transform id를 섞어 만들되, collapse/grouping/compact marker가 들어와도 기존 row가 불필요하게 remount되지 않게 한다.
- non-virtual render path에는 cap이 필요하고, cap slice는 count 기반이 아니라 stable anchor 기반이어야 한다.
- row static/dynamic 판단은 conservative하게 한다. streaming operation, unresolved operation, width-sensitive preview, latest output, visible thinking row는 dynamic이다.
- search text는 visible renderer와 drift하지 않게 tool/operation별 extractor를 둘 수 있다. full JSON source를 그대로 검색 대상으로 삼지 않는다.
- selection, cursor, scroll, search position, clipboard, editor path, image paste buffer는 adapter sidecar다.
- terminal adapter를 만들 경우 packed cell buffer, escape sequence, alt-screen mode, cursor declaration, soft-wrap bitmap은 adapter 내부 state이며 `AgenticaHistory`나 `AgenticaRuntimeState`의 canonical history가 아니다.

### Phase 1: History Compatibility

compact summary를 기존 `systemMessage` history로 남긴다.

권장 text:

```text
Context compacted. The next turn will continue from an internal summary.
```

상세 summary와 metadata를 전부 text에 넣지 않는다. chat UI에 그대로 노출되기 때문이다.

상세 compact summary는 internal runtime state 또는 adapter storage에 둔다. resume JSON으로 꼭 내려야 한다면 `systemMessage.text`에 사람이 읽을 짧은 문장과 structured sidecar를 분리하는 새 type을 Phase 2에서 도입한다.

### Phase 2: Structured Compact History

충분한 테스트 후 새 history discriminant를 추가한다.

```typescript
interface IAgenticaCompactHistoryJson {
  type: "compact";
  id: string;
  created_at: string;
  trigger: "manual" | "auto" | "reactive";
  summary: string;
  preTokens: number;
  postTokens?: number;
  metadata: {
    selectedOperations: AgenticaOperationRef[];
    pendingStack: AgenticaOperationRef[];
    resultRefs: AgenticaResultReference[];
    summarizedHistoryIds?: string[];
    preservedHistoryIds?: string[];
  };
}
```

이 phase의 필수 변경:

1. history union
2. JSON union
3. factory
4. transformHistory
5. decodeHistory projection
6. chat renderer
7. RPC serialization 정책
8. tests

### Phase 3: Public Runtime Events

compact, task runtime, remote runtime이 안정된 뒤 event를 공개한다.

```typescript
type AgenticaRuntimeEvent =
  | AgenticaCompactEvent
  | AgenticaContextProjectionEvent
  | AgenticaOperationSearchEvent
  | AgenticaTaskEvent
  | AgenticaRemoteSessionEvent;
```

처음에는 단일 `compact` event를 권장한다.

```typescript
interface AgenticaCompactEvent extends AgenticaEventBase<"compact"> {
  trigger: "manual" | "auto" | "reactive";
  phase: "start" | "end" | "error";
  preTokens?: number;
  postTokens?: number;
  errorMessage?: string;
}
```

progress streaming은 후속 phase에서 연다. 현재 RPC가 assistant/describe도 final-only라서 compact progress만 streaming으로 공개하면 API 일관성이 떨어진다. task event도 같은 이유로 start/progress/complete를 바로 streaming하지 않는다. 먼저 `taskComplete`와 `taskStop` 같은 terminal event만 검토한다. remote event는 더 늦게 열어야 한다. reconnect, heartbeat, permission prompt, transport swap 같은 내부 event를 그대로 공개하면 client가 구현 세부에 묶인다.

## RPC 정책

1차 RPC는 compact event를 노출하지 않는다. task event도 1차 RPC에는 노출하지 않는다. remote session event 역시 1차 RPC에는 노출하지 않는다. long-running operation을 RPC 사용자가 제어해야 하는 요구가 생기면 `task` listener와 `stopTask` method를 별도 opt-in으로 설계한다. remote control이 필요하면 `remoteSession` listener와 `interruptRemoteSession` method를 task API와 분리한다.

Phase 3에서 노출할 때는 optional listener로 추가한다.

```typescript
compact?: (evt: IAgenticaEventJson.ICompact) => Promise<void>;
```

기존 `call` listener는 arguments override 기능을 갖고 있으므로 반드시 현재 순서와 await semantics를 유지한다.

interaction을 RPC로 열 때는 `call` listener에 섞지 않는다. 별도 optional listener가 낫다.

```typescript
interaction?: (evt: IAgenticaEventJson.IInteraction) => Promise<IAgenticaInteractionAnswerJson>;
```

이 listener는 channel이 UI를 렌더링할 수 있음을 opt-in으로 알려야 한다. 그렇지 않으면 AskUserQuestion/PlanApproval류 operation은 selector 후보에서 제외한다.

## Chat 정책

Phase 1의 `systemMessage` compact text는 짧게 렌더링한다. 긴 summary는 채팅 본문에 그대로 넣지 않는다.

현재 `@agentica/chat`은 final-only UI다. `assistantMessage`와 `describe` event를 `join()`한 뒤 history로 append하며, runtime progress나 streaming token을 그리지 않는다. 따라서 compact/task/remote progress event를 core에 추가하더라도 chat package에는 별도 opt-in renderer가 생기기 전까지 흘리지 않는다.

현재 execute renderer는 `describe.executes`의 arguments/value를 전체 JSON으로 출력한다. result budget은 model-facing context만 줄이면 안 되고 chat display contract도 같이 바꿔야 한다.

권장 display contract:

- small result: 기존처럼 JSON preview 표시
- large result: preview + result reference 표시
- compacted result: compact marker와 reference만 표시
- task/remote result: terminal summary + explicit details action

Phase 2에서 compact 전용 renderer를 만들면 다음을 보여준다.

- trigger
- pre/post token estimate
- compacted result count
- restored selected operations count
- "details" 접힘 영역의 summary

## Context Projection 정책

Public history와 model-facing projection은 분리한다.

```typescript
interface AgenticaContextProjection {
  messages: OpenAI.ChatCompletionMessageParam[];
  sourceHistoryIds: string[];
  omittedHistoryIds: string[];
  resultRefs: AgenticaResultReference[];
  tokenEstimate: number;
}
```

`factory.decodeHistory()`는 현재 full history를 바로 OpenAI message로 바꾼다. runtime에서는 projector를 별도로 두고 다음을 처리한다.

- compact boundary 이후만 projection
- large execute result preview/reference 적용
- selected operation full schema 주입
- validation feedback 유지
- system/common prompt ordering 유지

## 호환성 규칙

- 기존 `Agentica.conversate()` signature는 유지한다.
- 기존 `Agentica.on()` event listener는 깨지지 않는다.
- `IAgenticaHistoryJson` 입력으로 resume하는 사용자는 기존 history를 계속 넣을 수 있어야 한다.
- 새 runtime은 opt-in으로 시작한다.
- `MicroAgentica`에는 연결하지 않는다.
- external connector registry hot-swap, schedule, team/mailbox는 public JSON에 바로 넣지 않는다.
- capability pack/skill/plugin registry도 public JSON에 바로 넣지 않는다.
- capability source declaration, installed pack state, dependency graph, pending update details도 public JSON에 바로 넣지 않는다.
- task output reference, task notification, stop transition도 public JSON에 바로 넣지 않는다.
- remote session transport, heartbeat, worker credential, sequence cursor, permission pending map도 public JSON에 바로 넣지 않는다.
- team registry, mailbox raw message, in-process teammate transcript, permission sync request/response도 public JSON에 바로 넣지 않는다.

## Connector와 Capability Registry 공개 보류

MCP, Skill/Plugin, Remote/Bridge 분석 결과 registry와 runtime connection state는 session 중 자주 바뀐다.

- auth state 변화
- server reconnect
- `tools/list_changed`
- plugin reload
- skill directory dynamic discovery
- conditional skill activation
- remote reconnect/transport swap
- worker JWT refresh
- remote permission prompt cancel
- direct-connect attach/detach

따라서 초기 public surface에는 registry diff event를 열지 않는다. Runtime 내부에서만 version을 올리고, model-facing context projection과 selector index를 갱신한다. public event가 필요해지면 Phase 3 이후 `registryChanged` 같은 낮은 수준 event보다 `connectorAuthRequired`, `capabilityLoaded`처럼 의미 있는 event부터 여는 편이 낫다.

## 구현 체크리스트

1. `AgenticaRuntimeState`와 projector를 internal로 만든다.
2. result budget과 compact summary를 internal state로 검증한다.
3. `systemMessage` 호환 모드로 최소 history marker를 남긴다.
4. prompt-too-long/reactive compact 테스트를 작성한다.
5. structured compact history를 추가할지 결정한다.
6. public event/RPC/chat 확장을 별도 PR로 분리한다.
