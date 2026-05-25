# Agentica Operation Policy/State 설계

이 문서는 Claude Code의 Bash/File/Grep/Edit/Write/Task policy 구조를 Agentica operation 호출 모델로 번역한 설계 초안이다.

## 문제 정의

현재 Agentica는 operation schema validation과 실행 결과 event는 강하지만, 호출 전후의 operational state/policy가 약하다.

부족한 것:

- operation side-effect classification
- permission gate
- runtime-only argument와 model-visible argument 분리
- read-before-write 같은 precondition
- freshness/race check
- result semantic interpretation
- reusable permission rule
- large result projection

## Operation Metadata

core `AgenticaOperation`을 직접 바꾸지 말고 local index에 metadata를 붙인다.

```ts
interface AgenticaOperationPolicyMetadata {
  key: string;
  protocol: "http" | "class" | "mcp";
  controller: string;
  function: string;
  visibleName: string;
  sideEffect: "read" | "write" | "destructive" | "unknown";
  idempotency: "idempotent" | "non-idempotent" | "unknown";
  requiresConfirmation: boolean;
  requiresFreshState?: AgenticaStateRequirement[];
  resultProjection: "inline" | "summary" | "reference";
  maxInlineBytes?: number;
}
```

`requiresFreshState` 예시:

```ts
type AgenticaStateRequirement =
  | { type: "read-before-write"; resource: string }
  | { type: "version-match"; resource: string; versionField: string }
  | { type: "approval"; scope: string };
```

## Policy Gate

call 직전에 다음 gate를 둔다.

```ts
type AgenticaPolicyDecision =
  | { type: "allow" }
  | { type: "allowWithWarning"; warning: string }
  | { type: "ask"; reason: string; suggestedRule?: string }
  | { type: "deny"; reason: string };
```

입력:

- operation metadata
- parsed/validated arguments
- current histories
- runtime state
- controller policy
- user/session permission settings

중요:

- selector 단계에서도 policy를 참고하되, 최종 방어선은 call 직전이다.
- validation feedback loop가 policy denial을 "schema error"처럼 고치려 하면 안 된다. policy failure는 별도 event와 prompt가 필요하다.

## Permission Control Flow

Claude Code `hooks/toolPermission` 분석 결과, Agentica permission은 단일 confirmation callback이 아니라 call-time decision과 ask-resolution runtime을 분리해야 한다.

초기 internal contract:

```ts
type AgenticaPermissionBehavior = "allow" | "ask" | "deny" | "passthrough";

interface AgenticaPermissionDecision {
  behavior: AgenticaPermissionBehavior;
  reason?: AgenticaPermissionReason;
  message?: string;
  updatedArguments?: unknown;
  suggestions?: AgenticaPermissionUpdate[];
}

interface AgenticaPermissionUpdate {
  type: "addRules" | "replaceRules" | "removeRules" | "setMode" | "addScopes" | "removeScopes";
  destination: "policy" | "project" | "user" | "local" | "cliArg" | "session";
}

interface AgenticaPermissionRule {
  operationKey: string;
  argumentPattern?: string;
  behavior: "allow" | "ask" | "deny";
}

type AgenticaPermissionRulesBySource = Partial<
  Record<AgenticaPermissionUpdate["destination"], AgenticaPermissionRule[]>
>;

type AgenticaPermissionMode =
  | "default"
  | "plan"
  | "acceptEdits"
  | "dontAsk"
  | "auto"
  | "bypassPermissions";

interface AgenticaPermissionContext {
  mode: AgenticaPermissionMode;
  rules: AgenticaPermissionRulesBySource;
  shouldAvoidPermissionPrompts?: boolean;
  awaitAutomatedChecksBeforeDialog?: boolean;
  prePlanMode?: AgenticaPermissionMode;
}

interface AgenticaPendingPermissionRequest {
  id: string;
  operationKey: string;
  argumentsPreview: unknown;
  decision: AgenticaPermissionDecision;
  createdAt: number;
  source: "main" | "subagent" | "remote" | "worker";
}
```

decision pipeline:

1. operation/controller-local `checkPermissions`
2. global deny/ask/allow rule
3. safety/precondition rule
4. mode transform
5. ask 상태면 hook/UI/remote/worker adapter race
6. selected adapter의 `AgenticaPermissionUpdate[]`를 typed update로 적용
7. decision audit 기록

mode 원칙:

- `dontAsk`는 ask를 deny로 바꾼다.
- `bypassPermissions`도 explicit ask rule, deny rule, safety check를 우회하지 않는다.
- `auto`는 가장 좁은 safe fast-path와 classifier/heuristic을 거치되, classifier 불능은 정책적으로 fail-closed 또는 manual fallback 중 하나를 명시한다.
- `plan`은 plan exit 승인 전 write/destructive operation을 막고, plan 이전 mode를 복원해야 한다.
- `shouldAvoidPermissionPrompts`가 true면 PermissionRequest hook 또는 parent/leader delegation 이후 결정이 없을 때 deny한다.

approval adapter 원칙:

- local UI, SDK/RPC client, remote bridge, channel reply, worker leader, classifier, abort가 같은 pending request를 resolve할 수 있다.
- 여러 adapter가 동시에 응답할 수 있으므로 single-winner primitive가 필요하다.
- hook allow는 prompt를 생략할 수 있지만 deny/ask rule과 safety check를 우회하지 않는다.
- UI adapter는 policy를 직접 바꾸지 않고 `AgenticaPermissionUpdate[]`, feedback, updated arguments만 반환한다.
- source hierarchy와 persistence 가능 여부를 분리한다. managed/policy source는 user/session source보다 우선한다.

이 permission runtime은 `Agentica` 전용 wrapper에서 시작한다. `MicroAgentica`가 공유하는 core call path에는 붙이지 않는다.

## Command-driven Policy Mutation

Claude Code slash command catalog를 보면 permission/state mutation은 tool call 결과가 아니라 command control plane에서 직접 일어난다.

Agentica도 다음 command 결과를 별도 typed transition으로 둔다.

- `addScopes`: `/add-dir`처럼 작업 directory 또는 connector scope를 세션/로컬 설정에 추가한다.
- `permissionUpdate`: `/permissions` retry처럼 permission rule 변경과 model-visible retry message 삽입 가능성을 분리한다.
- `setMode`: `/plan`처럼 permission mode를 바꾸고, 선택적으로 다음 model query를 trigger한다.
- `sandboxUpdate`: shell command exclusion이나 sandbox profile 변경을 runtime policy namespace에 기록한다.
- `authChanged`: `/login`, `/logout`처럼 connector schema/cache, signed block, remote managed settings, policy limits를 invalidate한다.
- `modelConfigChanged`: `/model`, `/fast`, `/effort`, `/advisor`처럼 selector/projector/token budget이 보는 model state를 바꾼다.

이 transition은 history text로만 남기면 안 된다. public history에는 짧은 marker를 남기더라도 실제 rule/source/destination/old-new diff는 runtime state와 audit sidecar에 둔다.

## Runtime State

Claude Code의 `readFileState`처럼 operation 호출에도 state freshness가 필요하다.

예:

- resource read timestamp/version
- previous operation result digest
- approval grant
- selected operation stack state
- compact boundary id
- large result reference

초기 설계:

```ts
interface AgenticaRuntimeState {
  resources: Map<string, AgenticaResourceState>;
  approvals: Map<string, AgenticaApprovalGrant>;
  results: Map<string, AgenticaResultReference>;
  tasks?: Map<string, AgenticaTaskRuntimeState>;
  teams?: Map<string, AgenticaTeamRuntimeState>;
  permissions?: AgenticaPermissionContext;
  mode?: AgenticaRuntimeMode;
  pendingInteractions?: Map<string, AgenticaPendingInteraction>;
  pendingPermissionRequests?: Map<string, AgenticaPendingPermissionRequest>;
  connectorRegistryVersion?: number;
}
```

이 state는 public `IAgenticaHistoryJson`에 바로 넣지 않는다. 필요할 때 compact summary 또는 `systemMessage` 호환 형식으로만 LLM에 투영한다.

## Runtime State Diff Hook

Claude Code `onChangeAppState`는 permission mode, external metadata, model/settings, auth cache invalidation을 state diff에서 처리한다.

Agentica도 runtime mutation을 흩어진 side effect로 만들지 않는다.

```ts
interface AgenticaRuntimeStateObserver {
  onChange(args: {
    previous: AgenticaRuntimeState;
    next: AgenticaRuntimeState;
    source?: "turn" | "operation" | "permission" | "connector" | "compact" | "team" | "remote";
  }): Promise<void> | void;
}
```

초기 observer 책임:

- `mode` 변경 시 policy gate와 context projector가 보는 mode를 동기화한다.
- `connectorRegistryVersion` 변경 시 local operation index와 selector cache를 무효화한다.
- task terminal 상태가 되면 다음 turn notification queue에 넣고, output reference eviction은 별도 단계로 미룬다.
- pending interaction이 생기면 renderable client가 있는 channel에만 user-facing event를 낸다.
- pending permission request가 resolve되면 다른 approval channel에는 cancel/closed signal을 보낸다.
- remote/team 상태 변경은 operation failure가 아니라 runtime transition으로 남긴다.

이 observer는 `Agentica` 전용 runtime wrapper에 둔다. `call.ts`에 넣으면 `MicroAgentica`까지 영향을 받으므로 금지한다.

## Model-visible vs runtime-only arguments

Claude Code `BashTool`은 internal `_simulatedSedEdit`를 model schema에서 숨긴다. Agentica도 같은 분리가 필요하다.

예:

- auth headers
- tenant id
- current user id
- server-side cursor
- idempotency key
- permission approval token
- dry-run preview result

LLM function schema에는 business input만 노출하고, runtime-only 값은 executor boundary에서 주입한다.

## Shell/Platform Policy

Claude Code PowerShell 분석 결과, shell operation은 shell family별 provider와 policy namespace가 필요하다.

분리해야 할 축:

- visibility gate: platform, user type, env flag, workspace trust
- shell routing: input-box `!`, prompt/frontmatter shell, hook shell, model tool call
- parser adapter: bash/tree-sitter/spec parser와 PowerShell AST parser는 별개다.
- permission namespace: `Bash(...)` allow rule과 `PowerShell(...)` allow rule은 서로 섞이면 안 된다.
- path semantics: POSIX/Git Bash path, Windows native path, PowerShell provider path, UNC path가 다르다.
- sandbox capability: Windows native PowerShell처럼 policy가 sandbox를 요구하지만 platform이 지원하지 않는 경우 실행을 거부해야 한다.
- result semantics: `grep` no-match, `robocopy` success bitfield처럼 command family별 non-error exit code가 있다.

Agentica가 shell/runtime capability를 도입한다면 초기 public API가 아니라 internal provider contract로 시작한다.

```ts
interface AgenticaShellProvider {
  family: "bash" | "powershell";
  isAvailable(state: AgenticaRuntimeState): boolean;
  parse(command: string): Promise<AgenticaShellParseResult>;
  classify(command: AgenticaShellParseResult): AgenticaPolicyDecision[];
  buildSpawn(command: string, options: AgenticaShellSpawnOptions): Promise<AgenticaShellSpawnRequest>;
  interpret(result: AgenticaShellRawResult): AgenticaOperationSemanticResult;
}
```

policy reducer는 모든 shell/provider decision에 대해 `deny > ask > allow > passthrough`를 강제한다. parser failure, parser timeout, command-too-long은 `allow`가 아니라 검증 불가 상태로 취급한다.

REPL/scripting wrapper를 만들 경우 direct operation list와 internal primitive list를 분리한다. 숨겨진 primitive operation도 renderer, compact/collapse, permission audit, result projection에서는 식별 가능해야 한다. `PowerShell` 같은 alternate shell을 primitive set에 넣을지 독립 direct tool로 둘지는 명시 정책과 검증 항목으로 둔다.

## Parser Trust Gate

Claude Code `bashSecurity.ts`의 핵심은 "위험 패턴 발견"보다 "이 파서/분해 결과를 믿고 다음 단계로 넘어가도 되는가"다. Agentica도 operation argument에 DSL이나 mini-language가 섞일 때 이 gate를 둔다.

대상 예시:

- shell command, PowerShell command
- SQL-like filter/query
- JSONPath/JMESPath/jq expression
- template expression 또는 prompt workflow expression
- dynamic header/auth helper script
- file glob/path pattern

초기 타입:

```ts
type AgenticaParserTrustDecision =
  | { type: "trusted"; parser: string; normalized?: unknown }
  | { type: "untrusted"; parser: string; reason: string; exactAllowBypassable: boolean }
  | { type: "unavailable"; parser: string; fallback?: string; reason: string };

interface AgenticaPolicyReason {
  class:
    | "policy-deny"
    | "policy-ask"
    | "safety-warning"
    | "parser-untrusted"
    | "semantic-non-error"
    | "runtime-unavailable";
  message: string;
  source?: string;
}
```

원칙:

- parser unavailable, parser timeout, parser divergence는 success가 아니라 `parser-untrusted`다.
- `parser-untrusted`는 broad allow rule로 우회하지 않는다. exact allow만 별도 policy에 따라 허용할 수 있다.
- early allow fast-path는 전체 validator chain을 건너뛰므로 proof condition을 문서화하고 fixture로 고정한다.
- legacy parser와 신규 parser를 교체할 때는 shadow comparison과 divergence telemetry를 먼저 둔다.
- read-only classifier는 parser trust gate 뒤에만 실행한다. parser가 command/argument/path를 잘못 분해할 수 있으면 read-only auto-allow는 무효다.
- safety warning은 사용자가 승인할 수 있는 risk이고, parser-untrusted는 runtime이 자기 분석 결과를 믿지 못한다는 신호다. 둘은 audit/event reason class를 분리한다.

## Operation Execution Runtime

Claude Code BashTool 실행 본문을 보면, operation runtime은 permission gate 뒤에 붙는 단순 executor가 아니다. progress, backgrounding, output persistence, sandbox profile, cwd/session state, semantic result interpretation을 함께 가진다.

Agentica Next 초안:

```ts
interface AgenticaOperationRunState {
  id: string;
  operationKey: string;
  status:
    | "pending"
    | "running"
    | "backgrounded"
    | "completed"
    | "failed"
    | "stopped"
    | "interrupted";
  startedAt: number;
  endedAt?: number;
  progress?: AgenticaOperationProgress;
  output?: AgenticaOutputReference;
  semantic?: AgenticaOperationSemanticResult;
  sandbox?: AgenticaSandboxRunState;
  ownerAgentId?: string;
  notified?: boolean;
}

interface AgenticaOperationProgress {
  elapsedMs: number;
  preview?: string;
  totalBytes?: number;
  totalLines?: number;
  incomplete?: boolean;
}

interface AgenticaOutputReference {
  id: string;
  kind: "inline" | "file" | "object-store" | "adapter";
  uri?: string;
  bytes?: number;
  digest?: string;
  preview?: string;
  eviction: "turn" | "session" | "manual" | "durable";
}

interface AgenticaSandboxPolicy {
  required: boolean;
  autoAllowIfSandboxed?: boolean;
  allowUnsandboxedOverride?: boolean;
  filesystem?: {
    allowRead?: string[];
    denyRead?: string[];
    allowWrite?: string[];
    denyWrite?: string[];
  };
  network?: {
    allowedDomains?: string[];
    deniedDomains?: string[];
    allowLocalBinding?: boolean;
  };
}
```

전이 원칙:

- progress threshold 이전에 끝난 operation은 progress event를 만들지 않는다.
- 장기 실행 operation은 foreground run state로 등록한 뒤 background 전환 가능성을 열어둔다.
- timeout은 항상 kill이 아니다. policy에 따라 background 전환, graceful stop, hard kill이 다를 수 있다.
- user interrupt는 hard kill과 다르다. partial output projection이나 background 전환이 가능해야 한다.
- task completion notification은 public assistant message가 아니라 runtime notification queue에 먼저 들어간다.
- output은 append log/reference가 원본이고, execute history에는 projection만 들어간다.
- sandbox decision은 permission decision과 별도다. sandbox auto-allow를 쓰더라도 explicit deny/ask/safety check를 낮추지 않는다.
- cwd, temp dir, output file path, sandbox violation store, approval token은 runtime-only state다.

1차 구현에서는 shell capability가 없더라도 이 shape를 HTTP/MCP/class operation result budget에 먼저 적용할 수 있다. 예를 들어 큰 HTTP 응답은 `AgenticaOutputReference`로 보존하고, model에는 preview와 schema-aware summary만 투영한다.

## Sandbox/Policy Profile

Claude Code sandbox adapter는 permission rule을 OS/runtime sandbox config로도 변환한다. Agentica도 connector/operation policy를 실행 환경으로 내려보낼 수 있어야 한다.

초기 적용 대상:

- external HTTP connector: allowed/denied domains, redirect policy, credential domain
- local file/tool connector: allow/deny path, temp directory, symlink/realpath containment
- MCP connector: workspace trust, helper script execution, auth token storage, dynamic server mutation
- shell capability를 도입할 경우: platform support, dependency check, excluded command, required sandbox fail-closed

중요한 불변식:

- sandbox unavailable인데 `required`면 실행을 거부한다.
- sandbox excluded command는 convenience setting일 뿐 security boundary가 아니다.
- settings/credential/capability directory는 default deny write에 가깝게 취급한다.
- worktree/bare-repo 같은 VCS 특수 path는 일반 allowWrite로 퉁치지 말고 별도 fixture로 검증한다.

## Result Projection

현재 execute history는 return value를 비교적 직접 JSON으로 담는다. 큰 결과나 민감한 결과가 많아지면 문제가 된다.

projection mode:

- `inline`: 작은 JSON/string
- `summary`: LLM용 요약
- `reference`: local handle/path/id, 필요 시 재조회

local RAG는 result projection을 indexing source로 쓸 수 있지만, resume JSON에는 원본 대형 payload를 계속 넣지 않는 방향이 좋다.

## User Interaction과 Plan Mode

Claude Code의 `AskUserQuestion`과 `Enter/ExitPlanMode`에서 확인한 추가 원칙:

- user interaction이 필요한 operation은 `requiresUserInteraction`을 명시한다.
- 질문/승인 UI를 렌더링할 수 없는 remote channel에서는 해당 operation을 비활성화한다.
- plan mode는 prompt가 아니라 permission mode다.
- plan mode에서 write/destructive operation은 selector 이후 call 직전 gate에서도 막는다.
- plan exit은 승인된 plan artifact와 permission mode restore를 포함하는 transition이다.

Agentica 초안:

```ts
type AgenticaRuntimeMode = "default" | "plan" | "acceptEdits" | "dontAsk" | "auto";

interface AgenticaPendingInteraction {
  id: string;
  kind: "question" | "approval" | "plan_approval";
  createdAt: number;
  operationKey?: string;
  renderableClientRequired: boolean;
}
```

## Connector Policy

Web/MCP/RemoteTrigger/Schedule 도구군에서 확인한 operation policy 축:

- external network access
- authenticated/private resource access
- remote account/control-plane mutation
- domain allow/deny rule
- same-host redirect policy
- binary/blob result reference
- source attribution required
- session-only vs durable schedule
- owner/team visibility

초기 metadata 확장:

```ts
interface AgenticaOperationPolicyMetadata {
  externalNetwork?: boolean;
  authRequired?: boolean;
  domainRule?: string;
  remoteControlPlane?: boolean;
  binaryResult?: boolean;
  sourceAttributionRequired?: boolean;
  schedule?: "none" | "session-only" | "durable";
}
```

MCP auth pseudo-tool처럼 operation registry가 runtime 중 바뀌면 `connectorRegistryVersion`을 올리고 selector cache를 무효화한다.

Claude Code `services/mcp`에서 추가로 확인한 connector state:

- `needs-auth`: 재인증이 필요한 connected 이전 상태
- `pending`: connect/reconnect 진행 중
- `disabled`: config에는 있지만 registry projection에서 tools/resources를 제거한 상태
- `failed`: discovery/call 이전 connection 자체가 실패한 상태
- `sdk-control`: server process ownership이 SDK host에 있고 runtime은 control request만 중계하는 transport
- `in-process`: 같은 process 안의 linked transport pair로 client/server를 연결하는 transport

Agentica에서는 이 상태를 execute history에 바로 쓰지 않고 runtime state에 둔다. LLM에는 필요한 경우 auth pseudo-operation 또는 짧은 system marker만 투영한다.

추가로 MCP auth/UI 분석에서 분리해야 할 policy axis:

- workspace trust: project/local helper script와 project connector config 실행 전제
- connector approval: `.mcp.json` server를 사용할지에 대한 local user intent
- credential trust domain: access/refresh token, OAuth client secret, IdP id_token, IdP client secret은 분리 저장
- step-up auth: 부족한 scope를 execute failure가 아니라 pending auth state로 보존
- dynamic header helper: trusted workspace 이후에만 실행되는 optional credential producer
- auth pseudo-operation: selector 후보가 아니라 recovery action projection으로 제한
- SDK control request: JSON-RPC id와 outer control request id correlation을 분리
- dynamic MCP set mutation: added/removed/errors response와 connector handshake completion을 분리
- remote control channel: `interrupt`, `stop_task`, `set_permission_mode`, `set_model`, `apply_flag_settings`는 operation call이 아니라 runtime control transition이다.
- env patch control: `update_environment_variables`처럼 process-wide state를 바꾸는 메시지는 trusted transport에서만 허용한다.
- remote delivery: worker state, delivery ack, internal transcript event persistence는 user-visible history가 아니라 remote session state다.

즉 operation policy는 "이 tool call을 허용할지"만 보지 않는다. connector가 runtime에 나타나기 전의 source approval, credential availability, helper execution permission까지 별도 state로 추적한다.

## Capability Permission

Skill/Plugin 및 plugin marketplace 분석 결과, 절차형 capability의 permission은 operation permission과 별도 namespace가 필요하다.

예:

```ts
interface AgenticaCapabilityPolicyMetadata {
  key: string;
  source: "local" | "bundled" | "plugin" | "mcp";
  allowedOperations?: string[];
  execution: "inline" | "fork";
  trustedContent: boolean;
  shellExpansionAllowed: boolean;
  requiresConfirmation: boolean;
  artifactPolicy?: {
    remoteHosts?: string[];
    sameSourceRootOnly?: boolean;
    httpsOnly?: boolean;
    localRootContainment?: boolean;
  };
}
```

remote/MCP capability는 shell expansion과 local file interpolation을 기본 금지한다. local/plugin capability도 secret userConfig는 prompt에 직접 넣지 않고 runtime-only argument 또는 env로만 전달한다.

추가 policy:

- org policy가 force-disabled한 capability는 install/enable/load projection보다 먼저 차단한다.
- managed capability는 session/local override보다 우선한다.
- capability dependency auto-install은 같은 trusted source 안에서만 기본 허용한다.
- cross-source dependency는 root source allowlist가 있을 때만 자동 설치한다.
- MCPB/connector artifact URL은 plugin/marketplace source policy와 별도로 검사한다.
- remote artifact redirect는 최종 URL 기준으로도 allowlist를 다시 통과해야 한다.
- local artifact path는 path string 검사가 아니라 `realpath`가 pack root 아래인지로 판단한다.
- load-time dependency failure는 settings를 고치지 않고 session projection에서 demote한다.
- marketplace delisting은 load failure가 아니라 security/operations event로 취급한다.
- userConfig `sensitive` 값은 connector env/hook runtime substitution에는 쓸 수 있지만 procedure/skill prompt content에는 직접 치환하지 않는다.
- required config missing은 install failure가 아니라 `needs-config` capability state로 둔다.
- capability uninstall은 enablement/install entry 제거와 persistent data cleanup을 분리하고, data 삭제는 별도 confirmation/result로 다룬다.
- old materialized pack은 concurrent session safety를 위해 즉시 지우지 않고 orphan marker와 search/RAG exclusion을 적용한다.
- capability reload는 connector reconnect, LSP/semantic registry refresh, hook/observer swap을 포함하는 projection transaction이어야 한다.

## Artifact와 Task Runtime

Claude Code `FileWriteTool`, `NotebookEditTool`, `TodoWriteTool`, `TaskOutputTool` 및 `tasks`/`utils/task`에서 추가로 확인한 원칙은 다음이다.

- write 계열은 validation-time precondition과 call-time stale check를 둘 다 수행한다.
- domain artifact는 generic JSON/string edit가 아니라 구조화 parser로 수정한다.
- long-running task output은 inline history가 아니라 output file/reference로 관리한다.
- task completion, notification, output tail/truncation, eviction은 runtime transition이다.
- task stop/cancel은 failure가 아니라 별도 control transition이다.
- user-visible message와 LLM-facing result, audit 원본, resume state는 분리한다.
- task output은 append log로 쓰고 offset 기반 delta read를 한다.
- terminal 상태가 되었다고 즉시 eviction하지 않는다. notification 완료 여부를 확인해야 한다.
- owner agent/session이 종료되면 그 owner가 만든 background task cleanup 정책이 필요하다.

Agentica Next 내부 초안:

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
}

interface AgenticaTaskOutputRef {
  kind: "file" | "adapter" | "memory";
  uri: string;
  digest?: string;
}
```

이 구조는 `Agentica` 전용 runtime wrapper에서 먼저 쓴다. `MicroAgentica`가 공유하는 `call.ts`에는 넣지 않는다.

Task notification은 public `assistantMessage`가 아니라 runtime signal이다. 처음에는 다음 turn context projection에만 넣고, RPC/chat event는 별도 phase에서 연다.

## Team/Mailbox Runtime

TeamCreate/TeamDelete/SendMessage 및 `utils/swarm`에서 확인한 원칙:

- team은 shared task list, mailbox, cleanup boundary를 포함한다.
- leader는 teammate가 아니며 deterministic lead id만 가진다.
- teammate name은 사용자/모델 communication key이고 UUID는 내부 식별자다.
- active teammate가 남아 있으면 team cleanup을 거부한다.
- cross-machine bridge message는 auto allow/bypass와 무관한 explicit safety check가 필요하다.
- stopped child agent는 message로 resume될 수 있으므로 task state와 transcript reference가 연결되어야 한다.
- team registry는 memory map만으로 부족하다. local JSON/file adapter 같은 durable session artifact가 필요하다.
- mailbox message는 plain chat, permission request, sandbox request, plan approval, shutdown, task assignment, mode set처럼 typed control message를 포함한다.
- permission request는 승인/거절만이 아니라 updated input과 reusable permission update를 돌려줄 수 있어야 한다.
- in-process teammate는 parent turn abort와 독립된 lifecycle abort controller를 가져야 한다.
- pane/child-process backend를 후속 phase에서 붙이더라도 command line에는 initial prompt를 넣지 않는다. prompt와 control message는 mailbox/control adapter로 보낸다.
- child process env/flag 상속은 broad inherit가 아니라 explicit allowlist다. provider/config/proxy/cert처럼 필요한 값만 전달하고, plan-mode required 상태에서는 bypass permission 계열 mode 전파를 제한한다.
- external pane/session id는 runtime-only identifier다. public history/RPC event에는 노출하지 않는다.

Agentica에서는 team/mailbox도 `Agentica` runtime wrapper 전용으로 둔다.

초기 설계:

```ts
interface AgenticaTeamRuntimeState {
  id: string;
  leadAgentId: string;
  taskListId: string;
  members: Map<string, AgenticaTeamMemberRuntimeState>;
  registryRef?: AgenticaResultReference;
}

interface AgenticaTeamMemberRuntimeState {
  id: string;
  name: string;
  status: "starting" | "running" | "idle" | "stopping" | "stopped" | "failed";
  taskId?: string;
  backend: "in-process" | "local-child-process" | "external-pane" | "remote";
  permissionMode: AgenticaRuntimeMode;
}
```

Raw mailbox payload는 public history/RPC event로 바로 내보내지 않고 `AgenticaContextProjector`가 필요한 marker만 투영한다.

## 도입 순서

1. metadata inference만 추가하고 behavior는 바꾸지 않는다.
2. read/write/destructive sideEffect를 benchmark/test에서 관찰한다.
3. optional policy listener를 만든다.
4. call 직전 experimental policy gate를 둔다.
5. result projection을 describe phase에 먼저 적용한다.
6. async task/output reference는 internal runtime state로 먼저 실험한다.
7. public event/JSON 확장은 RPC/chat 영향 확인 후 진행한다.

## MicroAgentica 주의

MicroAgentica는 `call()`을 Agentica와 공유한다. 그러므로 policy gate를 `call.ts`에 직접 넣으면 MicroAgentica에도 영향이 간다.

초기 구현은 Agentica 전용 runtime wrapper에서 처리한다.
