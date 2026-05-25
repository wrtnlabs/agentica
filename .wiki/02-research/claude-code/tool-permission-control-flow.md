# Claude Code Tool Permission Control Flow 분석

## 범위

대상은 Claude Code snapshot의 tool permission 결정, prompt, hook, remote approval, worker approval 경로다.

- `/home/samchon/github/samchon/claude-code/src/hooks/useCanUseTool.tsx`
- `/home/samchon/github/samchon/claude-code/src/hooks/toolPermission/*`
- `/home/samchon/github/samchon/claude-code/src/utils/permissions/*`
- `/home/samchon/github/samchon/claude-code/src/services/tools/toolHooks.ts`
- `/home/samchon/github/samchon/claude-code/src/components/permissions/*`
- `/home/samchon/github/samchon/claude-code/src/Tool.ts`

이 문서는 Agentica source package를 변경하지 않고, 향후 `Agentica` runtime wrapper 설계에 반영할 지식을 정리한다. `MicroAgentica`는 적용 대상이 아니다.

## 핵심 결론

Claude Code의 permission은 "도구 실행 전에 확인창 하나 띄우기"가 아니다. 핵심은 call 직전 deterministic policy decision을 만든 뒤, ask 상태에서 여러 approval source를 race시키는 runtime subsystem이다.

구성 축:

- tool-local `checkPermissions`
- global rule engine
- permission mode transform
- PreToolUse/PermissionRequest/PostToolUse hook
- interactive CLI prompt
- bridge/remote/channel approval
- swarm worker mailbox approval
- auto-mode classifier
- settings/session permission update
- audit/logging/telemetry

Agentica에 가져올 가장 중요한 원칙은 permission gate를 selector나 prompt text에 맡기지 않고 operation call 직전의 필수 boundary로 두는 것이다.

## Permission Context

`ToolPermissionContext`는 `Tool.ts`에 있고 permission runtime의 입력 state다.

주요 필드:

- `mode`
- `additionalWorkingDirectories`
- `alwaysAllowRules`
- `alwaysDenyRules`
- `alwaysAskRules`
- `isBypassPermissionsModeAvailable`
- `isAutoModeAvailable`
- `strippedDangerousRules`
- `shouldAvoidPermissionPrompts`
- `awaitAutomatedChecksBeforeDialog`
- `prePlanMode`

중요한 점은 permission mode, rule, worker/headless 제약, plan 이전 mode가 모두 같은 context에 있다는 것이다. Claude Code는 plan/auto/dontAsk/bypass를 prompt 문구가 아니라 runtime policy mode로 다룬다.

Agentica 적용:

- `AgenticaRuntimeState` 안에 permission context를 둔다.
- history JSON에 permission 내부 state를 그대로 넣지 않는다.
- mode 전환은 runtime state observer가 operation selector, context projector, permission gate에 동시에 반영해야 한다.

## Call-time Decision Pipeline

`hasPermissionsToUseTool`은 `hasPermissionsToUseToolInner`가 만든 결과를 mode/headless/auto 규칙으로 후처리한다.

기본 순서:

1. tool-wide deny rule
2. tool-wide ask rule
3. tool-specific `checkPermissions`
4. tool implementation deny
5. `requiresUserInteraction` ask
6. content-specific ask rule
7. safety check ask
8. bypass mode allow
9. tool-wide allow rule
10. passthrough를 ask로 변환

불변식:

- deny rule은 항상 우선한다.
- explicit ask rule과 safety check는 bypass-immune이다.
- tool implementation deny는 hook allow보다 강하다.
- `passthrough`는 최종적으로 ask가 된다.
- parser/permission check exception은 abort류가 아니면 log하고 안전한 ask fallback으로 간다.

mode transform:

- `dontAsk`: ask를 deny로 바꾼다.
- `auto`: acceptEdits fast-path, safe-tool allowlist, auto classifier를 순서대로 시도한다.
- auto classifier denial이 누적 limit을 넘으면 interactive session에서는 prompt로 fallback하고, headless에서는 abort한다.
- `shouldAvoidPermissionPrompts`: PermissionRequest hook을 먼저 실행하고 결정이 없으면 auto-deny한다.
- PowerShell은 `POWERSHELL_AUTO_MODE`가 꺼져 있으면 auto classifier 대상이 아니라 explicit user approval 대상이다.

Agentica 적용:

- operation permission은 `allow | ask | deny | passthrough`를 구분해야 한다.
- `ask`를 UI 표시 여부와 혼동하지 않는다. headless 환경에서는 `ask -> hook chance -> deny`가 될 수 있다.
- mode transform은 tool-local policy 뒤, user prompt 직전에 수행한다.

## Hook Permission Semantics

`services/tools/toolHooks.ts`의 `resolveHookPermissionDecision`은 PreToolUse hook 결과를 최종 decision으로 바꾼다.

중요한 semantics:

- hook `allow`는 interactive prompt를 생략할 수 있다.
- 하지만 hook `allow`가 settings deny/ask rule과 safety check를 우회하지는 않는다.
- `checkRuleBasedPermissions`가 deny를 반환하면 hook allow보다 deny가 이긴다.
- `checkRuleBasedPermissions`가 ask를 반환하면 prompt를 강제로 띄운다.
- `requiresUserInteraction` tool은 hook이 `updatedInput`으로 interaction을 만족시킨 경우가 아니면 `canUseTool`을 다시 탄다.
- `requireCanUseTool`이 켜져 있으면 hook allow 후에도 `canUseTool`이 필요하다.
- hook `ask`는 `forceDecision`으로 interactive flow에 전달되어 hook message를 prompt에 반영한다.
- hook `deny`는 즉시 deny다.

PermissionRequest hook은 ask 상태에서 별도로 실행된다.

- interactive flow에서는 local prompt, bridge, channel, classifier와 race한다.
- headless/async agent에서는 prompt를 띄울 수 없으므로 PermissionRequest hook을 먼저 실행하고, 결정이 없으면 auto-deny한다.
- hook deny에 `interrupt`가 있으면 abort controller를 중단한다.

Agentica 적용:

- hook allow를 "무조건 실행 허용"으로 해석하면 안 된다.
- policy rule, safety check, user interaction required 여부를 hook 후에도 재검사해야 한다.
- headless operation runtime에는 approval hook fallback과 deterministic deny path가 필요하다.

## PermissionContext와 Single Winner

`hooks/toolPermission/PermissionContext.ts`는 permission flow의 공통 유틸이다.

책임:

- `buildAllow`, `buildDeny`
- decision logging
- permission update persistence
- app state permission context 갱신
- queue push/remove/update
- abort/cancel 메시지 생성
- hook allow/deny 처리
- classifier allow 처리
- user allow 처리
- `createResolveOnce`로 여러 approval source 중 첫 결정만 채택

`createResolveOnce`는 중요하다. local user, remote bridge, channel reply, PermissionRequest hook, classifier, abort가 동시에 끝날 수 있으므로 permission promise는 반드시 single winner여야 한다.

Agentica 적용:

- approval UI와 policy engine 사이에 `AgenticaPermissionContext` 같은 작은 orchestration object를 둔다.
- 여러 adapter가 같은 pending permission request를 resolve할 수 있으므로 idempotent single-resolution primitive가 필요하다.
- permission update persistence와 in-memory state 적용은 한 boundary에서 처리한다.

## Interactive Handler

`handlers/interactiveHandler.ts`는 ask decision을 user-facing prompt로 바꾸되, 실제로는 여러 racer를 동시에 등록한다.

racer:

- local CLI permission queue item
- app interrupt/abort
- recheck permission callback
- Claude Code bridge remote approval
- channel relay approval
- PermissionRequest hooks
- Bash classifier async approval

queue item에는 다음 callback이 들어간다.

- `onUserInteraction`
- `onAbort`
- `onAllow`
- `onReject`
- `recheckPermission`
- classifier indicator/checkmark update

remote bridge와 channel relay는 local prompt의 대체 UI다. 둘 중 하나가 먼저 답하면 local prompt를 queue에서 제거하고, 다른 remote request를 cancel한다.

`recheckPermission`은 UI가 떠 있는 동안 mode/rule이 바뀌어 fresh decision이 allow가 되면 prompt를 닫고 allow한다. 이 때문에 permission prompt는 static modal이 아니라 live state와 연결된 pending request다.

Agentica 적용:

- public SDK/RPC/chat UI가 생기더라도 core policy는 UI toolkit에 종속되면 안 된다.
- pending permission request는 local UI, SDK client, webhook/channel, admin control plane이 같은 request id로 resolve할 수 있어야 한다.
- request가 resolve되면 다른 channel에는 cancel/closed notification을 보내야 한다.

## Coordinator와 Swarm Worker

`coordinatorHandler.ts`는 `awaitAutomatedChecksBeforeDialog`가 켜진 coordinator worker에서 hook과 classifier를 먼저 기다린다. 자동 판단이 실패하면 local dialog로 fallback한다.

`swarmWorkerHandler.ts`는 swarm worker에서 permission prompt를 직접 띄우지 않는다.

흐름:

1. worker가 classifier auto-approval을 먼저 시도한다.
2. 필요하면 permission request를 만든다.
3. request callback을 먼저 등록한다.
4. mailbox로 leader에게 permission request를 보낸다.
5. abort listener가 request를 정리한다.
6. leader 응답 allow면 `handleUserAllow`, reject면 `cancelAndAbort`로 끝낸다.

Agentica 적용:

- sub-agent/worker permission은 parent/leader에게 delegate할 수 있어야 한다.
- delegate 전 callback registration이 먼저 되어야 race를 잃지 않는다.
- worker의 local state mutation은 root runtime state와 분리하거나 명시적으로 전달해야 한다.

## Permission UI Layer

`components/permissions/PermissionRequest.tsx`는 tool별 permission component를 선택한다.

예:

- FileEdit/FileWrite/FileRead/Grep/Glob
- Bash
- PowerShell
- WebFetch
- NotebookEdit
- Enter/ExitPlanMode
- AskUserQuestion
- Skill
- Workflow/Monitor feature gate
- fallback generic permission prompt

UI component의 본질은 permission decision을 새로 계산하는 것이 아니라, `PermissionUpdate[]`와 optional feedback/updatedInput을 만들어 `onAllow` 또는 `onReject`를 호출하는 것이다.

파일 permission prompt:

- `Yes`는 one-shot allow다.
- session allow는 path/operation type으로 rule suggestion을 만든다.
- `.claude/` 또는 global `~/.claude/` 편집은 별도 session rule option이 있다.
- reject/accept feedback input mode가 있다.

shell permission prompt:

- Bash/PowerShell은 "don't ask again for prefix" option을 제공한다.
- suggestion에 directory/Read rule 같은 non-shell item이 섞이면 editable prefix 대신 label suggestion으로 fallback한다.
- `allowManagedPermissionRulesOnly`가 켜져 있으면 always-allow option을 숨긴다.
- Bash에는 classifier-reviewed allow option이 있지만 PowerShell에는 없다.

fallback permission prompt:

- one-shot allow
- localSettings에 tool-wide allow rule 추가
- reject

Agentica 적용:

- UI는 `PermissionUpdate[]`를 생성하는 adapter로 둔다.
- "이번 한 번 허용", "세션 동안 허용", "영구 허용", "특정 argument pattern 허용"을 같은 decision model에서 표현한다.
- 관리 정책이 개인 allow option을 숨길 수 있어야 한다.

## Permission Update와 Settings

`PermissionUpdateSchema.ts`의 update type:

- `addRules`
- `replaceRules`
- `removeRules`
- `setMode`
- `addDirectories`
- `removeDirectories`

destination:

- `userSettings`
- `projectSettings`
- `localSettings`
- `session`
- `cliArg`

`PermissionUpdate.ts`는 update를 `ToolPermissionContext`에 적용하고, persistable destination만 settings에 저장한다. persistable source는 user/project/local settings다. `session`과 `cliArg`는 memory only다.

`permissionsLoader.ts`의 `allowManagedPermissionRulesOnly`가 켜지면 policy settings만 permission rule source로 인정하고, prompt의 always allow option도 숨긴다.

`shadowedRuleDetection.ts`는 allow rule이 tool-wide ask/deny rule에 가려져 도달 불가능한 경우를 감지한다.

Agentica 적용:

- permission update는 "설정 파일을 직접 수정"이 아니라 typed update command여야 한다.
- source hierarchy와 persistence 가능 여부를 구분한다.
- managed/policy source는 user/session source보다 우선해야 한다.
- rule shadowing diagnostic을 제공해야 운영자가 왜 allow가 먹지 않는지 알 수 있다.

## Logging과 Audit

`permissionLogging.ts`는 permission decision logging의 단일 entrypoint다.

기록 source:

- config
- user
- hook
- classifier
- user_abort
- user_reject

fan-out:

- analytics event
- OpenTelemetry event
- code-edit tool counter
- `toolUseContext.toolDecisions` map

Agentica 적용:

- permission decision은 execute failure와 별도 audit event로 남긴다.
- source, permanence, feedback 여부, wait time을 기록한다.
- public history에는 민감한 raw prompt/input을 그대로 넣지 않고, runtime audit store와 projection을 분리한다.

## Agentica 적용 설계 메모

초기 internal contract 초안:

```ts
type AgenticaPermissionBehavior = "allow" | "ask" | "deny" | "passthrough";

interface AgenticaPermissionDecision {
  behavior: AgenticaPermissionBehavior;
  reason?: AgenticaPermissionReason;
  updatedArguments?: unknown;
  suggestions?: AgenticaPermissionUpdate[];
  message?: string;
}

interface AgenticaPermissionContext {
  mode: "default" | "plan" | "acceptEdits" | "dontAsk" | "auto" | "bypassPermissions";
  rules: AgenticaPermissionRulesBySource;
  shouldAvoidPermissionPrompts?: boolean;
  awaitAutomatedChecksBeforeDialog?: boolean;
  pendingRequests: Map<string, AgenticaPendingPermissionRequest>;
}
```

초기 구현 방향:

- operation metadata와 controller policy가 tool-local `checkPermissions` 역할을 맡는다.
- global rule/mode transform은 call 직전 공통 gate에 둔다.
- hook/remote/UI/worker approval은 `ask` decision 이후 adapter에서 race한다.
- approval adapter는 `AgenticaPermissionUpdate[]`만 반환하고 직접 설정 파일을 만지지 않는다.
- source hierarchy는 `policy > project > user > local > cliArg > session`처럼 명시한다.
- headless/worker context는 prompt 대신 hook/delegate/deny fallback을 쓴다.
- `MicroAgentica`는 이 runtime permission subsystem을 붙이지 않는다.

## 다른 문서와 연결

- shell family별 parser/provider/policy는 [PowerShell/REPL/Platform Tools 분석](./powershell-repl-platform-tools.md)을 본다.
- Bash-specific command policy는 [BashTool/Policy 분석](./bash-tool-policy.md)을 본다.
- Agentica 적용 설계는 [Operation Policy/State 설계](../../03-design/agentica-next/operation-policy-state-design.md)에 반영한다.
