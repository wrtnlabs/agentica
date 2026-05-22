# Claude Code 소스 인벤토리

## 대상

대상 경로는 `/home/samchon/github/samchon/claude-code/src`다.

README 기준 약 1,900 파일, 512,000+ lines 규모의 TypeScript snapshot이다. 현재 확인된 `src` 하위 직접 도메인은 다음과 같다.

## 주요 디렉터리와 Agentica 관련도

| 디렉터리 | 관련도 | Agentica 적용 관점 |
| --- | --- | --- |
| `query` + `query.ts` | 매우 높음 | stateful agent loop, recovery, compaction, deps injection |
| `Tool.ts`, `tools`, `services/tools` | 매우 높음 | tool/operation runtime metadata, permission, concurrency, result budget |
| `services/compact` | 매우 높음 | micro/full/reactive/session compact 설계 |
| `tools/ToolSearchTool`, `utils/toolSearch.ts` | 매우 높음 | DB 없는 deferred tool search와 schema loading |
| `memdir`, `services/SessionMemory`, `services/extractMemories` | 높음 | file/frontmatter 기반 local recall |
| `skills` | 높음 | frontmatter-first discoverability와 lazy content loading |
| `tools/AgentTool`, `coordinator`, `tasks`, `utils/task` | 높음 | sub-agent, task continuation, disk-backed async output, coordinator/worker orchestration |
| `hooks/toolPermission`, `components/permissions`, `utils/permissions` | 높음 | call-time permission gate, hook/remote/channel/worker approval flow, typed permission update, permission mode transform 참고 |
| `services/mcp`, `tools/MCPTool` | 높음 | MCP transport/config/auth/discovery/result projection/hot-swap registry 참고 |
| `plugins`, `utils/plugins`, `services/plugins`, `commands/plugin`, `skills`, `tools/SkillTool` | 높음 | capability pack, frontmatter-first discovery, lazy prompt loading, plugin MCP scope, marketplace intent/state/materialization, install/update policy, `/plugin` control plane, validation, MCPB, zip/orphan cache 참고 |
| `tools/PowerShellTool`, `utils/powershell`, `utils/shell`, `tools/REPLTool` | 높음 | shell family별 parser/provider/policy, platform gate, REPL primitive hiding 참고 |
| `bridge`, `remote`, `server` | 높음 | remote session, direct connect, bridge transport, permission/control protocol, reconnect/heartbeat/resume, RPC 공개 표면 설계 참고 |
| `state`, `utils/swarm`, `utils/teammateMailbox.ts`, `utils/teammateContext.ts`, `utils/agentContext.ts` | 매우 높음 | runtime state store, diff observer, team registry, mailbox, permission sync, in-process teammate executor, AsyncLocalStorage isolation 참고 |
| `commands` | 높음 | slash command UX, prompt/local/local-jsx command contract, manual compact transaction, context diagnostics, memory control plane 참고 |
| `components`, `ink`, `screens` | 중간 | core 이식 대상은 아니지만 render projection, prompt input state, transcript/virtual scroll, compact boundary display 정책 참고 |

## 파일 수 밀집 영역 관찰

간이 집계상 `utils`, `components`, `hooks`, `plugins`, `ink`, `permissions`, `mcp`, `messages`, `bridge`, `api`, `tasks`, `BashTool`, `AgentTool`, `compact` 등이 크다. Agentica 강화에 직접 필요한 것은 모든 UI보다 runtime/tool/context 계층이다.

## 현재까지 추출한 핵심 원칙

- query loop는 상태 전이로 모델링한다.
- query loop는 context prep, model streaming, streaming tool execution, attachment drain, stop hook, token-budget continuation을 한 generator state machine으로 묶는다. public history 확정 전 pending/tombstone/discard 상태가 필요하다.
- tool schema와 runtime policy는 같은 tool contract에 있어야 한다.
- 모든 tool result는 context budget의 대상이다.
- deferred search는 vector DB 없이도 충분히 강한 1차 전략이 될 수 있다.
- ToolSearch는 lexical search tool이 아니라 deferred schema loading runtime이다. optimistic gate, definitive gate, `defer_loading` schema projection, `tool_reference` discovered-state scan, compact boundary carry가 하나의 시스템으로 묶인다.
- ToolSearch 검색은 exact/direct `select:`, MCP prefix, required `+term`, name part/searchHint/description scoring만으로도 DB 없는 operation discovery를 구성한다.
- Deferred tool state는 current turn selection이 아니라 transcript/compact metadata에서 재구성되는 state다. Agentica selector도 selected operation set을 retry/compact/resume 가능한 internal state로 보존해야 한다.
- compact 후에는 summary뿐 아니라 operational state를 복원해야 한다.
- write/task 계열은 LLM-visible result, UI, audit 원본, runtime state, output reference를 분리한다.
- LSP는 optional semantic retrieval/diagnostic channel이며, result와 diagnostics 모두 projection/dedup/cap을 거쳐야 한다.
- plan/config/skill/user-question은 prompt-only 기능이 아니라 runtime mode, permission, AppState, compaction preservation과 연결된다.
- Web/MCP/Remote/Schedule connector는 domain/auth/binary/source/schedule/remote-control-plane metadata가 필요하다.
- team/swarm은 shared task list, mailbox, cleanup boundary를 포함하는 runtime subsystem이다.
- MCP service는 connection lifecycle, auth/session state, capability discovery, result projection, registry hot-swap을 하나의 connector runtime으로 묶는다.
- MCP SDK/in-process transport는 normal connector와 같은 registry projection을 쓰되 transport ownership과 control request correlation이 다르다.
- Skill/Plugin은 operation schema가 아니라 capability pack이다. frontmatter metadata는 상시 색인하고 본문/파일은 호출 시 lazy load해야 한다.
- MCP skill discovery는 공개 snapshot에 구현 파일이 없고 dynamic import seam만 남아 있다. prompts/resources/tools change notification의 cache invalidation 범위를 분리하는 원칙만 Agentica에 반영한다.
- Plugin marketplace runtime은 settings intent, materialized cache state, runtime projection을 분리한다. install은 settings-first이고 update는 non-inplace disk update 후 reload/restart boundary로 적용한다.
- Plugin dependency는 module import가 아니라 capability presence guarantee다. cross-marketplace auto-install은 기본 금지하고 root marketplace allowlist만 적용한다.
- Plugin control plane은 Discover/Installed/Marketplaces/Errors/Validate를 분리하고 failed/flagged/needs-config 상태를 recovery 가능한 item으로 노출한다.
- Plugin validation은 runtime loader보다 strict하게 작동하며 manifest뿐 아니라 component frontmatter와 hooks schema까지 검사한다.
- MCPB/zip/orphan cache는 materialization backend와 running session extraction/search exclusion을 분리한다.
- MCPB URL/path trust는 marketplace source trust와 완전히 같은 문제가 아니다. Agentica는 artifact source allowlist와 root containment를 별도 정책으로 둬야 한다.
- Plugin validate 전용 fixture/test bundle은 Claude Code snapshot 전체 검색 결과 확인되지 않았다. Agentica는 자체 validator fixture pack으로 보완해야 한다.
- `/reload-plugins`는 interactive text command와 SDK structured control response를 분리하며, active projection swap은 `refreshActivePlugins` 하나로 수렴한다.
- Startup plugin reconcile은 workspace trust 이후에만 실행하고, orphan cleanup 뒤 search exclusion cache를 warm한다.
- MCP auth는 OAuth/PKCE, XAA, token refresh, step-up scope, needs-auth cache, auth pseudo-tool, `/mcp` recovery UI를 묶은 connector control plane이다.
- Project `.mcp.json` connector는 workspace trust, connector approval, tool-call permission이 분리된다.
- Task runtime은 long-running work를 AppState, disk output, notification queue, SDK event로 분리한다. output은 inline history가 아니라 reference/delta/tail로 다루고, terminal transition과 notification/eviction은 별도 단계로 관리한다.
- Task monitor/workflow 흔적은 task status/progress projection으로 낮춰져 있다. monitor는 script exit를 success condition으로 보지 않고 stream end/failure/stop으로 해석한다.
- Coordinator mode는 prompt text가 아니라 worker capability projection, self-contained worker prompt, concurrency policy, verification discipline을 포함하는 runtime mode다.
- Remote/Bridge runtime은 SDK event, history, UI message, permission/control request, transport heartbeat, reconnect, archive/stop lifecycle을 adapter 계층에서 분리한다. remote event를 core history/event에 1:1로 노출하면 안 된다.
- Env-less remote bridge는 session create, `/bridge` credential exchange, worker epoch, token refresh, SSE reconnect, flush gate, archive teardown을 분리한다. JWT refresh는 worker epoch bump와 함께 transport rebuild를 요구한다.
- Bridge poll config는 dynamic config를 schema-validate하고 invalid partial config는 전체 default로 fallback한다. at-capacity liveness는 heartbeat 또는 poll interval 중 하나가 필요하다.
- CLI transport는 WebSocket, hybrid WS+POST, CCR v2 SSE+POST를 runtime flag로 선택한다. read/write/state/delivery/internal transcript persistence는 서로 다른 reliability class이므로 Agentica remote adapter도 이를 분리해야 한다.
- AppState는 UI state가 아니라 task/team/permission/remote/plugin/connector를 묶는 runtime state hub다. state diff observer가 permission mode, settings, external metadata sync를 담당한다.
- Swarm은 prompt 전략이 아니라 team registry, mailbox, permission sync, backend executor, idle/shutdown loop, cleanup boundary를 포함하는 runtime subsystem이다.
- In-process teammate는 AsyncLocalStorage로 identity를 격리하고 일반 agent loop를 재사용한다. child-local history/compaction/idle loop는 parent session과 분리해야 한다.
- tmux/iTerm2 pane backend는 core algorithm보다 adapter boundary의 참고 자료다. Agentica core에는 직접 이식하지 않고 backend snapshot, spawn transaction, mailbox-based initial prompt, explicit env/flag inheritance, cleanup transition 원칙만 반영한다.
- PowerShell은 BashTool option이 아니라 독립 tool/provider/parser/policy 계층이다. shell family별 parser, permission namespace, path semantics, sandbox capability, result semantics를 분리해야 한다.
- REPL mode는 direct model tool list에서 primitive tools를 숨기되 hidden primitive registry를 renderer/collapse/audit에 남긴다. Agentica scripting wrapper도 direct operation list와 internal primitive list를 분리해야 한다.
- Tool permission은 tool-local policy, global rule, permission mode, hook, interactive UI, remote/channel approval, worker mailbox, classifier를 분리한 runtime subsystem이다. Hook allow도 deny/ask rule과 safety check를 우회하지 않으며, ask decision은 local/remote/worker/classifier 중 single-winner로 resolve되어야 한다.
- Permission update는 settings 파일 직접 변경이 아니라 typed update command다. destination별 persistence 가능 여부, managed policy 우선순위, shadowed rule diagnostic을 함께 설계해야 한다.
- BashTool 실행 runtime은 `BashTool.call -> runShellCommand -> exec -> shell provider -> ShellCommand -> TaskOutput/LocalShellTask`로 나뉘며, permission 이후에도 progress/background, sandbox wrapping, cwd tracking, output reference, semantic exit interpretation, notification queue를 분리한다.
- BashTool classifier는 permission gate의 비동기 participant다. speculative classifier, PreToolUse hook, interactive ask, PermissionDenied hook retry가 얽히므로 Agentica도 single-winner permission resolution과 retryable denial reason을 둬야 한다.
- Bash path validation은 safe wrapper stripping을 AST semantic check/permission prefix suggestion과 sync해야 한다. wrapper normalization이 어긋나면 wrapped command의 path가 검증되지 않는다.
- Sandbox adapter는 permission rule을 filesystem/network sandbox runtime config로 변환하지만, sandbox decision과 permission decision은 별도다. sandbox auto-allow도 explicit deny/ask/safety check를 낮추지 않는다.
- Shell output은 raw fd/file, progress tail, persisted reference, model preview, UI projection을 분리한다. Agentica result budget도 inline string truncation이 아니라 output reference/runtime projection으로 설계해야 한다.
- `bashSecurity.ts` legacy path는 단순 regex blocklist가 아니라 parser trust gate다. shell-quote/bash differential, quote/comment/newline/brace/backslash/flag obfuscation, zsh-specific bypass를 잡고, normal safety ask와 `isBashSecurityCheckForMisparsing`을 분리한다.
- Slash command는 prompt text shortcut이 아니라 prompt/local/local-jsx로 나뉜 runtime public surface다. `/compact`는 history rewrite transaction, `/context`는 projected request diagnostics, `/memory`는 persistent instruction source control plane으로 처리해야 한다. 개별 command catalog를 보면 `/clear`, `/resume`, `/branch`, `/plan`, `/permissions`, `/model`, `/login`, `/remote-control`도 각각 session transaction, permission mode mutation, auth/cache invalidation, adapter transport lifecycle로 분리해야 한다.
- Slash command heavy UI audit 결과, command는 side question, registry view/control, local machine mutation, browser/device integration, account setup까지 포함한다. `/btw`는 forked side-query이고, `/skills`/`/agents`/`/tasks`는 registry projection이며, `/terminal-setup`/native install/`/voice`는 local machine/device state mutation이다.
- Remote-safe command와 bridge-safe inbound command는 별도 allowlist다. Agentica RPC/headless command surface도 type만 보고 허용하지 말고 adapter capability와 side-effect class를 함께 검사해야 한다.
- UI adapter는 model context projection과 render projection을 철저히 분리한다. `Messages.tsx`는 normalize/filter/group/collapse/virtualize pipeline을 거치고, fullscreen에서는 compact 이전 scrollback을 보존하면서 model context는 compact boundary 이후만 쓰는 식으로 정책을 다르게 둔다.
- Prompt input은 simple textarea가 아니라 paste/image reference, history/search, slash/typeahead suggestion, external editor, stash, footer focus, team direct message를 포함한 adapter state machine이다. Agentica core history에는 이 상태를 직접 넣지 않는다.
- Custom Ink/terminal renderer는 Agentica core 이식 대상이 아니다. 다만 row id 안정성, large result collapse, static/dynamic row memoization, offscreen freeze, virtual scroll, search text drift test는 chat adapter 설계에 반영해야 한다.
- Ink renderer의 packed `Screen`/`Output` buffer, char/style/hyperlink pool, wide-char spacer, soft-wrap/noSelect bitmap, cursor declaration, alt-screen clamp는 terminal adapter 내부 구현이다. core history나 runtime public surface로 올라오면 안 된다.
- Scroll/search/selection은 screen-space overlay와 adapter sidecar로 처리된다. source history mutation, model context projection, public RPC event와 분리하는 것이 핵심 원칙이다.
- Long transcript 성능은 transform 분리, UUID+index anchor, deterministic streaming row id, conservative static row memo, historical array prop 금지, virtual list/cap policy가 함께 있어야 유지된다.
- Render projection 검증은 visible text와 search text drift, overlay 비오염, wide-char/soft-wrap/noSelect edge, paste/terminal-response 비노출까지 포함해야 한다.
