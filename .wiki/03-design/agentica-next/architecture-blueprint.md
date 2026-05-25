# Agentica Next 아키텍처 청사진

## 범위

대상은 `Agentica`다. `MicroAgentica`는 현행 경량 facade를 유지한다.

## 현재 구조의 주요 anchor

- `Agentica` facade: `packages/core/src/Agentica.ts:52`
- `Agentica.conversate()`: `packages/core/src/Agentica.ts:138`
- executor 호출: `packages/core/src/Agentica.ts:175`
- context 생성: `packages/core/src/Agentica.ts:253`
- 기본 executor: `packages/core/src/orchestrate/execute.ts:11`
- selector: `packages/core/src/orchestrate/select.ts:47`
- caller: `packages/core/src/orchestrate/call.ts:37`
- operation composition: `packages/core/src/context/internal/AgenticaOperationComposer.ts:17`
- request wrapper: `packages/core/src/utils/request.ts:16`

## 문제의 본질

현재 구조는 function calling correctness에는 강하다. 특히 `call.ts`의 JSON parse/type validation feedback loop는 유지할 가치가 높다.

하지만 Agentica가 큰 API surface와 긴 세션을 다루려면 아래 계층이 빠져 있다.

- context projection
- local operation index
- operation runtime metadata
- stateful loop transition
- result budget
- result materialization/reference store
- progressive content read
- compact/recovery
- selector strategy abstraction

## 제안 모듈

### AgenticaRuntime

기존 `execute()`를 즉시 제거하지 않고, 새 runtime executor로 병행 도입한다.

```typescript
type AgenticaRuntimePhase =
  | "prepare_context"
  | "select_operations"
  | "call_model"
  | "execute_operations"
  | "append_results"
  | "compact_retry"
  | "describe"
  | "finish";
```

`AgenticaRuntime`은 phase별 deps를 주입받는다. 테스트는 phase transition 단위로 한다.

### AgenticaRuntimeState

```typescript
interface AgenticaRuntimeState {
  histories: AgenticaHistory[];
  prompt: AgenticaUserMessageHistory;
  stack: AgenticaOperationSelection[];
  projectedMessages: OpenAI.ChatCompletionMessageParam[];
  turn: number;
  transition?: AgenticaRuntimeTransition;
  compact?: AgenticaCompactState;
  resultStore?: AgenticaResultStoreState;
  contentSegments?: Record<string, AgenticaContentSegment>;
  attachmentQueue?: AgenticaRuntimeAttachment[];
  tasks?: Record<string, AgenticaTaskRuntimeState>;
  teams?: Record<string, AgenticaTeamRuntimeState>;
  remoteSessions?: Record<string, AgenticaRemoteSessionState>;
  mode?: AgenticaRuntimeMode;
  pendingInteractions?: Record<string, AgenticaPendingInteraction>;
  connectorRegistryVersion?: number;
  capabilityRegistry?: AgenticaCapabilityRegistryState;
}
```

현재 `AgenticaContext`를 직접 mutation하는 대신 runtime state를 만들고, 필요한 시점에 context로 project한다.

### AgenticaRuntimeStateStore

Claude Code `src/state/store.ts`, `AppStateProvider`, `onChangeAppState` 분석 결과 runtime state는 단순 object가 아니라 store와 diff observer를 가져야 한다.

```typescript
interface AgenticaRuntimeStateStore {
  getState(): AgenticaRuntimeState;
  setState(updater: (prev: AgenticaRuntimeState) => AgenticaRuntimeState): void;
  subscribe(listener: () => void): () => void;
}

interface AgenticaRuntimeStateObserver {
  onChange(args: {
    previous: AgenticaRuntimeState;
    next: AgenticaRuntimeState;
    source?: AgenticaRuntimeTransitionSource;
  }): Promise<void> | void;
}
```

초기 observer 책임:

- permission mode sync
- connector registry version 증가와 selector cache invalidation
- task terminal notification queue
- result reference lifecycle and digest/version dedup
- attachment drain into next model-facing projection
- compact boundary marker projection
- remote reconnect/status transition logging
- team member idle/shutdown notification

이 store는 `Agentica` internal wrapper 전용이다. `IAgenticaHistoryJson`과 `MicroAgentica`에는 연결하지 않는다.

### AgenticaOperationIndex

DBMS 없는 local operation search index다.

역할:

- operation metadata 추출
- tokenization
- lexical scoring
- top-K 후보 반환

이 모듈은 `Agentica` selector용이며 `MicroAgentica` 경로에는 연결하지 않는다.

상태: 2026-05-24 1차 구현 완료. 실제 파일은 `packages/core/src/selector/AgenticaOperationIndex.ts`이며, `MicroAgentica` path는 변경하지 않았다.

### AgenticaSelector

```typescript
interface AgenticaSelector {
  select(ctx: AgenticaContext, candidates?: AgenticaOperation[]): Promise<AgenticaOperationSelection[]>;
}
```

전략:

- `llm`: 현행 selector
- `local`: operation index만 사용
- `hybrid`: local top-K 뒤 LLM selector

초기 기본값은 호환성을 위해 현행 `llm`을 유지하고, opt-in으로 `hybrid`를 넣는 것이 안전하다.

상태: 2026-05-24에 `IAgenticaConfig.selector.type`으로 `llm`, `standard`, `local`, `hybrid`, `auto`를 추가했다. 기본값은 `llm`이다.

### AgenticaContextProjector

`histories -> ChatCompletionMessageParam[]` 변환을 담당한다. 현재 `factory.decodeHistory()`가 모든 execute result를 full JSON으로 넣는 문제를 해결하는 위치다.

책임:

- compact boundary 이후만 projection
- 큰 execute result preview화
- selected stack/pending state 재주입
- system/common prompt ordering 보장
- result/segment/task refs를 model-facing context에 필요한 만큼만 재주입
- token/result budget과 output reserve 적용

상태: 2026-05-25에 1차 구현을 시작했다. 이름은 아직 독립 class가 아니라 `factory/histories.ts`의 `decodeHistories()`이며, `IAgenticaConfig.context.resultBudget`으로 큰 execute result의 preview/reference projection을 opt-in 적용한다. Public history와 `MicroAgentica` path는 변경하지 않았다.

### AgenticaResultStore

큰 operation result를 public history와 model-facing context에 그대로 반복 주입하지 않기 위한 runtime store다.

```typescript
interface AgenticaResultReference {
  id: string;
  source: "operation" | "task" | "connector" | "manual";
  contentType: string;
  preview: string;
  digest?: string;
  version?: string;
  tokenEstimate?: number;
  byteLength?: number;
  segments?: string[];
  storage?: "memory" | "adapter" | "external";
}

interface AgenticaResultStoreState {
  refs: Record<string, AgenticaResultReference>;
  recentRefIds: string[];
}
```

1차 구현은 memory-only와 adapter hook을 허용한다. core가 파일 저장을 직접 책임지지는 않는다. adapter가 persistence를 제공하지 못하면 `storage: "memory"` 또는 preview-only fallback을 명시한다.

### AgenticaSegmentedContentReader

Claude Code의 `FileRead` line/page/range, `Grep`/`Glob` cap, task output cursor를 Agentica general result protocol로 일반화한다.

```typescript
interface AgenticaContentSegment {
  sourceId: string;
  contentType: string;
  range?: {
    kind: "line" | "page" | "byte" | "jsonPath" | "item";
    start: number | string;
    end?: number | string;
  };
  digest?: string;
  version?: string;
  preview: string;
  fullRef?: string;
  tokenEstimate?: number;
  truncated: boolean;
}

interface AgenticaSegmentedContentReader {
  read(ref: AgenticaResultReference, range: AgenticaContentSegment["range"]): Promise<AgenticaContentSegment>;
}
```

적용 대상은 파일이 아니라 큰 controller/API/MCP/remote/task output 전반이다. 같은 digest/version이면 projector는 full segment 대신 unchanged stub을 넣을 수 있다.

### AgenticaRuntimeAttachmentQueue

Claude Code의 attachment drain은 compact 후 file/plan/skill/tool/MCP state를 다시 붙인다. Agentica 대응물은 selected operations, validation retry facts, result refs, segment refs, task output cursor다.

```typescript
interface AgenticaRuntimeAttachment {
  id: string;
  kind: "operation" | "validation" | "result" | "segment" | "task" | "connector" | "policy";
  priority: number;
  expiresAtTurn?: number;
  project: "model" | "render" | "resume" | "audit";
}
```

이 queue는 public history가 아니라 projector 입력이다. compact 후 restore 순서와 next-turn projection을 안정화하는 데 쓴다.

### AgenticaCompactor

압축은 두 층으로 분리한다.

- microcompact: 큰 result/stale result 축소
- full compact: summary history 생성

파일 저장은 core가 책임지지 않는다. 큰 payload persistence는 adapter hook으로 둔다.

### AgenticaOperationRuntime

`AgenticaOperation`을 바꾸지 않고 runtime metadata를 덧씌운다.

```typescript
interface AgenticaOperationRuntime {
  operation: AgenticaOperation;
  readOnly?: boolean;
  destructive?: boolean;
  concurrencySafe?: boolean;
  maxResultCharacters?: number;
  searchHint?: string;
  alwaysLoad?: boolean;
}
```

초기에는 config/controller extension에서 optional로 받는다.

### AgenticaTaskRuntime

Claude Code `tasks`와 `utils/task` 분석 결과, long-running work는 function call result와 분리된 runtime primitive여야 한다.

```typescript
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

interface AgenticaTaskOutputRef {
  kind: "file" | "adapter" | "memory";
  uri: string;
  maxInlineBytes?: number;
  digest?: string;
}
```

초기에는 `Agentica` internal runtime state로만 둔다. public event/RPC/chat 확장은 output reference, stop transition, resume sidecar, notification dedup이 검증된 뒤 연다.

### AgenticaInteractionRuntime

Claude Code의 `AskUserQuestion`, `EnterPlanMode`, `ExitPlanModeV2`, `SendUserMessage`에서 확인한 것처럼 사용자 상호작용은 일반 operation 실행과 다르다.

```typescript
type AgenticaRuntimeMode = "default" | "plan" | "acceptEdits" | "dontAsk" | "auto";

interface AgenticaInteractionRuntime {
  mode: AgenticaRuntimeMode;
  prePlanMode?: AgenticaRuntimeMode;
  pendingUserInteraction?: {
    id: string;
    kind: "question" | "approval" | "notification";
    requiresRenderableClient: boolean;
  };
  approvedPlan?: {
    text: string;
    artifactRef?: string;
    editedByUser?: boolean;
  };
}
```

plan mode는 prompt convention이 아니라 permission/runtime mode다. `Agentica`에만 opt-in으로 두고, `MicroAgentica`에는 연결하지 않는다.

### AgenticaConfigRegistry

runtime 설정은 ad hoc object가 아니라 registry로 관리한다.

```typescript
interface AgenticaRuntimeSetting<T = unknown> {
  key: string;
  scope: "global" | "project" | "session";
  type: "boolean" | "string" | "number" | "json";
  description: string;
  options?: readonly T[];
  validateOnWrite?: (value: T) => Promise<void> | void;
  appStateSync?: (state: AgenticaRuntimeState, value: T) => AgenticaRuntimeState;
}
```

prompt 문서는 registry에서 생성한다. 이렇게 해야 config prompt, validation, runtime sync가 서로 drift하지 않는다.

### AgenticaConnectorRuntime

MCP/Web/RemoteTrigger/Cron 분석 결과 외부 connector는 다음 metadata 축이 필요하다.

```typescript
interface AgenticaConnectorRuntimeMetadata {
  externalNetwork?: boolean;
  authRequired?: boolean;
  remoteControlPlane?: boolean;
  sourceAttributionRequired?: boolean;
  binaryResultPolicy?: "inline-forbidden" | "reference" | "adapter";
  schedulePolicy?: "none" | "session-only" | "durable";
}
```

MCP auth pseudo-tool처럼 operation registry는 runtime 중 hot-swap될 수 있어야 한다.

Claude Code `services/mcp` 추가 분석 결과 connector runtime은 metadata만이 아니라 다음 lifecycle을 가져야 한다.

```typescript
interface AgenticaConnectorClientState {
  key: string;
  scope: "global" | "project" | "session" | "plugin" | "managed";
  status: "pending" | "connected" | "failed" | "needsAuth" | "disabled";
  transport?: "stdio" | "http" | "sse" | "ws" | "sdk-control" | "in-process";
  controlOwner?: "runtime" | "sdk-host" | "ide-adapter";
  reconnectAttempt?: number;
  error?: string;
}
```

connector registry 변경은 `connectorRegistryVersion`을 올리고, local operation index와 selector cache를 무효화한다. auth failure는 operation failure가 아니라 `needsAuth` registry state로 취급한다.

MCP SDK/in-process transport 추가 분석에서 connector runtime에는 transport ownership 축도 필요하다는 점이 확인됐다.

- `sdk-control`: connector server는 SDK host process에 있고 Agentica runtime은 JSON-RPC를 control request로 중계한다.
- `in-process`: connector server와 client가 같은 process 안에서 linked transport pair로 통신한다.
- `ide-adapter`: IDE extension처럼 model-facing tool보다 notification/telemetry/control side effect가 중요한 내부 connector다.

따라서 connector set mutation은 다음 stable response를 반환한다.

```typescript
interface AgenticaConnectorSetResult {
  added: string[];
  removed: string[];
  errors: Record<string, string>;
  handshakePending?: string[];
}
```

`handshakePending`은 control request는 성공했지만 SDK/in-process connector discovery가 아직 끝나지 않은 상태를 나타낸다. 이 둘을 같은 success로 뭉개면 SDK host와 runtime 사이에 deadlock 또는 false-ready 상태가 생긴다.

MCP auth/UI 추가 분석에서 connector state에는 credential과 approval axis가 따로 필요하다는 점이 확인됐다.

```typescript
interface AgenticaConnectorCredentialState {
  kind: "none" | "oauth" | "session" | "xaa" | "customHeader";
  status:
    | "notRequired"
    | "valid"
    | "needsAuth"
    | "needsStepUp"
    | "refreshing"
    | "clearing"
    | "failed";
  credentialKey?: string;
  manualCallbackRequired?: boolean;
}

interface AgenticaConnectorApprovalState {
  workspaceTrust: "accepted" | "missing" | "notRequired";
  connectorApproval: "approved" | "rejected" | "pending" | "implicit";
  operationPermissionRequired: boolean;
}
```

credential key는 connector display name이 아니라 config fingerprint를 포함한다. project connector approval과 operation permission은 분리한다. auth success는 token 저장만으로 끝나지 않고 reconnect/discover/projection refresh까지 이어져야 한다.

### AgenticaRemoteRuntime

Claude Code `remote`, `server`, `bridge` 분석 결과 remote runtime은 connector metadata보다 더 긴 lifecycle을 가진다.

```typescript
interface AgenticaRemoteSessionState {
  id: string;
  transport: "websocket" | "hybrid-ws-post" | "sse-ccr" | "direct";
  status:
    | "connecting"
    | "connected"
    | "reconnecting"
    | "detached"
    | "closed"
    | "failed";
  workspace: {
    cwd: string;
    isolation: "same-dir" | "worktree" | "remote";
  };
  auth: {
    kind: "oauth" | "session-jwt" | "server-token";
    expiresAt?: number;
    refreshable: boolean;
  };
  worker?: {
    epoch?: number;
    status?: "idle" | "running" | "requires_action";
    internalEventsPending?: number;
  };
  sequence?: {
    lastReceived?: number;
    lastFlushedUuid?: string;
  };
  delivery?: {
    lastReceivedEventId?: string;
    lastProcessedEventId?: string;
  };
  pendingPermissions: Record<string, AgenticaPendingInteraction>;
  resumeRef?: string;
}
```

Remote SDK events are not public Agentica events by default. They pass through a remote message adapter that decides whether an event becomes a model notification, a short history marker, a client event, or nothing.

```typescript
interface AgenticaRemoteMessageAdapter {
  toModelNotification(event: unknown): AgenticaRuntimeNotification | undefined;
  toHistoryMarker(event: unknown): AgenticaHistory | undefined;
  toClientEvent(event: unknown): AgenticaRuntimeEvent | undefined;
}
```

초기에는 remote runtime을 `Agentica` internal adapter로만 둔다. reconnect/heartbeat/auth refresh/sequence flush는 task failure와 분리하고, permission prompt는 interaction runtime으로 넘긴다.

추가로 Claude Code `cli/transports` 분석 결과 remote transport interface에는 read/write만으로 부족하다.

```typescript
interface AgenticaRemoteTransport {
  connect(): Promise<void>;
  close(): Promise<void> | void;
  writeClientEvent(event: AgenticaRemoteClientEvent): Promise<void>;
  writeInternalEvent(event: AgenticaRemoteInternalEvent): Promise<void>;
  reportState(state: "idle" | "running" | "requires_action", detail?: unknown): void;
  reportMetadata(metadata: Record<string, unknown>): void;
  reportDelivery(eventId: string, status: "received" | "processing" | "processed"): void;
  flush(): Promise<void>;
}
```

설계 원칙:

- UI stream event, internal transcript event, worker state, delivery ack는 reliability class가 다르다.
- worker state/metadata는 last-value coalescing이 맞고 transcript/internal event는 ordered queue가 맞다.
- SDK `control_request` id, operation/tool id, connector JSON-RPC id를 섞지 않는다.
- transport reconnect, worker epoch mismatch, session archive, task stop은 서로 다른 lifecycle transition이다.
- QR/status/keyboard shortcut 같은 CLI renderer state는 core remote runtime state에 넣지 않는다.

### AgenticaCapabilityPack

Claude Code Skill/Plugin loading은 extension이 operation 하나가 아니라 skill, prompt, hook, MCP server, userConfig를 묶는 pack임을 보여준다.

초기 Agentica에는 public plugin system을 바로 열지 않고, 내부 manifest subset만 둔다.

```typescript
interface AgenticaCapabilityPackManifest {
  name: string;
  version?: string;
  operations?: AgenticaPackOperationRef[];
  procedures?: AgenticaProcedureDefinition[];
  connectors?: AgenticaConnectorRuntimeMetadata[];
  userConfig?: Record<string, AgenticaCapabilityUserConfigOption>;
  dependencies?: string[];
  artifactSourcePolicy?: AgenticaCapabilityArtifactSourcePolicy;
}

interface AgenticaProcedureDefinition {
  key: string;
  description: string;
  whenToUse?: string;
  allowedOperations?: string[];
  execution?: "inline" | "fork";
  contentRef: AgenticaContentReference;
}

interface AgenticaCapabilityArtifactSourcePolicy {
  remote: "same-source-root" | "explicit-allowlist" | "disabled";
  allowlist?: Array<{ host: string; pathPrefix?: string; httpsOnly?: boolean }>;
  localRootContainment: "pack-root";
  requireContentHash?: boolean;
}
```

procedure 본문은 상시 prompt에 넣지 않는다. frontmatter/meta만 local index에 넣고, selector가 필요하다고 판단한 뒤 lazy load한다.

Claude Code plugin marketplace 분석 결과 capability registry는 manifest loader와 별도로 intent/materialization/projection을 분리해야 한다.

```typescript
interface AgenticaCapabilityRegistryState {
  declaredSources: Record<string, AgenticaCapabilitySourceDeclaration>;
  materializedSources: Record<string, AgenticaMaterializedCapabilitySource>;
  installedPacks: Record<string, AgenticaCapabilityInstallEntry[]>;
  enabledPacks: Record<string, AgenticaCapabilityEnablement>;
  controlPlane?: AgenticaCapabilityControlPlaneState;
  projectionVersion: number;
  pendingReload?: boolean;
  pendingUpdates?: AgenticaCapabilityPendingUpdate[];
}

interface AgenticaCapabilityControlPlaneState {
  installed: AgenticaCapabilityListItem[];
  failed: AgenticaCapabilityFailureItem[];
  flagged: AgenticaCapabilityFlaggedItem[];
  errors: AgenticaCapabilityRegistryError[];
}

interface AgenticaCapabilityReloadResult {
  enabledCount: number;
  disabledCount: number;
  operationCount: number;
  procedureCount: number;
  connectorCount: number;
  hookCount: number;
  errorCount: number;
}
```

설계 원칙:

- install은 source/materialization보다 먼저 enablement intent를 기록한다.
- update는 non-inplace로 materialize하고 running session projection은 reload/restart 전까지 유지한다.
- dependency는 import graph가 아니라 capability presence guarantee다.
- cross-marketplace/source auto-install은 기본 금지하고 root source allowlist만 적용한다.
- connector binary/artifact URL은 marketplace/source allowlist와 별도 축이다. 기본은 같은 source root 또는 explicit allowlist만 허용한다.
- local MCPB/connector artifact path는 `./` prefix만으로 신뢰하지 않고 pack root `realpath` containment를 강제한다.
- secret userConfig는 model-visible content에 넣지 않고 runtime-only substitution으로만 쓴다.
- failed/flagged/needs-config capability는 숨기지 않고 recovery 가능한 control-plane item으로 투영한다.
- validation은 runtime loader보다 strict하게 두고 manifest, procedure frontmatter, connector config, hook config를 함께 검사한다.
- reload는 active projection 교체 boundary이며 connector reconnect key, hook swap, local search exclusion 갱신을 한 번에 처리한다.
- SDK/RPC reload는 text message가 아니라 structured command/agent/plugin/connector diff를 반환한다.
- startup background registry reconcile은 workspace trust 이후에만 실행한다.

### AgenticaTeamRuntime

TeamCreate/SendMessage는 sub-agent가 단순 child call이 아니라 team/task/mailbox runtime임을 보여준다.

```typescript
interface AgenticaTeamRuntimeState {
  teamName: string;
  leadAgentId: string;
  taskListId: string;
  members: Record<string, AgenticaTeamMemberState>;
  registryRef?: AgenticaResultReference;
  mailboxRef?: AgenticaResultReference;
}

interface AgenticaTeamMemberState {
  id: string;
  name: string;
  status: "starting" | "running" | "idle" | "stopping" | "stopped" | "failed";
  backend: "in-process" | "local-child-process" | "external-pane" | "remote";
  taskId?: string;
  permissionMode: AgenticaRuntimeMode;
  runtimeRef?: AgenticaResultReference;
}
```

추가로 다음 adapter를 둔다.

```typescript
interface AgenticaTeamExecutor {
  spawn(config: AgenticaTeamMemberSpawnConfig): Promise<AgenticaTeamMemberSpawnResult>;
  sendMessage(memberId: string, message: AgenticaTeamMessage): Promise<void>;
  terminate(memberId: string, reason?: string): Promise<boolean>;
  kill(memberId: string): Promise<boolean>;
  isActive(memberId: string): Promise<boolean>;
}

interface AgenticaMailboxAdapter {
  send(target: AgenticaMailboxTarget, message: AgenticaMailboxMessage): Promise<void>;
  read(target: AgenticaMailboxTarget): Promise<AgenticaMailboxEntry[]>;
  markRead(target: AgenticaMailboxTarget, entryId: string): Promise<void>;
}
```

초기 구현에서는 local file/in-memory adapter와 in-process executor만 internal runtime state로 둔다. Claude Code의 tmux/iTerm2 pane backend는 core 기능으로 들여오지 않는다. 외부 terminal integration이 필요하면 `external-pane` adapter가 `AgenticaTeamExecutor`를 구현하고 core에는 opaque runtime reference만 남긴다.

backend 설계 원칙:

- backend mode는 session startup snapshot으로 고정한다.
- spawn은 transaction처럼 처리해 process/pane만 생기고 registry/mailbox가 빠지는 중간 상태를 피한다.
- initial prompt와 shutdown/mode/permission control은 mailbox/control adapter로 보낸다.
- child process env/flag inheritance는 allowlist와 policy mode를 거친다.
- graceful terminate, force kill, idle, stopped, hidden/displayed는 서로 다른 state transition이다.
- pane id, process command, mailbox file path는 public history/RPC surface에 넣지 않는다.

public event/RPC 확장은 team cleanup, task ownership, mailbox safety, permission sync가 검증된 뒤 별도 phase에서 연다.

### AgenticaCoordinatorRuntime

Claude Code coordinator mode는 worker를 띄우는 prompt가 아니라 orchestration mode다.

```typescript
interface AgenticaCoordinatorRuntime {
  mode: "off" | "coordinator";
  workerAllowedOperations: string[];
  workerContextProjection: AgenticaContextProjection;
  scratchpadRef?: AgenticaResultReference;
  concurrencyPolicy: {
    readOnlyParallel: boolean;
    writeLaneKey?: string;
    verificationParallel: boolean;
  };
}
```

worker prompt는 parent history dump가 아니라 self-contained task brief, allowed operations, expected output contract, verification requirement로 생성한다. coordinator는 worker 결과를 relay하지 않고 직접 synthesis한다.

## 단계별 통합 순서

1. `AgenticaOperationIndex`를 내부 모듈로 추가한다.
2. `AgenticaSelector` 인터페이스를 만들고 현행 selector를 adapter로 감싼다.
3. hybrid selector를 opt-in으로 추가한다.
4. `AgenticaContextProjector`를 도입해 decodeHistory 경로를 대체 가능하게 한다.
5. `AgenticaResultStore`와 execute result preview/reference를 추가한다.
6. `AgenticaSegmentedContentReader`와 range/digest/unchanged projection을 추가한다.
7. compact boundary와 restore attachment queue를 추가한다.
8. task output reference와 internal task notification queue를 추가한다.
9. remote session state와 remote message adapter를 internal로 추가한다.
10. interaction/config/connector/capability-pack/team/coordinator runtime metadata를 internal로 추가한다.
11. `execute.ts`를 runtime loop로 대체하되 legacy executor는 유지한다.

## 유지할 것

- `Agentica` public facade
- `call.ts`의 validation feedback loop
- `AgenticaTokenUsage`
- event dispatch model
- custom executor hook
- `MicroAgentica` 전체
