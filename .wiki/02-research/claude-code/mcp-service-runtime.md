# Claude Code MCP Service Runtime 분석

## 분석 범위

대상은 `/home/samchon/github/samchon/claude-code/src/services/mcp`와 MCP를 AppState에 연결하는 주변 코드다.

핵심 파일:

- `src/services/mcp/client.ts`
  - `connectToServer`: 595
  - `fetchToolsForClient`: 1743
  - `fetchResourcesForClient`: 2000
  - `fetchCommandsForClient`: 2033
  - `reconnectMcpServerImpl`: 2137
  - `getMcpToolsCommandsAndResources`: 2226
  - `transformResultContent`: 2478
  - `processMCPResult`: 2720
  - `callMCPToolWithUrlElicitationRetry`: 2813
  - `callMCPTool`: 3029
  - `setupSdkMcpClients`: 3262
- `src/services/mcp/config.ts`
  - project/user/local/enterprise/claude.ai/plugin config merge와 policy/dedup
- `src/services/mcp/types.ts`
  - transport/config/connection state schema
- `src/services/mcp/useManageMCPConnections.ts`
  - `useManageMCPConnections`: 143
  - batched AppState update: 207
  - connection attempt handler: 310
  - phase 1/2 config loading: 861
  - reconnect/toggle API: 1046, 1074
- `src/services/mcp/channelNotification.ts`, `channelPermissions.ts`, `channelAllowlist.ts`
  - MCP server가 channel/message/permission relay 역할을 할 때의 trust boundary
- `src/services/mcp/auth.ts`, `oauthPort.ts`, `xaa.ts`, `xaaIdpLogin.ts`
  - OAuth/PKCE, token refresh, step-up auth, XAA, local callback server, secure storage
- `src/services/mcp/headersHelper.ts`, `officialRegistry.ts`
  - dynamic header helper trust gate와 official MCP URL registry prefetch
- `src/services/mcp/SdkControlTransport.ts`, `InProcessTransport.ts`, `vscodeSdkMcp.ts`
  - SDK process MCP bridge, in-process linked transport, VSCode internal MCP notifications
- `src/entrypoints/sdk/controlSchemas.ts`, `coreSchemas.ts`
  - SDK control request/response, MCP status/message/set/reconnect/toggle/reload schema
- `src/cli/structuredIO.ts`, `src/cli/print.ts`
  - print/SDK mode MCP control request routing, dynamic MCP reconciliation, SDK MCP setup
- `src/commands/mcp/*`, `src/cli/handlers/mcp.tsx`
  - interactive `/mcp` UI command와 `claude mcp *` CLI command
- `src/components/mcp/*`, `src/components/MCPServerApprovalDialog.tsx`, `MCPServerMultiselectDialog.tsx`
  - MCP server list/menu/auth/reconnect/toggle/project approval UI

## 핵심 결론

Claude Code의 MCP는 "외부 tool 호출 adapter"가 아니다. 실제로는 다음을 합친 런타임이다.

- transport manager
- auth/OAuth/session manager
- tool/command/resource/skill discovery layer
- permission metadata projection layer
- result normalization/projection layer
- AppState hot-swap registry
- optional channel/message relay
- credential/control-plane UI

Agentica에 MCP나 외부 connector를 넣을 때도 단순 `operation.type = "mcp"`로 끝내면 안 된다. 연결 수명과 operation registry 수명이 분리되어야 한다.

## Config Cascade

Claude Code는 MCP config를 다음 scope로 다룬다.

- `enterprise`
- `local`
- `project`
- `user`
- `dynamic`
- `claudeai`
- `managed`

주요 특징:

- enterprise config가 있으면 일반 user/project/local/claude.ai config를 밀어낸다.
- project `.mcp.json`은 CWD까지 부모 디렉터리를 따라 읽고, 가까운 디렉터리가 우선한다.
- project MCP server는 승인 상태가 있어야 로딩된다.
- plugin MCP server는 dynamic scope로 들어가며 manual server와 dedup된다.
- claude.ai connector는 가장 낮은 우선순위로 merge되고 manual duplicate에 의해 suppress된다.
- policy denylist가 allowlist보다 우선한다.
- `sdk` server는 일부 enterprise policy 예외로 취급된다.

Agentica 적용:

- connector config는 `global/project/session/runtime/plugin` 같은 scope를 가져야 한다.
- registry merge는 단순 object spread가 아니라 precedence, approval, policy, duplicate signature를 가진다.
- duplicate signature는 이름이 아니라 URL/command/source 단위로 비교해야 한다.

## Connection Lifecycle

`connectToServer`는 server name과 config로 memoized connection을 만든다. 지원 transport:

- stdio
- sse
- sse-ide
- http
- ws
- ws-ide
- sdk
- claudeai-proxy
- in-process Chrome MCP
- in-process Computer Use MCP

관찰:

- HTTP/SSE/WS는 OAuth/session header/proxy/TLS/timeout 처리가 다르다.
- stdio는 process stderr를 cap하고 cleanup 시 `SIGINT -> SIGTERM -> SIGKILL` 순서로 정리한다.
- connection timeout은 transport cleanup과 함께 처리한다.
- remote transport는 session expiry, unauthorized, terminal error를 connection cache invalidation으로 연결한다.
- server instructions는 context 보호를 위해 길이 cap을 둔다.
- root capability는 현재 working directory를 `file://` root로 선언한다.

Agentica 적용:

- connector는 `connect`, `discover`, `call`, `cleanup`, `invalidate`를 분리한다.
- remote connector는 auth error와 session expiry를 operation failure가 아니라 registry state transition으로 다룬다.
- stdio/local connector가 있다면 process cleanup contract가 필요하다.
- connection cache key는 name만으로 부족하고, normalized config signature를 포함해야 한다.

## SDK MCP와 In-process Transport

Claude Code에는 일반 subprocess/remote MCP와 다른 두 가지 local transport 경로가 있다.

### SDK Control Transport

`SdkControlTransport.ts`는 SDK process 안에서 실행되는 MCP server를 CLI process의 MCP client와 연결한다.

역할:

- `SdkControlClientTransport`: CLI 쪽 MCP client transport다.
- `SdkControlServerTransport`: SDK process 쪽 MCP server transport다.
- JSON-RPC message는 SDK control request `mcp_message` 안에 감싸진다.
- wrapper에는 `server_name`이 들어가므로 여러 SDK MCP server를 동시에 라우팅할 수 있다.
- message id는 JSON-RPC payload 안에서 유지되고, pending request correlation은 transport가 아니라 StructuredIO/Query 쪽이 담당한다.

CLI -> SDK 흐름:

1. CLI MCP client가 `transport.send(JSONRPCMessage)`를 호출한다.
2. `SdkControlClientTransport`가 `structuredIO.sendMcpMessage(serverName, message)`를 호출한다.
3. StructuredIO는 `control_request` subtype `mcp_message`를 SDK consumer 쪽으로 보낸다.
4. SDK server가 응답하면 response body의 `mcp_response`를 받아 transport `onmessage`로 되돌린다.

SDK -> CLI 흐름:

1. SDK consumer가 `mcp_message` control request를 CLI로 보낸다.
2. `print.ts`는 `sdkClients`에서 server name을 찾고 connected client transport의 `onmessage`에 JSON-RPC message를 주입한다.
3. 성공 control response를 즉시 돌려준다.

중요한 설계:

- `sdk` config는 CLI가 subprocess를 spawn/connect하지 않는다.
- `client.ts connectToServer`는 `serverRef.type === "sdk"`이면 "print.ts에서 처리해야 한다"며 오류를 던진다.
- SDK MCP server 연결은 `setupSdkMcpClients()`에서만 만들고, transport는 `SdkControlClientTransport`다.
- `updateSdkMcp()`는 추가/삭제뿐 아니라 pending 또는 failed SDK client도 재초기화 대상으로 본다.
- SDK tool은 AppState `mcp.tools`에도 복사된다. sub-agent/assembleToolPool이 SDK MCP tool을 볼 수 있게 하기 위해서다.

Agentica 적용:

- SDK-hosted connector는 normal connector와 같은 registry에 투영하되 transport ownership은 adapter에 둔다.
- JSON-RPC correlation과 outer control request correlation을 분리해야 한다.
- SDK connector가 추가/삭제될 때 selector index와 AppState-like tool pool을 같이 갱신한다.
- SDK connector failure는 process spawn failure가 아니라 bridge/control-channel failure로 분류해야 한다.

### Dynamic MCP Set Servers

`controlSchemas.ts`는 SDK host가 runtime 중 MCP server set을 바꿀 수 있게 한다.

관련 control request:

- `mcp_status`
- `mcp_message`
- `mcp_set_servers`
- `mcp_reconnect`
- `mcp_toggle`
- `reload_plugins`
- `elicitation`

`mcp_set_servers` 특징:

- input은 `Record<string, McpServerConfigForProcessTransport>`다.
- 지원 config는 stdio, sse, http, sdk다.
- `handleMcpSetServers`는 SDK server와 process-based server를 분리한다.
- process-based server는 `allowedMcpServers`/`deniedMcpServers` enterprise policy를 통과해야 한다.
- `sdk` server는 SDK-managed라 CLI가 spawn/connect하지 않으므로 해당 policy gate 예외로 취급한다.
- 차단된 server는 throw가 아니라 response `errors[name]`에 들어간다.
- 변경 적용은 `mcpChangesPromise`로 직렬화한다. background plugin install과 SDK control message가 동시에 들어와도 race를 줄인다.
- SDK server는 먼저 pending client로 등록하고 control response를 보낸 뒤 `updateSdkMcp()`에서 연결한다. response 전에 연결을 기다리면 deadlock이 생길 수 있기 때문이다.

`reload_plugins` control request:

- plugin active projection을 refresh한다.
- SDK-injected agents는 보존한다.
- commands, plugin MCP diff, cache-only plugin load를 `allSettled`로 best-effort 수집한다.
- response는 commands, agents, plugins, mcpServers, error_count를 담는다.
- state change가 성공했는데 response projection 일부가 실패해도 reload 자체를 실패로 되돌리지 않는다.

Agentica 적용:

- connector set mutation은 long-lived runtime state transition이다. operation call result에 섞지 않는다.
- SDK/RPC connector mutation response는 `added`, `removed`, `errors` 같은 stable shape를 가져야 한다.
- dynamic connector reconciliation은 serialize되어야 한다.
- control request 성공과 후속 connector handshake 완료는 별도 event/state로 둔다.

### In-process Linked Transport

`InProcessTransport.ts`는 같은 process 안에서 MCP client와 server를 연결하는 transport pair를 만든다.

구조:

- `createLinkedTransportPair()`는 `[clientTransport, serverTransport]`를 반환한다.
- 한쪽 `send()`는 peer `onmessage`로 message를 전달한다.
- 전달은 `queueMicrotask`로 미뤄 synchronous request/response cycle의 stack depth 문제를 피한다.
- 한쪽 `close()`는 자기 `onclose`와 peer `onclose`를 모두 호출한다.

사용처:

- Claude in Chrome MCP server
- Computer Use MCP server

이 두 server는 stdio subprocess 대신 in-process로 실행된다. Chrome MCP는 별도 subprocess 메모리 비용을 피하기 위한 목적이고, Computer Use MCP도 같은 rationale로 처리된다.

Agentica 적용:

- in-process connector는 subprocess cleanup 대신 lifecycle abort/close contract가 필요하다.
- 같은 process라고 해서 permission/auth/result projection을 생략하면 안 된다. transport만 다를 뿐 connector registry flow는 동일해야 한다.
- synchronous local server 호출도 async boundary를 유지해야 한다.

### `claude mcp serve`

`src/entrypoints/mcp.ts`는 Claude Code 자체를 MCP server로 노출한다.

특징:

- `StdioServerTransport`로 MCP server를 시작한다.
- `ListTools`는 Claude Code builtin tools를 MCP tool schema로 변환한다.
- `CallTool`은 non-interactive ToolUseContext를 만들어 tool을 직접 실행한다.
- readFileState는 bounded LRU cache를 사용한다.
- permission은 `hasPermissionsToUseTool`을 그대로 사용한다.
- MCP server로 노출할 command는 현재 `review` command만 포함한다.

Agentica 적용:

- Agentica 자체를 MCP server로 내보내는 경우에도 일반 conversation history와 tool-use context를 그대로 공유하면 안 된다.
- MCP server mode는 별도 non-interactive context, bounded read state, explicit permission context를 가져야 한다.
- "Agentica operation을 MCP tool로 expose"하는 경로와 "MCP tool을 Agentica operation으로 import"하는 경로를 분리한다.

### VSCode SDK MCP

`vscodeSdkMcp.ts`는 `claude-vscode`라는 SDK MCP client를 특수 취급한다.

동작:

- connected SDK client 중 이름이 `claude-vscode`인 것을 저장한다.
- file edit/write 후 VSCode에 `file_updated` notification을 보낼 수 있다.
- VSCode가 보내는 `log_event` notification은 `tengu_vscode_*` analytics event로 변환된다.
- 연결 직후 experiment gates를 `experiment_gates` notification으로 보낸다.
- auto mode tri-state는 absent면 VSCode가 disabled로 fail-closed하도록 알 수 없을 때 omit한다.

Agentica 적용:

- IDE/internal connector notification은 일반 model-facing MCP tool과 별도 채널이다.
- file update notification, telemetry, experiment gate sync는 public history가 아니라 adapter side effect다.
- IDE connector는 fail-closed default를 가져야 한다.

## Operation Discovery

`fetchToolsForClient`는 MCP tool을 Claude Code `Tool`로 변환한다.

변환되는 metadata:

- `mcp__server__tool` 형태의 normalized name
- original MCP tool name과 server info
- `searchHint`
- `alwaysLoad`
- read-only/concurrency/destructive/open-world hint
- input JSON schema
- permission allow-rule suggestion
- progress event mapping
- special renderer override

`fetchCommandsForClient`는 MCP prompts를 slash command로 바꾼다. 이름은 `mcp__server__prompt` 형식이며, prompt arguments를 MCP prompt args로 zip해서 요청한다.

`fetchResourcesForClient`는 MCP resources를 server name과 함께 저장한다. list/read resource tool은 global helper tool처럼 한 번만 추가된다.

Agentica 적용:

- 외부 connector에서 유래한 operation은 normalized public key와 original remote id를 모두 가진다.
- selector에는 `searchHint`, read-only/destructive/concurrency metadata를 넣는다.
- operation registry는 tool뿐 아니라 prompt/resource/skill 같은 "호출 가능한 지식 단위"도 같은 lifecycle로 관리할 수 있어야 한다.
- resource list/read는 connector마다 중복 생성하지 말고 registry helper로 한 번만 노출한다.

## Hot-swap과 AppState

`useManageMCPConnections`는 React hook이지만 핵심은 registry reconciliation이다.

흐름:

1. known config를 pending client로 AppState에 추가한다.
2. stale plugin server나 config hash가 바뀐 server를 정리한다.
3. Claude Code config를 먼저 연결한다.
4. claude.ai connector config를 별도 phase로 await한다.
5. connection attempt 결과를 batched update로 AppState에 반영한다.
6. `tools/list_changed`, `prompts/list_changed`, `resources/list_changed` notification이 오면 해당 cache만 무효화하고 registry slice를 갱신한다.
7. remote transport close는 exponential backoff reconnect를 시도한다.
8. UI는 reconnect/toggle API를 호출할 수 있다.

중요한 세부:

- batched update window는 16ms다.
- failed/disabled 상태는 tools/commands/resources를 자동으로 비운다.
- stale connected server cleanup 전에 `onclose`를 제거해 오래된 config reconnect race를 막는다.
- plugin reload key와 session id가 effect dependency다.

Agentica 적용:

- runtime operation registry는 immutable snapshot처럼 모델에 투영되지만 내부적으로는 hot-swap된다.
- registry version을 state에 두고 selector cache를 무효화해야 한다.
- connector disable은 config 저장, connection cleanup, registry projection 제거가 한 transition이어야 한다.
- registry update event를 public API에 바로 열기보다 internal event로 먼저 검증한다.

## Auth와 Elicitation

Claude Code는 remote auth 실패를 `needs-auth` connection state로 둔다. 경우에 따라 auth pseudo-tool을 만들어 model/runtime이 재인증 경로를 이해하게 한다.

URL elicitation은 MCP error code를 보고 별도 루프로 처리한다.

- hook이 먼저 처리할 수 있다.
- print/SDK mode는 structured callback으로 전달한다.
- REPL mode는 AppState queue에 넣고 dialog가 응답한다.
- accept가 아니면 tool call은 중단 message를 반환한다.
- accept되면 원래 tool call을 retry한다.

Agentica 적용:

- auth-required는 operation call error가 아니라 connector state다.
- user interaction이 필요한 connector flow는 일반 operation과 다른 pending interaction state를 가져야 한다.
- RPC/chat처럼 렌더링 능력이 없는 adapter에서는 해당 flow를 selector 후보에서 제외하거나 callback capability를 요구해야 한다.

## OAuth, XAA, Secure Storage

`auth.ts`는 단순 browser login helper가 아니라 MCP credential state machine이다.

주요 흐름:

- `getServerKey(serverName, serverConfig)`는 server name과 config hash를 함께 써 credential key를 만든다.
- stored OAuth token은 `mcpOAuth[serverKey]`에 저장한다.
- pre-configured client secret은 별도 `mcpOAuthClientConfig[serverKey]`에 저장한다.
- XAA IdP id_token과 IdP client secret은 `xaaIdpLogin.ts`의 별도 storage slot에 저장한다.
- `performMCPOAuthFlow`는 normal OAuth/PKCE와 XAA를 같은 public entry로 묶지만, `oauth.xaa`가 있으면 normal consent flow로 fallback하지 않는다.
- local callback server는 loopback port를 열고 5분 timeout, abort signal, callback URL 수동 paste hook을 가진다.
- OAuth state mismatch는 CSRF로 거부한다.
- callback HTML의 error payload는 XSS sanitize 후 출력한다.
- `authServerMetadataUrl`는 HTTPS만 허용한다.
- authorization URL logging은 state/nonce/code/code_challenge/code_verifier를 redact한다.

Token refresh:

- `ClaudeAuthProvider.tokens()`는 만료 5분 전부터 proactive refresh를 시도한다.
- refresh는 process 내 `_refreshInProgress`로 dedupe한다.
- cross-process refresh race는 lockfile로 줄인다.
- lock 획득 후 keychain cache를 clear하고 다시 읽어, 다른 process가 이미 refresh했으면 그 token을 재사용한다.
- `invalid_grant`는 refresh token이 죽은 것으로 보고 local token을 비운다.
- timeout/temporary unavailable/too many requests/server error는 최대 3회 exponential backoff 한다.
- Slack처럼 200 body 안에 OAuth error를 담는 비표준 응답은 `normalizeOAuthErrorBody`로 SDK error mapping이 작동하도록 400 response로 바꾼다.

Step-up auth:

- `wrapFetchWithStepUpDetection`은 403 `WWW-Authenticate: insufficient_scope`를 감지한다.
- provider에 pending step-up scope를 저장하고, `tokens()`는 refresh token을 일부러 빼서 SDK가 scope 없는 refresh를 반복하지 않고 PKCE flow로 넘어가게 한다.
- re-auth 시 `revokeServerTokens(..., { preserveStepUpState: true })`로 cached scope/discovery state를 보존한다.

XAA:

- XAA는 Cross-App Access flow다.
- user는 IdP에 한 번 browser login하고 id_token을 cache한다.
- MCP server별로는 PRM discovery, authorization server metadata discovery, RFC 8693 token exchange, RFC 7523 JWT bearer grant를 거쳐 access token을 얻는다.
- XAA server는 `oauth.xaa: true`, AS `clientId`, AS `clientSecret`, user-level `settings.xaaIdp`가 필요하다.
- IdP secret은 MCP server AS secret과 다른 trust domain이다.
- silent XAA refresh는 cached id_token이 있을 때 browser 없이 access token을 재발급한다.
- XAA exchange 실패가 id_token 문제로 판정되면 IdP id_token cache를 clear한다.

Agentica 적용:

- connector credential key는 display name이 아니라 normalized config fingerprint를 포함해야 한다.
- access token, refresh token, OAuth client secret, IdP id_token, IdP client secret은 같은 "secret" 한 덩어리가 아니다. source별 trust domain을 나눠야 한다.
- auth-required, step-up-required, manual-callback-required, auth-cancelled는 execute error가 아니라 connector interaction state다.
- reconnect 후 operation registry를 다시 discover해야 authenticated capability가 반영된다.
- secure storage overflow/size 문제를 막기 위해 discovery metadata 전체를 저장하지 말고 최소 URL/state만 저장한다.

## Needs-auth Cache와 Auth Pseudo-tool

`client.ts`는 remote auth failure를 곧바로 반복하지 않는다.

흐름:

- SSE/HTTP/claude.ai proxy auth failure는 `handleRemoteAuthFailure`로 `needs-auth` client state가 된다.
- auth failure는 analytics event와 debug log를 남기고 15분 auth cache에 기록한다.
- 이전 OAuth discovery state는 있으나 access/refresh token이 없으면, cache TTL이 끝나도 재시도하지 않고 `needs-auth`로 둔다.
- `processServer`는 cached `needs-auth`면 실제 network connect를 생략한다.
- 이때 `createMcpAuthTool(name, config)`를 tools list에 넣어 model/runtime이 auth 필요성을 볼 수 있게 한다.
- auth가 끝난 뒤 `/mcp` UI는 reconnect를 실행해 server tools/commands/resources를 다시 discover한다.

Agentica 적용:

- connector retry suppression은 transient failure retry와 분리한다.
- "최근 인증 실패" cache와 "이미 discovery했지만 token 없음" state를 둘 다 둬야 한다.
- auth pseudo-operation은 selector 후보로 마구 노출하지 않고, 해당 connector의 recovery action으로만 투영하는 편이 낫다.
- auth success는 token 저장만으로 끝나지 않는다. reconnect/discover/projection refresh까지 하나의 recovery transaction이어야 한다.

## `/mcp` UI와 CLI Surface

Interactive `/mcp`:

- `commands/mcp/index.ts`는 local-jsx command로 `/mcp`를 등록한다.
- `/mcp reconnect <server>`는 `MCPReconnect`를 바로 실행한다.
- `/mcp enable [server]`, `/mcp disable [server]`는 `useMcpToggleEnabled()`로 server를 enable/disable한다.
- 기본 `/mcp`는 `MCPSettings`를 렌더링한다.
- 특정 배포 조건에서는 `/plugins installed` tab으로 redirect하는 compatibility path가 있다.

`MCPSettings`:

- AppState `mcp.clients/tools/commands/resources`와 agent definitions에서 server 목록을 만든다.
- `ide` server는 UI list에서 숨긴다.
- SSE/HTTP server는 `ClaudeAuthProvider.tokens()`, session ingress token, connected tools presence로 authenticated 여부를 계산한다.
- `claudeai-proxy`, SSE, HTTP, stdio, agent-only MCP server를 다른 menu component로 보낸다.

Remote server menu:

- 상태는 disabled/connected/pending/needs-auth/failed로 보인다.
- authenticated이면 Re-authenticate/Clear authentication을 제공한다.
- unauthenticated이면 Authenticate를 제공한다.
- auth 중에는 browser URL fallback과 `c` copy shortcut을 제공한다.
- localhost callback이 브라우저에서 실패하는 환경을 위해 callback URL manual paste input을 제공한다.
- Esc/unmount는 AbortController로 OAuth callback server를 닫는다.
- Clear authentication은 token revocation, local cache clear, AppState tools/commands/resources 제거를 함께 처리한다.
- claude.ai connector는 별도 browser auth/clear-auth flow를 가진다.

Stdio server menu:

- View tools, Reconnect, Enable/Disable을 제공한다.
- connected일 때 tool/prompt/resource capability count를 보여준다.

CLI `claude mcp *`:

- `mcp add`는 stdio/sse/http, scope, env, headers, OAuth client id/secret/callback port, XAA를 받는다.
- HTTP/SSE client secret은 config write 전 먼저 입력받아 partial state를 피한다.
- `add-json`도 secret이 필요한 JSON인지 먼저 판정하고 secret 입력 후 config를 쓴다.
- `remove`는 config 제거와 remote server token/client config cleanup을 같이 한다.
- `list`와 `get`은 실제 health check를 병렬로 수행한다.
- `reset-project-choices`는 `.mcp.json` approval/rejection local settings를 비운다.
- `serve`는 cwd 존재 확인, setup, MCP server entrypoint start를 수행한다.

Agentica 적용:

- connector management UI와 CLI는 같은 runtime action을 호출하되, CLI는 TTY/secret/env fallback을 명확히 가져야 한다.
- enable/disable은 config를 지우는 것이 아니라 projection 제거와 reconnect boundary를 갖는 상태 전이다.
- auth/clear-auth는 credential storage뿐 아니라 live registry cleanup을 같이 수행해야 한다.
- non-interactive adapter에는 browser URL, manual callback URL, secret prompt capability가 있는지 명시해야 한다.

## Project `.mcp.json` Approval와 Headers Helper Trust

Project-scoped `.mcp.json` server는 자동 실행되지 않는다.

승인 구조:

- `getProjectMcpServerStatus(serverName)`는 `enabledMcpjsonServers`, `disabledMcpjsonServers`, `enableAllProjectMcpServers`를 본다.
- single pending server는 `MCPServerApprovalDialog`로 승인/거부/전체 승인 중 하나를 고르게 한다.
- multiple pending server는 `MCPServerMultiselectDialog`로 server별 enable list를 고르게 하며, Esc는 reject all이다.
- approval/rejection은 `localSettings`에 저장된다.
- bypass permissions mode도 project settings source가 enabled인 경우에만 auto-approve한다.
- non-interactive mode도 project settings source가 enabled인 경우에만 auto-approve한다.
- `mcp reset-project-choices`는 이 local approval state를 초기화한다.

주의할 점:

- approval copy는 "MCP servers may execute code or access system resources"라고 명시한다.
- tool call permission approval과 server load approval은 다른 층이다. server를 승인해도 각 tool call은 별도 permission 대상이다.

`headersHelper.ts`:

- project/local scope에서 `headersHelper`를 실행하려면 interactive session에서 workspace trust가 먼저 수락되어야 한다.
- trust가 없으면 helper를 실행하지 않고 null을 반환한다.
- non-interactive session은 dialog를 띄울 수 없으므로 trust check를 skip한다.
- helper는 shell 실행이며 10초 timeout을 둔다.
- helper env에는 `CLAUDE_CODE_MCP_SERVER_NAME`, `CLAUDE_CODE_MCP_SERVER_URL`을 넣는다.
- stdout은 JSON object여야 하고 value는 모두 string이어야 한다.
- dynamic headers는 static headers를 override한다.
- failure는 connection 전체를 막지 않고 header 없이 진행한다.

Agentica 적용:

- project connector config는 workspace trust, connector approval, tool-call permission을 분리해야 한다.
- project approval은 global user config가 아니라 project-local user intent로 저장해야 한다.
- helper script는 trust gate 이후에만 실행되어야 하며, non-interactive policy를 명시해야 한다.
- dynamic secret/header helper 실패는 connector state diagnostic으로 남기되, 반드시 fatal일 필요는 없다.

## Official Registry Prefetch

`officialRegistry.ts`는 Anthropic official MCP registry URL 목록을 fire-and-forget으로 가져온다.

특징:

- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`가 있으면 fetch하지 않는다.
- startup에서 `prefetchOfficialMcpUrls()`를 호출한다.
- URL은 query string 제거, trailing slash 제거 후 set에 저장된다.
- registry 미로드/실패 상태의 `isOfficialMcpUrl()`은 false다. fail-closed다.
- snapshot에서 `isOfficialMcpUrl()`의 active call site는 보이지 않는다. 현재는 prefetch/cache utility 성격으로 남아 있다.

Agentica 적용:

- official registry는 permission 근거가 아니라 risk/UX hint로만 써야 한다.
- network prefetch는 optional traffic gate가 있어야 한다.
- official 여부가 로드되지 않았을 때는 trusted로 간주하지 않는다.

## Result Projection

`transformResultContent`는 MCP result content를 model message block으로 변환한다.

처리:

- text는 text block
- image는 resize/downsample 후 image block
- audio/blob/binary는 파일로 persist하고 path 설명 text block
- resource text/blob/link는 source prefix를 붙여 변환
- structuredContent는 JSON string과 compact schema를 함께 계산

`processMCPResult`는 큰 결과를 다시 검사한다.

- IDE tool은 model context로 가지 않으므로 large output 처리를 건너뛴다.
- image 포함 content는 파일 JSON persistence 대신 truncation을 택한다.
- 큰 text/JSON result는 파일로 persist하고 "어디를 읽어라" 지시문을 반환한다.
- persist 실패 시 truncation error message로 fallback한다.

Agentica 적용:

- execute result는 원본 payload, LLM projection, 사용자 표시, resume reference를 분리해야 한다.
- binary/blob 결과는 inline JSON으로 넣지 않고 adapter persistence hook을 통한다.
- structured result에는 compact schema를 붙여 재조회/필터링 힌트를 줄 수 있다.
- 큰 결과 projection은 connector 전용이 아니라 모든 operation result에 공통 적용해야 한다.

## Channel MCP

Channel 기능은 MCP server가 `notifications/claude/channel`을 보내 conversation에 user-like message를 enqueue하는 구조다. permission reply는 일반 channel text가 아니라 별도 notification method로 들어온다.

보안 경계:

- feature flag와 runtime gate
- claude.ai auth와 org policy
- plugin allowlist
- server capability check
- session `--channels` entry

Agentica 적용:

- 외부 channel에서 들어온 message는 일반 user prompt와 origin metadata를 구분해야 한다.
- channel permission approval은 raw chat text regex로 처리하지 말고 structured callback으로만 받는 편이 안전하다.
- remote channel은 adapter capability와 allowlist를 동시에 요구해야 한다.

## MCP Skills와 Cache Invalidation

`useManageMCPConnections.ts` 추가 독해 결과:

- MCP server의 `tools/list_changed`, `prompts/list_changed`, `resources/list_changed` notification은 각각 cache invalidation 범위가 다르다.
- `MCP_SKILLS` gate가 켜지면 MCP resource에서 skill command를 만들 수 있다. 공개 snapshot에는 실제 `mcpSkills.ts` 구현이 없고 dynamic require seam만 존재한다.
- prompts/list_changed는 prompt command cache를 지우고 MCP skills는 cached result를 재사용한다. skills는 resources에서 오기 때문이다.
- resources/list_changed는 resource cache, command cache, MCP skills cache를 함께 지운다.
- plugin reload 시 scope `dynamic` MCP server를 stale client로 보고 registry에서 제거한다.
- `EXPERIMENTAL_SKILL_SEARCH` gate가 켜지면 MCP skill 변화 때 local skill index cache도 clear한다. 공개 snapshot에는 `services/skillSearch` 구현 directory가 없다.

Agentica 적용:

- connector registry version 하나만 올리는 것보다 tools/resources/prompts/capabilities sub-version을 둘 수 있어야 selector/cache invalidation이 과하지 않다.
- MCP resource에서 procedure/capability가 materialize되는 확장은 가능하지만, 1차 Agentica core에는 넣지 않는다.
- dynamic connector removal은 "disable"과 "stale plugin server cleanup"을 구분해야 한다.

## Agentica 설계로 번역

초기 인터페이스 초안:

```ts
interface AgenticaConnectorRegistry {
  version: number;
  clients: AgenticaConnectorClientState[];
  operations: AgenticaRuntimeOperation[];
  resources: AgenticaConnectorResource[];
}

interface AgenticaConnectorClientState {
  key: string;
  scope: "global" | "project" | "session" | "plugin" | "managed";
  status: "pending" | "connected" | "failed" | "needsAuth" | "disabled";
  transport?: "stdio" | "http" | "sse" | "ws" | "sdk-control" | "in-process";
  approval?: "approved" | "rejected" | "pending" | "implicit";
  auth?: AgenticaConnectorAuthState;
  error?: string;
  reconnectAttempt?: number;
  controlOwner?: "runtime" | "sdk-host" | "ide-adapter";
}

interface AgenticaConnectorAuthState {
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
  lastFailureReason?: string;
}

interface AgenticaRuntimeOperation {
  key: string;
  source: "local" | "http" | "class" | "mcp" | "plugin";
  originalName?: string;
  connectorKey?: string;
  schema: unknown;
  metadata: AgenticaOperationRuntimeMetadata;
}
```

도입 원칙:

- `Agentica`에만 붙인다.
- `MicroAgentica`의 `call()` 경로에 connector lifecycle을 넣지 않는다.
- 처음에는 MCP 구현 자체보다 registry/state/projection 추상화부터 만든다.
- connector registry가 바뀌면 selector index와 prompt projection cache를 무효화한다.
- SDK/control-channel connector는 normal connector와 같은 registry item이지만 connect/call ownership은 adapter가 가진다.
- dynamic connector set mutation은 직렬화하고, response shape는 added/removed/errors로 안정화한다.
- SDK control protocol 전체와 remote transport durability는 `remote-bridge-server-runtime.md`의 SDK/CLI transport 분석을 따른다. MCP 문서에서는 MCP-specific control request와 registry projection만 다룬다.
