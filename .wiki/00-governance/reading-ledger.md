# 전수정독 진행판

## 상태 표기

- `완료`: 파일을 읽고 핵심 구조를 위키에 반영했다.
- `부분`: 일부 핵심 파일만 읽었다.
- `대기`: 아직 구조 확인 이상의 독해를 하지 않았다.

## Agentica 저장소

| 영역 | 상태 | 근거/메모 |
| --- | --- | --- |
| 루트 `README.md`, `package.json`, `pnpm-workspace.yaml` | 완료 | 프로젝트 정체성, workspace, scripts를 `01-project`에 반영 |
| `packages/core` facade와 orchestration | 완료 | `Agentica.ts`, `MicroAgentica.ts`, `orchestrate/*`, `context/*`, `factory/histories.ts`, `transformHistory.ts`, `utils/request.ts`를 읽고 `04-agentica/core-map.md`, `04-agentica/orchestration-current.md`에 반영 |
| `packages/core` functional/controller 변환 | 완료 | HTTP/MCP assert/validate, MCP tool schema conversion, controller contract를 `04-agentica/core-functional-and-controllers.md`에 반영 |
| `packages/core` events/histories/json | 완료 | event/history/JSON union, factory, transformHistory resume 계약을 `04-agentica/events-history-json-contract.md`에 반영 |
| `packages/core` utils | 완료 | request wrapper, streaming merge, token usage, AsyncQueue/MPSC, retry helpers를 `04-agentica/core-utils-request-streaming.md`에 반영 |
| `packages/vector-selector` | 완료 | boot/extract/select/sqlite/postgres 전략과 한계를 `04-agentica/vector-selector-current.md`에 반영 |
| `packages/benchmark` | 완료 | select/call/micro benchmark, predicator, reporters, structures를 읽고 `04-agentica/benchmark-test-current.md`에 반영 |
| `packages/rpc` | 완료 | `AgenticaRpcService`, `IAgenticaRpcService`, `IAgenticaRpcListener`, streaming 구조 파일을 읽고 public surface를 `04-agentica/rpc-chat-public-surface.md`에 반영 |
| `packages/chat` | 완료 | `AgenticaChatApplication`, `AgenticaChatMovie`, message/sides renderer, MarkdownViewer, BBS/Shopping/Uploader examples, vite/rollup metadata를 읽고 `04-agentica/chat-renderer-current.md`, `04-agentica/rpc-chat-public-surface.md`, `04-agentica/impact-surfaces.md`에 반영 |
| `packages/cli` | 완료 | package/bin/index, start command, template setup functions, connectors/packages/fs/utils, vitest/msw/build/test files를 읽고 `04-agentica/cli-scaffold-current.md`에 반영 |
| `packages/create-agentica` | 완료 | package alias가 `agentica` CLI `run()`을 호출하는 구조를 `04-agentica/cli-scaffold-current.md`에 반영 |
| `test` | 완료 | DynamicExecutor runner, TestGlobal, base/streaming/validate/RPC/benchmark 주요 feature tests를 `04-agentica/benchmark-test-current.md`에 반영. `test/src/cli`, `test/src/examples`, `test/src/internal`, `ConsoleScanner`는 `04-agentica/test-cli-examples-current.md`에 반영 |
| `benchmark/vector-selector-benchmark` | 완료 | plain/pg/sqlite vector selector comparison과 shopping scenario를 `04-agentica/benchmark-test-current.md`에 반영 |
| `website` | 완료 | Next/Nextra build, route/meta, TypeDoc/playground prebuild, setup/core/event/history/websocket/plugin docs, public articles redirect를 `04-agentica/website-docs-current.md`에 반영 |
| `articles`, `docs` | 완료 | root articles positioning, `docs/AgenticaFN.png` 자료 범위, function-calling-first narrative와 문서 영향도를 `04-agentica/website-docs-current.md`에 반영 |

## Claude Code Snapshot

| 영역 | 상태 | 근거/메모 |
| --- | --- | --- |
| README와 top-level architecture | 완료 | snapshot 성격과 디렉터리 구조 반영 |
| `src/query.ts`, `src/query/*` | 완료 | query loop, deps/config/tokenBudget/stopHooks, context prep, streaming/model fallback, recovery, tool execution, attachment drain, stop-hook/team-hook, token budget continuation을 `02-research/claude-code/query-loop.md`에 반영. type import 대상 `query/transitions` source는 snapshot에서 확인되지 않아 `query.ts` literal 기준으로 정리 |
| `src/Tool.ts`, `src/services/tools/*` | 완료 | Tool contract, orchestration, streaming executor, tool execution classifier/permission hook path를 `02-research/claude-code/tool-system.md`, `query-loop.md`, `bash-tool-policy.md`, `tool-permission-control-flow.md`에 반영 |
| `src/services/compact/*` | 완료 | `compact.ts`, `autoCompact.ts`, `microCompact.ts`, `apiMicrocompact.ts`, `sessionMemoryCompact.ts`, `prompt.ts`, `grouping.ts`, cleanup/warning/config 파일을 읽고 `02-research/claude-code/compact-system.md`에 반영 |
| `src/tools/ToolSearchTool`, `src/utils/toolSearch.ts` | 완료 | ToolSearch prompt/search/direct select/keyword scoring, `isDeferredTool`, mode/env/provider/model gate, auto threshold, API `defer_loading` projection, `tool_reference` discovered-state scan, compact boundary carry, delta attachment, normalization/strip fallback을 `02-research/claude-code/context-rag-memory.md`와 `03-design/agentica-next/local-rag-selector.md`에 반영 |
| `src/memdir/*`, `src/services/SessionMemory/*`, `src/skills/*` | 완료 | memory scan/selection/frontmatter, session memory extraction, `loadSkillsDir.ts`, bundled/builtin skill registry, `mcpSkillBuilders.ts`를 `02-research/claude-code/skill-plugin-loading.md`에 반영. feature-gated `services/skillSearch/*`, `skills/mcpSkills.ts` 구현은 snapshot에 없어 seam만 기록 |
| `src/tools/AgentTool/*` | 완료 | AgentTool, runAgent, forkSubagent, agentMemory, loadAgentsDir, agentToolUtils 분석을 `02-research/claude-code/agent-tool.md`에 반영 |
| `src/tools/BashTool/*` | 완료 | BashTool schema, bashPermissions, bashSecurity legacy parser trust gate, readOnlyValidation, destructive warning, command semantics, 실행 pipeline, Shell/ShellCommand/TaskOutput/LocalShellTask/sandbox adapter, classifier/wrapper stripping 세부를 `02-research/claude-code/bash-tool-policy.md`에 반영. shell provider/PowerShell 비교는 `02-research/claude-code/powershell-repl-platform-tools.md`에 반영 |
| `src/hooks/toolPermission`, `src/components/permissions`, `src/utils/permissions`, `src/services/tools/toolHooks.ts` | 완료 | `useCanUseTool`, PermissionContext, interactive/coordinator/swarm handler, PermissionRequest UI, PermissionUpdate/settings/rule engine, PreToolUse/PermissionRequest hook semantics를 `02-research/claude-code/tool-permission-control-flow.md`에 반영 |
| `src/tools/FileReadTool`, `GrepTool`, `FileEditTool` | 완료 | read/search/edit permission, readFileState, limits, result projection을 `02-research/claude-code/file-search-edit-tools.md`와 `03-design/agentica-next/operation-policy-state-design.md`에 반영 |
| `src/tools/*` 기타 개별 도구 | 완료 | FileWrite/Glob/Notebook/TodoWrite/TaskCreate/TaskUpdate/TaskGet/TaskList/TaskOutput을 `02-research/claude-code/write-glob-notebook-task-tools.md`에 반영. LSP/TaskStop은 `02-research/claude-code/lsp-task-control-tools.md`에 반영. AskUserQuestion/Plan/Config/Worktree/Skill/Brief/SyntheticOutput은 `02-research/claude-code/session-control-tools.md`에 반영. Web/MCP/RemoteTrigger/Schedule은 `02-research/claude-code/external-connector-tools.md`에 반영. TeamCreate/TeamDelete/SendMessage는 `02-research/claude-code/team-communication-tools.md`에 반영. 독립 `LS` tool은 없고 BashTool path validation에 포함됨. PowerShellTool/REPL primitive/platform-specific shell gate는 `02-research/claude-code/powershell-repl-platform-tools.md`에 반영 |
| `src/commands/*` | 완료 | command merge, skill/plugin/workflow/MCP command source, availability/isEnabled/remote-safe/bridge-safe filter, SkillTool-visible command filter를 `02-research/claude-code/skill-plugin-loading.md`와 `02-research/claude-code/slash-command-catalog.md`에 반영. `compact`, `context`, `memory`는 `slash-command-runtime.md`에 깊게 정리. `clear`, `resume`, `branch`, `copy`, `export`, `model`, `fast`, `effort`, `permissions`, `hooks`, `plan`, `sandbox`, `login/logout`, `bridge`, `install-github-app`, prompt workflow command에 더해 `btw`, `agents`, `skills`, `tasks`, `mcp`, `terminal-setup`, native install, `voice`, `chrome`, `desktop`, `web-setup`, `keybindings`, settings-tab proxy, support/diagnostic command를 catalog화. snapshot에 구현이 보이지 않는 feature-gated command는 registry 흔적으로만 기록 |
| `src/bridge`, `src/remote`, `src/server`, `src/cli/transports`, `src/cli/remoteIO.ts`, `src/cli/structuredIO.ts`, `src/entrypoints/sdk/*` | 완료 | RemoteSessionManager, SessionsWebSocket, sdkMessageAdapter, direct-connect server, bridge API/messaging/transport, REPL bridge poll loop, standalone/headless bridge loop, session runner, code session API, CLI transports, SDK control/core schema, StructuredIO/RemoteIO, bridge QR/status renderer, env-less `remoteBridgeCore`, token refresh scheduler, pollConfig dynamic config를 `02-research/claude-code/remote-bridge-server-runtime.md`에 반영 |
| `src/plugins`, `src/skills`, `src/utils/plugins`, `src/services/plugins`, `src/commands/plugin`, `src/commands/reload-plugins`, `hooks/useManagePlugins`, `cli/handlers/plugins`, `utils/plugins/performStartupChecks`, `utils/plugins/headlessPluginInstall` | 완료 | builtin plugin, plugin command/skill loader, manifest schema, plugin MCP integration을 `02-research/claude-code/skill-plugin-loading.md`에 반영. marketplace intent/state, install/update/autoupdate, dependency, options/secrets, policy/delisting은 `02-research/claude-code/plugin-marketplace-runtime.md`에 반영. `/plugin` UI command, validation, MCPB/DXT, zip cache, orphan search exclusion, refresh boundary, `/reload-plugins`, startup/headless warmup, CLI validate는 `02-research/claude-code/plugin-ui-validation-cache.md`에 반영. MCPB source trust는 marketplace policy와 artifact URL/path validation의 결합 한계까지 반영. 전체 snapshot 검색 결과 plugin validate 전용 fixture/test bundle은 확인되지 않아 Agentica 자체 fixture pack이 필요함 |
| `src/services/mcp`, `src/commands/mcp`, `src/components/mcp`, `src/services/mcpServerApproval.tsx` | 완료 | client/config/types/useManage/channel permission 중심 transport, config cascade, hot-swap, result projection에 더해 `auth.ts`, OAuth/XAA/secure storage, needs-auth cache, `/mcp` UI/CLI, project `.mcp.json` approval, headersHelper trust, official registry prefetch, `SdkControlTransport`, `InProcessTransport`, `vscodeSdkMcp`, SDK MCP control schema/print-mode routing, MCP skills/cache invalidation seam을 `02-research/claude-code/mcp-service-runtime.md`에 반영. SDK 전체 control/transport는 `remote-bridge-server-runtime.md`에 연결 |
| `src/tasks`, `src/utils/task`, `src/coordinator` | 완료 | Task contract, disk output, polling/notification, LocalShell/LocalAgent/RemoteAgent/MainSession/InProcessTeammate/DreamTask, stopTask, coordinator prompt, monitor/workflow progress seams를 `02-research/claude-code/task-coordinator-runtime.md`에 반영. feature-gated `LocalWorkflowTask`/`MonitorMcpTask` 독립 구현은 snapshot에 보이지 않아 흔적만 기록 |
| `src/state` | 완료 | `AppStateStore`, `store`, `AppStateProvider`, selectors, onChange diff hook, teammate view helpers를 읽고 `02-research/claude-code/state-swarm-runtime.md`에 반영 |
| `src/utils/swarm`, `src/utils/teammateContext.ts`, `src/utils/agentContext.ts`, `src/utils/teammateMailbox.ts` | 완료 | team file registry, mailbox, permission sync, backend registry, tmux/iTerm2 pane backend, pane executor, in-process backend/runner, TeamsDialog, AsyncLocalStorage context를 `02-research/claude-code/state-swarm-runtime.md`에 반영. public-surface 연결은 `runtime-public-surface-design.md`와 remote/task 문서에 반영 |
| `src/components`, `src/ink`, `src/screens/REPL.tsx` | 완료 | custom Ink renderer, terminal input/event, alt-screen/ScrollBox, Screen/Output buffer, render-node-to-output, selection/search overlay, Messages/MessageRow/PromptInput/REPL composition을 `02-research/claude-code/ui-adapter-ink-runtime.md`에 반영. heavy UI wizard 전체는 core 적용 범위 밖으로 분리 |

## 다음 독해 우선순위

1. 구현 전에는 `00-governance/total-review.md`, `03-design/agentica-next/roadmap.md`, `03-design/agentica-next/architecture-blueprint.md`, `03-design/agentica-next/verification-strategy.md` 순서로 먼저 읽는다.
2. 완료 선언 전 감사 명령 실행: `rg "\| .* \| 부분 \||\| .* \| 대기 \||추가 독해 필요|현재 미완료 사유" .wiki | rg -v "00-governance/(completion-criteria|reading-ledger)"`

## 외부 Reference

| 영역 | 상태 | 근거/메모 |
| --- | --- | --- |
| OpenAI/Anthropic/MCP/SQLite/React/Unicode/JSON Schema 공식 문서 | 완료 | tool calling, structured outputs, context caching/editing/compaction, MCP primitives/tasks/tools/security, local FTS, render key/deferred UI, grapheme segmentation을 `02-research/external-references.md`에 반영 |

## 총괄 대조

| 영역 | 상태 | 근거/메모 |
| --- | --- | --- |
| Claude Code source, Agentica source, `.wiki` 설계 세 축 리뷰 | 완료 | 핵심 설계 일치점, 보정점, 구현 우선순위, 남은 위험을 `00-governance/total-review.md`에 정리 |
