# Claude Code Remote/Bridge/Server Runtime 정밀 분석

## 범위

대상은 `/home/samchon/github/samchon/claude-code/src/remote`, `/home/samchon/github/samchon/claude-code/src/server`, `/home/samchon/github/samchon/claude-code/src/bridge`다.

이번 문서는 Agentica에 직접 필요한 remote session, bridge transport, direct-connect, SDK message/public surface 관점만 정리한다. `bridgeMain.ts`, `replBridge.ts`는 매우 크므로 전체 UI/TUI 세부가 아니라 runtime protocol, reconnect, permission, spawn, output/event forwarding 흐름에 집중한다.

주요 근거 파일:

| 파일 | 관찰 지점 |
| --- | --- |
| `remote/RemoteSessionManager.ts` | CCR remote session facade, permission response, interrupt |
| `remote/SessionsWebSocket.ts` | remote session WebSocket subscription, reconnect, control request/response |
| `remote/sdkMessageAdapter.ts` | SDKMessage를 REPL Message로 projection |
| `remote/remotePermissionBridge.ts` | remote permission prompt를 local confirmation UI에 맞추는 synthetic message/tool stub |
| `server/types.ts` | direct-connect server session model |
| `server/createDirectConnectSession.ts` | direct server session creation |
| `server/directConnectManager.ts` | direct-connect WebSocket protocol |
| `bridge/types.ts` | bridge environment/work/session protocol types |
| `bridge/bridgeApi.ts` | environments/session API client, auth retry, heartbeat, archive, stop |
| `bridge/bridgeMessaging.ts` | ingress parsing, echo dedup, server control request handling |
| `bridge/replBridgeTransport.ts` | v1/v2 transport abstraction |
| `bridge/replBridge.ts` | always-on REPL bridge core, work poll loop, initial flush, transport swap |
| `bridge/remoteBridgeCore.ts` | env-less CCR v2 bridge core |
| `bridge/bridgeMain.ts` | standalone/headless bridge loop, multi-session spawn, worktree isolation |
| `bridge/sessionRunner.ts` | child CLI process runner and NDJSON bridge |
| `bridge/createSession.ts`, `bridge/codeSessionApi.ts` | v1 session API and v2 code-session API |
| `bridge/workSecret.ts` | work secret decoding, v1/v2 session URL construction, worker registration |
| `bridge/inboundMessages.ts`, `bridge/inboundAttachments.ts` | inbound user message and attachment normalization |
| `bridge/bridgePointer.ts`, `bridge/bridgeEnabled.ts` | crash recovery pointer and entitlement gates |
| `cli/transports/SSETransport.ts` | CCR v2 SSE read + HTTP POST write transport |
| `cli/transports/WebSocketTransport.ts` | legacy WS read/write transport with replay buffer |
| `cli/transports/HybridTransport.ts` | WS read + serialized HTTP POST write transport |
| `cli/transports/SerialBatchEventUploader.ts` | ordered batched retry/backpressure primitive |
| `cli/transports/WorkerStateUploader.ts` | coalesced worker state/metadata PUT primitive |
| `cli/transports/ccrClient.ts` | worker epoch, heartbeat, state, internal/client event persistence |
| `cli/structuredIO.ts`, `cli/remoteIO.ts`, `cli/print.ts` | SDK stdin/stdout/control routing and remote IO adapter |
| `entrypoints/sdk/controlSchemas.ts`, `coreSchemas.ts` | SDK public/control message schema |
| `bridge/bridgeUI.ts`, `bridge/bridgeStatusUtil.ts` | QR/status renderer and remote-control CLI surface |

## Remote Session Manager

`RemoteSessionManager`는 remote CCR session을 local REPL에 붙이는 작은 facade다.

책임:

- `SessionsWebSocket`을 생성하고 connect한다.
- SDK message는 `onMessage` callback으로 넘긴다.
- `control_request` 중 `can_use_tool`은 pending map에 저장하고 `onPermissionRequest`로 넘긴다.
- `control_cancel_request`는 pending permission prompt를 제거하고 `onPermissionCancelled`로 넘긴다.
- 알 수 없는 control subtype은 error `control_response`를 보내 서버가 대기하다 죽지 않게 한다.
- user message는 `sendEventToRemoteSession()` HTTP POST로 보낸다.
- permission response는 `control_response`로 WebSocket에 보낸다.
- `cancelSession()`은 `control_request` subtype `interrupt`를 보낸다.

중요한 분리:

- remote session 수신은 WebSocket이다.
- user prompt 송신은 HTTP POST다.
- permission/interrupt는 SDK control protocol이다.
- viewer-only mode는 interrupt/reconnect/title update 같은 active control을 제한하기 위한 config로 존재한다.

Agentica 적용:

- remote runtime adapter는 `message`, `control_request`, `control_response`, `control_cancel_request`를 같은 channel에 섞어 받더라도 내부에서는 분리해야 한다.
- permission prompt는 operation failure가 아니라 pending interaction이다.
- unsupported control request에는 반드시 error response를 보내야 한다. 무응답은 server-side timeout으로 이어진다.

## Sessions WebSocket

`SessionsWebSocket`은 `/v1/sessions/ws/{sessionId}/subscribe?organization_uuid=...`에 연결한다.

핵심:

- OAuth access token은 WebSocket headers에 넣는다.
- Bun native WebSocket과 Node `ws`를 모두 지원한다.
- message parser는 `type` string이 있는 object를 넓게 받아들인다. allowlist가 아니라 downstream adapter가 판단한다.
- permanent close code는 4003 unauthorized다.
- 4001 session-not-found는 compaction 중 transient일 수 있어 최대 3회 retry한다.
- 일반 reconnect는 2초 delay, 최대 5회다.
- ping interval은 30초다.
- `sendControlResponse()`와 `sendControlRequest()`는 connected 상태에서만 보낸다.
- `reconnect()`는 attempts/session-not-found counter를 reset하고 새 연결을 만든다.

중요한 원칙:

- backend가 새 SDK message type을 먼저 내보내도 client가 session을 잃지 않게 unknown message를 drop/log한다.
- compaction 같은 runtime operation은 remote subscription에서 "session not found"처럼 보일 수 있다. 이를 즉시 fatal로 취급하지 않는다.
- reconnect와 permanent close를 callback에서 구분한다. UI/SDK 상태는 `reconnecting`과 `disconnected`가 달라야 한다.

Agentica 적용:

- remote adapter는 protocol type evolution에 관대해야 한다.
- compact/recover 중 transient remote errors를 별도 budget으로 다뤄야 한다.
- reconnect 중인 session을 failed task로 바로 전이하면 안 된다.

## SDK Message Adapter

`sdkMessageAdapter.ts`는 CCR backend의 `SDKMessage`를 REPL의 내부 `Message`로 바꾼다.

projection 규칙:

- `assistant` -> assistant message.
- `stream_event` -> stream event.
- `result` success는 기본적으로 UI message로 만들지 않는다. multi-turn session에서 noise이기 때문이다.
- `result` error만 warning system message로 보여준다.
- `system/init`은 "Remote session initialized" informational system message다.
- `system/status` 중 `compacting`은 "Compacting conversation..." system message로 보여준다.
- `system/compact_boundary`는 compact boundary system message와 compact metadata로 변환한다.
- `tool_progress`는 도구별 progress type이 아니라 informational system message로 낮춘다.
- `auth_status`, `tool_use_summary`, `rate_limit_event`는 REPL display에서 무시한다.
- unknown type은 crash가 아니라 ignore/log다.
- direct-connect mode에서는 remote server가 보낸 `tool_result` user message를 local user message로 변환할 수 있다.

Agentica 적용:

- public history와 remote SDK event는 1:1이 아니다. adapter projection layer가 필요하다.
- success result, progress, rate-limit, auth status를 모두 transcript에 넣으면 UX와 context가 오염된다.
- compact boundary는 system marker와 structured metadata를 분리하는 좋은 선례다.

## SDK Core and Control Schemas

`entrypoints/sdk/coreSchemas.ts`와 `controlSchemas.ts`는 Claude Code의 SDK protocol을 두 층으로 나눈다.

Core SDK message:

- `assistant`
- `user`
- `result`
- `stream_event`
- `system/init`
- `system/compact_boundary`
- `system/status`
- `system/api_retry`
- `system/local_command_output`
- hook start/progress/response
- `tool_progress`
- `auth_status`
- `system/files_persisted`
- task started/progress/notification
- `system/session_state_changed`
- `tool_use_summary`
- `rate_limit_event`
- `system/elicitation_complete`
- `prompt_suggestion`

Control request:

- session/control: `initialize`, `interrupt`, `set_permission_mode`, `set_model`, `set_max_thinking_tokens`
- permission: `can_use_tool`
- context/session state: `get_context_usage`, `rewind_files`, `cancel_async_message`, `seed_read_state`, `stop_task`
- MCP/plugin: `mcp_status`, `mcp_message`, `mcp_set_servers`, `mcp_reconnect`, `mcp_toggle`, `reload_plugins`, `elicitation`
- settings: `apply_flag_settings`, `get_settings`
- hook callback: `hook_callback`

Control wrapper:

- outbound request: `{ type: "control_request", request_id, request }`
- response: `{ type: "control_response", response: { subtype: "success" | "error", request_id, ... } }`
- cancel: `{ type: "control_cancel_request", request_id }`
- keepalive: `{ type: "keep_alive" }`
- stdin-only env patch: `{ type: "update_environment_variables", variables }`

중요한 점:

- `request_id`는 outer control request correlation이다.
- MCP payload의 JSON-RPC id는 inner message 안에 남아 있다. 둘을 섞으면 SDK MCP routing이 깨진다.
- `controlSchemas.ts`는 public SDK generator 기준 schema이고, `print.ts`에는 feature/internal control subtype이 더 있다.
- `initialize`는 hooks, SDK MCP server names, JSON schema, system prompt, agent definition, prompt suggestion opt-in을 stdin으로 넘겨 ARG_MAX 문제를 피한다.
- 중복 initialize는 error response와 pending permission requests를 함께 반환한다.

Agentica 적용:

- public SDK/RPC schema와 internal runtime control subtype을 구분한다.
- request/response/cancel/keepalive/env-patch를 한 event union에 넣더라도 adapter에서 lifecycle을 분리한다.
- control request id와 operation/tool call id, connector JSON-RPC id를 별도 correlation field로 둔다.
- settings/model/permission 변경은 history append가 아니라 runtime state transition이다.

## Remote Permission Bridge

remote permission prompt는 local CLI에 실제 assistant tool_use message가 없으므로 synthetic assistant message를 만든다.

구성:

- `createSyntheticAssistantMessage()`는 remote permission request의 `tool_use_id`, `tool_name`, `input`으로 synthetic assistant tool_use block을 만든다.
- `createToolStub()`은 local에 없는 remote/MCP tool에 대해 minimal Tool stub을 만든다.
- stub은 permission UI rendering용이며 실제 call은 하지 않는다.

Agentica 적용:

- remote operation permission UI는 local operation registry와 다를 수 있다.
- local adapter는 모르는 remote tool을 "실행 가능한 tool"로 등록하면 안 되고, permission/rendering stub으로만 다뤄야 한다.
- permission response payload에는 `allow/deny`, `updatedInput`, message가 분리되어야 한다.

## Direct-connect Server

`server` 폴더는 local/direct server session에 붙는 작은 protocol이다.

`server/types.ts`:

- connect response는 `session_id`, `ws_url`, optional `work_dir`.
- `ServerConfig`는 host/port/auth token/unix socket, idle timeout, max sessions, workspace를 가진다.
- `SessionState`: `starting`, `running`, `detached`, `stopping`, `stopped`.
- `SessionIndexEntry`는 stable session key에서 server session/transcript session/cwd/permissionMode/lastActiveAt을 복구하기 위한 persisted metadata다.

`createDirectConnectSession.ts`:

- `${serverUrl}/sessions`에 POST한다.
- request body는 `cwd`와 optional `dangerously_skip_permissions`.
- response는 schema validation을 통과해야 한다.
- network/HTTP/parse failure는 `DirectConnectError`로 구분한다.

`directConnectManager.ts`:

- `ws_url`로 WebSocket 연결한다.
- auth token이 있으면 `authorization: Bearer` header를 넣는다.
- server는 newline-delimited JSON을 보낼 수 있어 line 단위로 parse한다.
- `control_request/can_use_tool`은 permission callback으로 넘긴다.
- unsupported control subtype은 error response를 보낸다.
- `keep_alive`, `control_cancel_request`, `streamlined_*`, `system/post_turn_summary`는 local message로 forward하지 않는다.
- user message는 `--input-format stream-json`의 SDKUserMessage 형태로 WebSocket에 쓴다.
- interrupt는 SDK control_request subtype `interrupt`로 보낸다.

Agentica 적용:

- remote session과 direct-connect session은 같은 high-level interface를 공유할 수 있지만 auth, transport, filtering이 다르다.
- direct server protocol은 "session creation HTTP + stream-json WebSocket" 조합으로 단순화할 수 있다.
- dangerous permission skip 같은 server-side mode는 public API에 그대로 노출하기 전에 명확한 policy gate가 필요하다.

## Bridge Environment Protocol

`bridge/types.ts`는 remote-control bridge가 server와 주고받는 environment/work/session protocol을 정의한다.

주요 type:

- `WorkResponse`: environment work poll 결과. `data.type`은 `session` 또는 `healthcheck`.
- `WorkSecret`: base64url JSON. `session_ingress_token`, `api_base_url`, sources/auth/env/mcp config, optional `use_code_sessions`를 포함한다.
- `SpawnMode`: `single-session`, `worktree`, `same-dir`.
- `BridgeConfig`: dir, machine/repo/branch, max sessions, spawn mode, sandbox, worker type, environment id, API base URL, session ingress URL, timeout.
- `BridgeApiClient`: register, poll, ack, stop, deregister, permission response, archive, reconnect, heartbeat.
- `SessionHandle`: child session process handle. done promise, kill/forceKill, activities, accessToken, stderr ring buffer, stdin write, token update를 가진다.

Agentica 적용:

- remote worker runtime은 session, work item, secret/token, transport, child process를 분리해야 한다.
- `same-dir`과 `worktree`는 concurrency policy다. Agentica에서 write-heavy remote tasks를 병렬화하려면 workspace isolation 정책이 먼저 필요하다.
- session handle에는 kill뿐 아니라 token update와 activity ring buffer가 필요하다.

## Bridge API Client

`bridgeApi.ts`는 environments/session API client다.

보안/신뢰성:

- URL path segment에 들어가는 server-provided id는 `^[a-zA-Z0-9_-]+$`로 validate한다.
- OAuth 401은 optional refresh handler로 한 번만 retry한다.
- trusted device token header를 optional로 붙일 수 있다.
- 401/403/404/410은 `BridgeFatalError`로 분류한다.
- 429는 rate limit error로 분리한다.
- archive session의 409는 idempotent already-archived로 성공 취급한다.
- suppressible 403은 external poll/session scope나 environments manage 권한 부족처럼 core 기능과 무관한 cosmetic permission error로 구분한다.

API surface:

- `POST /v1/environments/bridge`: bridge environment register.
- `GET /v1/environments/{id}/work/poll`: work poll. empty/null은 no work.
- `POST /v1/environments/{id}/work/{workId}/ack`: work ack.
- `POST /v1/environments/{id}/work/{workId}/stop`: work stop.
- `DELETE /v1/environments/bridge/{id}`: deregister.
- `POST /v1/sessions/{sessionId}/archive`: archive.
- `POST /v1/environments/{id}/bridge/reconnect`: force-stop stale workers and requeue a session.
- `POST /v1/environments/{id}/work/{workId}/heartbeat`: lease heartbeat.
- `POST /v1/sessions/{sessionId}/events`: permission response event.

Agentica 적용:

- remote runtime API는 fatal/retryable/suppressible error taxonomy를 가져야 한다.
- ack/stop/archive/heartbeat는 각각 다른 lifecycle action이다. "session ended" 하나로 뭉치면 resume/retry가 깨진다.
- idempotent archive/cleanup endpoint는 shutdown path에서 필수다.

## Bridge Messaging

`bridgeMessaging.ts`는 transport-level pure helper다.

핵심:

- `isEligibleBridgeMessage()`는 user/assistant/local_command만 bridge로 보낸다. virtual message는 제외한다.
- `extractTitleText()`는 title derivation에 쓸 human-authored user text만 추출한다. meta, tool result, compact summary, non-human origin, display-tag-only content는 제외한다.
- `handleIngressMessage()`는 raw JSON을 parse하고 control response/request와 SDK message를 라우팅한다.
- recent posted UUID는 echo filter다.
- recent inbound UUID는 replay/delivery dedup이다.
- inbound SDK message 중 user message만 local handler로 넘긴다.
- `handleServerControlRequest()`는 server-initiated `initialize`, `set_model`, `set_max_thinking_tokens`, `set_permission_mode`, `interrupt`에 response를 보낸다.
- outbound-only mode는 initialize를 제외한 mutable request에 error response를 보낸다.
- unknown control subtype도 error response를 보낸다.
- `makeResultMessage()`는 archive trigger용 minimal SDK result success를 만든다.
- `BoundedUUIDSet`은 echo/dedup용 bounded ring set이다.

Agentica 적용:

- bridge로 보낼 event는 public history 전체가 아니다. projection/filter layer가 필요하다.
- echo dedup은 UUID 기반 bounded set으로 처리해야 한다.
- server control request는 반드시 response를 가져야 한다.
- outbound-only remote mirror mode는 explicit mode로 둬야 한다.

## Repl Bridge Transport

`replBridgeTransport.ts`는 v1/v2 protocol 차이를 `ReplBridgeTransport`로 감춘다.

공통 interface:

- `write`, `writeBatch`
- `close`
- `isConnectedStatus`, `getStateLabel`
- `setOnData`, `setOnClose`, `setOnConnect`, `connect`
- `getLastSequenceNum`
- `droppedBatchCount`
- `reportState`, `reportMetadata`, `reportDelivery`
- `flush`

v1:

- `HybridTransport`: WebSocket read + POST write to Session-Ingress.
- sequence number는 0으로 고정된다.
- report state/metadata/delivery/flush는 no-op 또는 immediate.

v2:

- `SSETransport`: read stream.
- `CCRClient`: write, heartbeat, state, metadata, delivery.
- write path는 SSE가 아니라 CCR `/worker/*` endpoint다.
- JWT는 session id claim과 worker role이 필요하다. OAuth token으로 대체할 수 없다.
- worker epoch mismatch는 transport close와 poll-loop recovery로 이어진다.
- SSE event delivery는 received와 processed를 모두 report한다. daemon restart 때 같은 prompt가 반복 재전달되는 문제를 막기 위한 tradeoff다.
- `getLastSequenceNum()`을 제공해 transport swap 때 history replay를 피한다.
- outbound-only mode는 SSE read stream을 열지 않고 write/heartbeat만 활성화한다.

Agentica 적용:

- remote transport는 read/write가 같은 protocol이라는 가정을 버려야 한다.
- sequence high-water mark는 resume/reconnect의 핵심 state다.
- delivery ack는 reliability와 duplicate prompt flood 사이의 tradeoff다. Agentica도 remote queue를 도입하면 delivery lifecycle을 명시해야 한다.

## CLI Transport 세부

`cli/transports`는 SDK/remote IO의 wire transport를 여러 구현으로 나눈다.

### Transport selection

`transportUtils.ts` 선택 순서:

1. `CLAUDE_CODE_USE_CCR_V2`가 있으면 `SSETransport`
2. `CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2`가 있으면 `HybridTransport`
3. 그 외에는 `WebSocketTransport`

v2에서 `--sdk-url`은 session URL이고, SSE stream URL은 여기에 `/worker/events/stream`을 붙여 만든다.

### WebSocketTransport

기본 legacy transport다.

- read/write 모두 WebSocket이다.
- Bun native WebSocket과 Node `ws`를 모두 지원한다.
- TLS/proxy option을 runtime별로 적용한다.
- uuid가 있는 outbound message는 circular buffer에 보관한다.
- reconnect 때 `X-Last-Request-Id`와 server confirmation header로 confirmed message를 evict하고, 나머지를 replay한다.
- ping과 data-frame `keep_alive`를 둘 다 쓴다. ping만으로는 일부 proxy idle timeout을 막지 못한다.
- reconnect는 exponential backoff, 10분 budget, sleep/wake detection을 가진다.
- permanent close code는 protocol error/session expired/unauthorized 계열이다. 단 4003은 fresh header를 얻을 수 있으면 재시도한다.
- `autoReconnect=false`면 caller가 poll loop 등 별도 recovery를 담당한다.

### HybridTransport

legacy read는 WebSocket이고 write는 HTTP POST다.

- `stream_event`는 100ms buffer로 모아 POST 수를 줄인다.
- non-stream write는 buffered stream event를 먼저 flush해 ordering을 보장한다.
- 모든 POST는 `SerialBatchEventUploader`를 통해 직렬화한다.
- bridge code가 fire-and-forget write를 많이 하므로 concurrent POST로 Firestore write collision이 생기지 않게 한다.
- 4xx non-429는 permanent drop, 429/5xx/network는 retry다.
- optional max consecutive failure를 넘으면 batch를 drop하고 diagnostic을 남긴다.

### SSETransport

CCR v2 transport다.

- read는 SSE, write는 HTTP POST다.
- read URL에 `from_sequence_num`과 `Last-Event-ID`를 넣어 resume한다.
- SSE frame parser는 `event`, `id`, `data`를 incremental parse한다.
- worker subscriber는 `client_event`만 기대하고, 다른 event type은 diagnostic으로 남기고 drop한다.
- `event.id` sequence number는 duplicate detection과 high-water mark에 쓴다.
- keepalive comment도 liveness reset으로 친다.
- 45초 무소식이면 dead connection으로 보고 reconnect한다.
- reconnect는 exponential backoff와 10분 budget을 가진다.
- write POST는 auth header가 없으면 drop하고, 4xx non-429는 no-retry, 429/5xx는 retry한다.

### SerialBatchEventUploader

ordered uploader primitive다.

- 한 번에 POST 하나만 in-flight다.
- batch size와 byte size를 제한할 수 있다.
- queue가 maxQueueSize를 넘으면 enqueue가 backpressure로 block된다.
- retry는 exponential backoff와 jitter를 쓴다.
- `RetryableError.retryAfterMs`가 있으면 server hint를 clamp/jitter해 사용한다.
- un-serializable item은 queue poison을 막기 위해 drop한다.
- close는 pending enqueue/flush를 깨운다.

### WorkerStateUploader

worker state/metadata update는 event queue와 다르게 다룬다.

- in-flight PUT 하나와 pending patch 하나만 둔다.
- top-level key는 last value wins다.
- `external_metadata`, `internal_metadata`는 RFC 7396식 shallow merge다.
- 실패하면 retry하면서 pending patch를 흡수한다.

### CCRClient

CCR v2 worker lifecycle client다.

- worker epoch를 env 또는 argument에서 읽는다.
- `/worker` PUT으로 idle state를 등록하고 stale pending action/task summary를 지운다.
- heartbeat는 `/worker/heartbeat`로 보낸다.
- 409 epoch mismatch는 newer worker가 자신을 대체했다는 의미다. spawn child에서는 process exit, in-process bridge에서는 graceful close로 다뤄야 한다.
- 401/403은 expired JWT면 즉시 unrecoverable이고, valid-looking token이면 threshold까지 버틴다.
- client events는 `/worker/events`, internal transcript/compaction events는 `/worker/internal-events`, delivery ack는 `/worker/events/delivery`로 분리한다.
- stream text delta는 full-so-far snapshot으로 coalesce한다. mid-stream reconnect client가 fragment만 보지 않게 하기 위해서다.
- internal event reader는 foreground와 subagent transcript를 paginated GET으로 복구한다.

Agentica 적용:

- remote transport는 "read", "client event write", "internal transcript write", "state/metadata write", "delivery ack"를 한 write 함수로 뭉치면 안 된다.
- remote resume에는 sequence high-water mark, last flushed uuid, worker epoch, pending internal event queue depth가 필요하다.
- write durability 정책은 event type별로 다르다. UI stream delta와 transcript internal event는 같은 reliability class가 아니다.
- remote worker state는 last-value coalescing이 맞고, transcript/event는 ordered queue가 맞다.
- retry budget과 permanent failure taxonomy는 public task failure와 분리한다.

## StructuredIO and Print Control Loop

`structuredIO.ts`는 stdin/stdout NDJSON protocol을 SDK control protocol로 감싼다.

핵심:

- input line은 `user`, `control_request`, `control_response`, `assistant`, `system`만 yield한다.
- `keep_alive`는 조용히 무시한다.
- `update_environment_variables`는 process env에 직접 적용한다. bridge child token refresh가 이 경로를 쓴다.
- `control_response`는 pending request를 resolve/reject하고, orphan response는 callback으로 넘긴다.
- permission request는 SDK prompt와 permission hooks를 race한다. hook이 먼저 결정하면 SDK prompt를 `control_cancel_request`로 취소한다.
- duplicate permission response로 같은 tool_use가 다시 실행되지 않게 resolved tool_use id LRU set을 둔다.
- outbound stream은 단일 writer queue다. control request가 queued stream event를 앞지르지 않게 하기 위해서다.

`RemoteIO`는 `StructuredIO` 위에 transport를 붙인다.

- `--sdk-url`이 있으면 `RemoteIO`, 없으면 plain `StructuredIO`다.
- CCR v2면 `CCRClient`를 만들고 internal event writer/reader, session state/metadata listener, command lifecycle listener를 등록한다.
- bridge mode에서는 `control_request`는 stdout에도 echo한다. parent bridge process가 permission request를 감지해야 하기 때문이다.
- debug bridge mode에서는 모든 transport input도 stdout에 echo할 수 있다.
- bridge keepalive는 GrowthBook config의 interval로 보낸다.

`print.ts` control loop:

- stdin reader와 command queue runner가 병렬로 돈다.
- `interrupt`는 abort controller를 abort하고 suggestion state를 정리한다.
- `initialize`는 SDK MCP server placeholder, hooks, JSON schema, SDK agent definitions, system prompt, prompt suggestions를 적용한 뒤 commands/agents/models/account/output style을 response한다.
- `set_permission_mode`, `set_model`, `set_max_thinking_tokens`는 runtime state와 external metadata를 바꾼다.
- `mcp_set_servers`는 process server와 SDK server를 나누고 enterprise MCP policy를 적용한다.
- SDK server는 pending client로 먼저 등록하고 response를 보낸 뒤 update한다. response 전에 handshake를 기다리면 deadlock이 가능하다.
- `reload_plugins`는 active plugin projection을 refresh하고 response data는 best-effort로 수집한다.
- `mcp_reconnect`/`mcp_toggle`은 AppState와 dynamic MCP state를 둘 다 갱신한다.
- auth 관련 internal controls는 OAuth URL, manual callback, clear auth, Claude OAuth flow를 control response로 돌려준다.
- `generate_session_title`와 `side_question`은 stdin loop를 막지 않도록 fire-and-forget으로 response한다.
- orphaned permission response는 unresolved tool_use를 transcript에서 찾아 재-enqueue할 수 있다.

Agentica 적용:

- SDK/RPC stdin loop는 long-running API call 때문에 막히면 안 된다. fire-and-forget control과 blocking control을 구분한다.
- permission response dedup은 tool_use id와 control request id 둘 다 필요하다.
- dynamic connector mutation은 AppState-like registry와 actual selector/tool pool을 같은 boundary에서 갱신해야 한다.
- env patch 같은 process-wide mutation은 public operation이 아니라 trusted control message로만 허용한다.

## REPL Bridge Core

`replBridge.ts`는 always-on `/remote-control` REPL bridge의 core다.

초기화:

- bridge environment를 register한다.
- crash recovery pointer가 있으면 reuseEnvironmentId로 reconnect할 수 있다.
- session은 currentSessionId, environmentId, transport, currentWorkId, currentIngressToken으로 추적한다.
- initial history flush를 지원한다.

work poll:

- background poll loop가 environment work item을 기다린다.
- no work일 때 capacity 상태면 heartbeat-only loop에 들어간다.
- heartbeat fatal은 transport/work state를 비우고 fast-poll로 fresh token/work re-dispatch를 기다린다.
- work secret decode 실패 시 stopWork로 poisoned work를 제거한다.
- work item은 `acknowledgeWork()` 후 `onWorkReceived()`로 넘긴다.
- healthcheck는 ack 후 무시한다.
- environment 404는 최대 3회 re-register를 시도한다.
- 401/403/404/410 fatal은 teardown으로 이어진다.
- transient poll error는 exponential backoff를 적용한다.
- system sleep/wake로 timeout이 크게 밀리면 poll error budget을 reset한다.

transport swap:

- 같은 session work가 다시 오면 fresh token으로 transport를 교체한다.
- foreign session id는 거부한다. prefix가 `session_*`/`cse_*`로 달라도 underlying UUID가 같으면 같은 session으로 본다.
- v1은 OAuth token으로 session ingress에 붙는다.
- v2는 work secret JWT로 CCR v2 `/worker/*`에 붙는다.
- old transport의 sequence high-water mark를 보존해 replay를 줄인다.
- v2 handshake generation counter로 stale async resolver가 transport를 덮지 못하게 한다.

initial flush:

- initial messages는 bridge-eligible message만 보낸다.
- cap을 둔다. 큰 history replay는 persistence와 Firestore pressure를 만든다.
- flush 중 새 message는 `FlushGate`에 queue하여 history와 user prompt interleaving을 막는다.
- writeBatch가 silent drop을 기록하면 flushed UUID로 표시하지 않는다.

handle methods:

- `writeMessages()`는 internal Message를 SDKMessage로 변환하고 session_id를 붙여 보낸다.
- `writeSdkMessages()`는 daemon path에서 SDKMessage를 그대로 보낸다.
- control request/response/cancel request와 result message 송신 method가 분리되어 있다.
- `teardown()`은 result message, archive, transport close, deregister 순서를 관리한다.

Agentica 적용:

- remote bridge는 단순 WebSocket proxy가 아니라 stateful lease/queue/session manager다.
- initial history flush는 context projection 문제와 같다. cap, dedup, flush gate가 필요하다.
- remote reconnect는 task status와 다르다. transport 교체 중인 session은 여전히 running일 수 있다.

## Standalone Bridge Main

`bridgeMain.ts`는 `claude remote-control` standalone/headless bridge loop를 구현한다.

runBridgeLoop state:

- `activeSessions`: session id -> child process handle.
- `sessionWorkIds`: session id -> work id.
- `sessionIngressTokens`: heartbeat auth JWT.
- `sessionCompatIds`: `cse_*`와 `session_*` compat id를 안정적으로 매핑.
- `sessionTimers`: per-session timeout.
- `completedWorkIds`: duplicate redelivery 방지.
- `sessionWorktrees`: worktree cleanup state.
- `timedOutSessions`, `titledSessions`.
- `capacityWake`: session completion 시 at-capacity sleep을 깨운다.

multi-session:

- capacity가 다 차면 heartbeat loop로 lease만 유지한다.
- auth failed heartbeat는 `reconnectSession()`으로 server re-dispatch를 유도한다.
- existing session work가 다시 오면 child process에 fresh token을 stdin으로 전달한다.
- new session은 capacity가 있을 때만 spawn한다.
- worktree mode에서는 on-demand session마다 isolated git worktree를 만든다.
- same-dir mode는 cwd를 공유하므로 stomp risk가 있다.
- single-session mode는 session completion이 bridge teardown으로 이어진다.

child spawn:

- v2 session이면 `registerWorker()`로 worker epoch를 얻고 child에 `CLAUDE_CODE_USE_CCR_V2`, `CLAUDE_CODE_WORKER_EPOCH`를 넣는다.
- v1 session이면 Session-Ingress SDK URL을 준다.
- child CLI는 `--print --sdk-url ... --session-id ... --input-format stream-json --output-format stream-json --replay-user-messages`로 실행된다.
- OAuth token은 child env에서 제거하고 session access token을 쓴다.
- stdout NDJSON에서 activities와 permission requests를 읽는다.
- stderr ring buffer를 유지해 failure diagnostics로 사용한다.
- child stdin으로 fresh access token update를 보낼 수 있다.

session completion:

- completed/failed는 `stopWork` cleanup을 예약한다.
- interrupted는 server/shutdown initiated로 보고 stopWork를 스킵할 수 있다.
- multi-session mode에서는 completed session을 archive하고 bridge는 idle로 돌아간다.
- single-session mode에서는 poll loop를 abort한다.
- worktree cleanup은 async cleanup set에서 추적한다.

headless:

- `runBridgeHeadless()`는 TUI/readline 없이 config와 IPC auth로 동작한다.
- workspace trust, HTTPS/localhost, worktree availability를 preflight한다.
- environment register 후 optional initial session을 만들고 `runBridgeLoop()`로 들어간다.

Agentica 적용:

- remote execution을 하려면 session manager가 capacity, workspace isolation, token refresh, process lifecycle, cleanup을 모두 갖춰야 한다.
- same-dir concurrent writes는 위험하다. Agentica에 remote multi-session을 넣는다면 read-only 병렬과 write worktree isolation을 분리해야 한다.
- headless adapter는 public API 안정화 전 실험용으로 적합하다. TUI/UX와 분리해야 한다.

## Bridge UI and Status Renderer

`bridgeUI.ts`와 `bridgeStatusUtil.ts`는 remote-control CLI 표면을 별도 logger interface로 격리한다.

BridgeLogger responsibilities:

- banner와 environment/session URL 출력
- live status line render/clear
- QR code toggle
- idle/attached/titled/reconnecting/failed state render
- multi-session capacity와 per-session bullet list render
- per-session activity summary render
- session title update
- headless logger adapter

상태:

- `idle`: Ready, environment connect URL
- `attached`: Connected, active session URL 또는 multi-session list
- `titled`: single-session에서 generated title을 main status로 표시
- `reconnecting`: spinner, retry delay, disconnected elapsed
- `failed`: permanent failure footer와 error

UI 세부:

- QR code는 `qrcode` utf8 output이고 space key로 표시/숨김을 toggle한다.
- `w` key는 가능할 때만 `same-dir`/`worktree` spawn mode를 toggle하고 project config에 저장한다.
- status block은 terminal visual line count를 계산해 cursor up + erase로 redraw한다.
- OSC 8 hyperlink로 session/environment URL을 terminal link로 만든다.
- multi-session은 capacity line과 session bullet list를 표시한다.
- tool activity는 최근 `tool_start` summary를 30초 동안만 표시한다.
- headless mode는 live UI 대신 line log adapter를 쓴다.

Agentica 적용:

- remote runtime status와 user-facing renderer는 분리한다.
- TUI-only QR/status/keyboard shortcut은 core event가 아니다.
- remote status event를 public API로 열더라도 `idle/connected/reconnecting/failed` 같은 coarse state와 diagnostic marker만 제공한다.
- workspace isolation toggle은 UI preference가 아니라 runtime concurrency policy change다.

## Env-less CCR v2 Bridge

`remoteBridgeCore.ts`는 environments API 없이 CCR v2 code-session에 직접 bridge하는 경로다.

protocol:

1. `POST /v1/code/sessions`로 `cse_*` session을 만든다.
2. `POST /v1/code/sessions/{id}/bridge`로 worker JWT, expires_in, api_base_url, worker_epoch를 받는다.
3. `createV2ReplTransport()`로 SSE read + CCRClient write transport를 만든다.

특징:

- register/poll/ack/stop/heartbeat/deregister environment lifecycle이 없다.
- `/bridge` 호출 자체가 worker epoch bump/register다.
- JWT refresh는 `/bridge`를 다시 호출해 transport를 rebuild한다.
- initial history flush는 fresh server session이라 double-post risk가 작다.
- permission prompt 중에는 `reportState('requires_action')` 같은 worker state reporting이 가능하다.
- teardown은 result message, flush/archive timeout, transport close를 관리한다.
- archive는 compat layer `/v1/sessions/{session_*}/archive`를 사용하므로 `cse_*`를 `session_*`로 retag한다.

Agentica 적용:

- remote runtime에는 "environment/work queue" 방식과 "direct code-session" 방식이 별도 adapter로 공존할 수 있다.
- v2처럼 session-native API가 있으면 environment queue보다 단순하다. 다만 worker credential/epoch/refresh가 핵심 state가 된다.
- credential refresh는 background timer와 transport rebuild를 포함한다.

## Session API

`createSession.ts`와 `codeSessionApi.ts`는 session 생성/조회/archive/title update를 담당한다.

v1 bridge session:

- `POST /v1/sessions`에 environment id, events, session context, git sources/outcomes, model, permission mode를 보낸다.
- session creation failure는 non-fatal null로 돌아올 수 있다.
- fetch는 session의 environment id와 title을 얻어 resume에 쓴다.
- archive는 explicit client action이다. server가 자동 archive하지 않는다는 가정이 코드에 있다.
- title update는 `session_*` compat id를 사용한다.

v2 code session:

- `POST /v1/code/sessions`는 `bridge: {}` marker를 요구한다.
- response session id는 `cse_*`여야 한다.
- `POST /v1/code/sessions/{id}/bridge`는 worker JWT, api base URL, expires_in, worker_epoch를 반환한다.
- worker epoch는 string/number 모두 올 수 있어 safe integer로 검증한다.

Agentica 적용:

- session creation과 worker credential issuance를 분리해야 한다.
- resume에는 session id만으로 부족하고 environment id/title/cwd/permission mode가 필요할 수 있다.
- id prefix compatibility를 adapter boundary에서 처리해야 한다.

## Inbound Messages and Attachments

`inboundMessages.ts`:

- inbound SDK user message에서 content와 uuid를 추출한다.
- image block의 `mediaType` camelCase를 `media_type` snake_case로 normalize한다.
- malformed image block이 session 전체 API call을 망가뜨리지 않게 한다.

`inboundAttachments.ts`:

- web composer `file_uuid` attachments를 OAuth API에서 내려받는다.
- `~/.claude/uploads/{sessionId}` 아래에 저장한다.
- file name은 basename + safe chars만 허용한다.
- 실패는 best-effort skip이다. message 자체는 계속 전달된다.
- resolved file은 `@"path"` refs로 prompt 앞에 붙인다.
- array content에서는 마지막 text block에 prefix를 붙인다. processing path가 마지막 text block을 읽기 때문이다.

Agentica 적용:

- remote UI에서 오는 file/blob attachment는 core prompt text가 아니라 adapter-resolved artifact reference로 다뤄야 한다.
- attachment resolution failure는 user prompt 전체 실패로 만들지 않는 편이 좋다.
- file name/path는 network-origin input이므로 sanitize가 필수다.

## Crash Recovery and Entitlement

`bridgePointer.ts`:

- bridge session crash recovery pointer를 project-scoped file로 저장한다.
- pointer는 session id, environment id, source를 가진다.
- TTL은 4시간이고 staleness는 embedded timestamp가 아니라 file mtime으로 판단한다.
- long session 중 같은 pointer를 rewrite해 mtime을 refresh한다.
- corrupted/stale pointer는 삭제된다.
- worktree-aware read는 sibling worktree pointer까지 fanout할 수 있다.

`bridgeEnabled.ts`:

- bridge mode는 build feature flag와 claude.ai subscriber entitlement가 필요하다.
- full-scope profile token이 없으면 bridge eligibility를 판단하기 어렵다.
- env-less v2 bridge는 별도 GrowthBook gate다.
- `cse_*` -> `session_*` retag shim도 gate로 둔다.

Agentica 적용:

- durable remote session resume은 sidecar pointer와 TTL/mtime refresh가 필요하다.
- entitlement/auth failure 메시지는 구체적이어야 한다. "not enabled"와 "token scope 부족"은 다르다.
- compatibility shim은 runtime gate로 격리해야 한다.

## Agentica 설계 결론

Claude Code remote/bridge/server에서 Agentica가 가져올 핵심은 remote transport 자체보다 public surface 격리다.

필수 internal type 초안:

```ts
interface AgenticaRemoteSessionState {
  id: string;
  transport: "websocket" | "sse-ccr" | "direct";
  status: "connecting" | "connected" | "reconnecting" | "detached" | "closed" | "failed";
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

```ts
interface AgenticaRemoteMessageAdapter {
  toModelNotification(event: unknown): AgenticaRuntimeNotification | undefined;
  toHistoryMarker(event: unknown): AgenticaHistory | undefined;
  toClientEvent(event: unknown): AgenticaRuntimeEvent | undefined;
}
```

도입 원칙:

- `MicroAgentica`에는 연결하지 않는다.
- remote runtime은 `Agentica` internal adapter로 시작한다.
- SDK/remote event를 core history/event와 1:1로 매핑하지 않는다.
- permission prompt는 pending interaction으로 둔다.
- interrupt/stop은 runtime control transition으로 둔다.
- reconnect/heartbeat/auth refresh는 task failure가 아니다.
- remote result/progress/status는 projection policy를 거쳐야 한다.
- workspace isolation 없이 same-dir remote write 병렬화를 기본값으로 열지 않는다.
- public SDK/RPC control schema와 internal remote control subtype은 분리한다.
- transport close/reconnect와 worker epoch mismatch는 같은 failure가 아니다.
- client-visible event와 internal transcript event의 persistence policy를 분리한다.

## Agentica 단계별 반영안

1. `AgenticaRemoteSessionState`를 `AgenticaRuntimeState`의 optional internal field로 둔다.
2. RPC/chat public API에는 remote session event를 바로 노출하지 않는다.
3. remote/direct adapter가 필요하면 `AgenticaRemoteTransport` interface부터 만든다.
4. remote permission request를 existing call listener에 섞지 않고 interaction callback으로 분리한다.
5. reconnect/heartbeat/sequence/flush state를 sidecar로 저장할 수 있게 adapter hook을 둔다.
6. worktree isolation이 준비되기 전에는 remote write 병렬화를 experimental로도 열지 않는다.
7. public `stopTask`/`interrupt`는 task runtime 안정화 후 별도 opt-in API로 연다.

## 남은 확인점

- SDK schema 중 `print.ts`의 feature/internal control subtype은 public generator schema와 차이가 있다. 공개할 때는 public schema와 internal schema를 별도 감사해야 한다.
- Agentica의 `packages/rpc`가 remote session을 실제로 품으려면 WebSocket/RPC streaming semantics 추가 독해가 더 필요하다.

## Remote Bridge Core 추가 독해

`remoteBridgeCore.ts`, `jwtUtils.ts`, `pollConfig.ts`, `pollConfigDefaults.ts`를 추가로 확인했다.

확인한 핵심:

- env-less bridge는 `/v1/code/sessions`로 session을 만들고 `/bridge`에서 worker JWT, expiry, api base url, worker epoch를 받는다.
- `/bridge` 재호출은 epoch를 올리므로 JWT만 교체하면 안 된다. refresh와 401 recovery 모두 transport를 새 epoch로 rebuild한다.
- token refresh scheduler는 expiry claim 또는 `expires_in` 기반으로 refresh timer를 걸고, generation counter로 stale async refresh를 버린다.
- proactive refresh와 SSE 401 recovery는 `authRecoveryInFlight`로 single-winner 처리한다. laptop wake 때 두 경로가 동시에 `/bridge`를 때리면 double epoch bump로 stale transport가 생기기 때문이다.
- transport rebuild 동안 `FlushGate`가 live writes를 queue한다. old epoch transport에 write하면 UUID dedup만 먹고 실제 upload가 no-op 될 수 있다.
- initial history flush는 cap을 두고 eligible message만 SDK event로 변환한다. echo dedup은 initial uuid set과 bounded recent uuid set을 함께 쓴다.
- teardown은 result write를 먼저 enqueue하고 archive를 시도한 뒤 close한다. archive가 401이면 OAuth refresh를 한 번 시도한다.
- poll config는 GrowthBook dynamic config를 Zod로 검증하고 하나라도 잘못되면 default 전체로 fallback한다. at-capacity liveness는 heartbeat 또는 poll interval 중 하나가 반드시 있어야 한다.
- poll defaults는 "seek work" latency와 "at capacity liveness"를 분리한다. at-capacity poll은 heartbeat와 독립적으로 동작할 수 있다.

Agentica 적용:

- remote token refresh는 connector auth refresh와 비슷하지만, worker epoch/sequence/write gate가 추가된 별도 runtime state다.
- refresh/reconnect 중 write는 drop/queue 정책을 명시해야 한다. UUID dedup을 먼저 기록하고 upload가 실패하는 silent loss를 막아야 한다.
- dynamic runtime config는 partial trust보다 schema-validated all-or-default가 안전하다.
- poll/heartbeat는 liveness mechanism이지 model-visible event가 아니다.
