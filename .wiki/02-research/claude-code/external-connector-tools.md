# Claude Code External Connector Tools 분석

## 범위

이 문서는 Claude Code의 Web, MCP, remote trigger, scheduled cron 계열 도구를 정리한다.

읽은 주요 파일:

- `/home/samchon/github/samchon/claude-code/src/tools/WebFetchTool/WebFetchTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/WebFetchTool/utils.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/WebFetchTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/WebSearchTool/WebSearchTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/WebSearchTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/MCPTool/MCPTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ListMcpResourcesTool/ListMcpResourcesTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ReadMcpResourceTool/ReadMcpResourceTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/McpAuthTool/McpAuthTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ScheduleCronTool/CronCreateTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ScheduleCronTool/CronDeleteTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ScheduleCronTool/CronListTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ScheduleCronTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/RemoteTriggerTool/RemoteTriggerTool.ts`

## MCPTool

`MCPTool` 자체는 placeholder에 가깝다. 실제 이름, 설명, prompt, call은 MCP client layer에서 override된다.

기본 특성:

- `isMcp: true`.
- open world false.
- input schema는 passthrough.
- permission은 `passthrough`.
- result truncation은 terminal output truncation marker로 판정한다.

Agentica 적용점:

- MCP operation도 Agentica native operation과 같은 metadata envelope에 넣되, schema와 call implementation은 connector layer에서 동적으로 공급될 수 있어야 한다.
- “MCP라서 무조건 허용”이 아니라 permission passthrough/gate를 명시해야 한다.

## ListMcpResourcesTool

MCP resources listing은 read-only/concurrency-safe tool이다.

동작:

- optional `server`로 특정 MCP 서버만 필터링한다.
- 서버가 없으면 사용 가능한 서버명을 포함해 에러를 낸다.
- connected client만 처리한다.
- `ensureConnectedClient`로 reconnect를 시도한다.
- `fetchResourcesForClient`는 server-name 기반 LRU cache를 사용하고 startup prefetch, onclose, `resources/list_changed` notification으로 stale을 줄인다.
- 한 서버 reconnect 실패가 전체 결과를 망치지 않도록 빈 배열로 복구하고 MCP error log를 남긴다.

Agentica 적용점:

- connector resource listing은 전체 실패보다 partial success가 낫다.
- resource index는 operation selector의 후보 소스로 쓸 수 있지만, stale invalidation 규칙이 있어야 한다.

## ReadMcpResourceTool

MCP resource read도 read-only/concurrency-safe tool이다.

검증/실행:

- server와 uri가 필수다.
- server 존재, connected 상태, resources capability를 확인한다.
- `resources/read` request를 보낸다.
- text content는 inline으로 반환한다.
- blob content는 base64를 context에 직접 넣지 않고 raw bytes를 disk에 저장한 뒤 `blobSavedTo` path와 안내 text로 치환한다.

Agentica 적용점:

- binary/blob result는 절대 그대로 history에 넣으면 안 된다.
- result projection은 `text inline`, `binary reference`, `error text`를 분리해야 한다.

## McpAuthTool

MCP auth tool은 인증이 필요한 서버를 real tool 대신 pseudo-tool로 노출한다.

동작:

- `mcp__<server>__authenticate` 형태로 tool name을 만든다.
- claude.ai proxy는 이 tool에서 직접 처리하지 않고 `/mcp`로 안내한다.
- sse/http transport만 OAuth flow를 시작한다.
- `skipBrowserOpen`으로 authorization URL을 받아 모델 결과로 돌려준다.
- OAuth callback이 끝나면 background에서 auth cache를 clear하고 server reconnect를 수행한다.
- prefix 기반 replacement로 pseudo-tool을 제거하고 실제 tools/commands/resources를 AppState에 넣는다.

Agentica 적용점:

- connector auth는 “도구 호출 실패”가 아니라 pseudo-operation으로 모델에게 노출할 수 있다.
- 인증 완료 후 operation registry를 hot-swap할 수 있어야 한다.

## WebFetchTool

`WebFetch`는 URL fetch와 secondary model summarization을 결합한다.

permission:

- host/path preapproved list면 auto allow.
- permission rule content는 `domain:<hostname>`.
- deny, ask, allow rule 순서로 검사한다.
- allow suggestion은 local settings rule로 제안한다.

validation과 prompt:

- URL parse 실패를 validation error로 돌려준다.
- prompt에는 authenticated/private URL에 실패한다는 경고가 항상 포함된다.
- MCP-provided authenticated web fetch tool이 있으면 그쪽을 우선하라고 안내한다.
- GitHub URL은 `gh` CLI 사용을 선호하라고 안내한다.

fetch 안전 장치:

- URL 최대 길이 2000.
- username/password 포함 URL 금지.
- public resolvable hostname 형태만 허용한다.
- HTTP는 HTTPS로 upgrade한다.
- domain preflight blocklist를 Anthropic API로 확인하고 allowed만 5분 cache한다.
- main fetch timeout은 60초.
- HTTP content length는 10MB.
- same-host redirect만 자동 follow한다. host가 바뀌면 redirect 정보를 반환하고 재호출을 요구한다.
- redirect hop은 10회 제한.
- egress proxy block 403을 별도 error로 감지한다.
- URL content cache는 15분 TTL, 50MB LRU다.

content 처리:

- HTML은 lazy-loaded Turndown으로 markdown 변환한다.
- binary content type은 raw bytes를 disk에 저장하고 path를 result에 덧붙인다.
- markdown이 100k chars보다 크면 secondary model prompt에서 잘라낸다.
- preapproved markdown이고 100k보다 작으면 secondary model 없이 원문을 반환한다.
- 그 외에는 Haiku에 prompt를 적용해 요약/추출한다.

Agentica 적용점:

- 외부 fetch는 permission, domain safety, redirect policy, cache, binary persistence가 한 묶음이다.
- Agentica connector가 URL을 다루는 경우 operation metadata에 `externalNetwork`, `domainRule`, `maxBytes`, `redirectPolicy`가 필요하다.

## WebSearchTool

`WebSearch`는 Anthropic server-side `web_search_20250305` tool을 감싸는 tool이다.

enablement:

- firstParty provider는 활성화.
- Vertex는 Claude 4 계열 모델명일 때 활성화.
- Foundry는 활성화.
- 그 외는 비활성화.

입력/검증:

- `query`는 최소 2 chars.
- `allowed_domains`와 `blocked_domains`를 동시에 지정할 수 없다.
- server-side web_search max uses는 8로 고정된다.

실행:

- 내부적으로 새 user message를 만들어 web search 전용 query를 수행한다.
- feature flag에 따라 small fast model을 쓰거나 main loop model을 쓴다.
- streaming event에서 `server_tool_use` partial JSON을 보고 실제 검색 query를 progress로 뽑는다.
- `web_search_tool_result`가 오면 result count와 query를 progress로 보낸다.
- final result는 text summary와 links 배열을 섞어 tool result로 포맷한다.
- tool result 끝에 sources를 반드시 사용자 응답에 포함하라는 reminder를 붙인다.

Agentica 적용점:

- 외부 검색은 normal operation과 다르게 server-side tool schema를 추가하는 special call일 수 있다.
- 검색 결과는 링크 source attribution을 downstream answer policy로 강제해야 한다.

## RemoteTriggerTool

`RemoteTrigger`는 claude.ai remote agent trigger API를 관리한다.

조건:

- GrowthBook gate와 `allow_remote_sessions` policy가 모두 필요하다.
- action은 `list`, `get`, `create`, `update`, `run`.
- `list/get`만 read-only다.

실행:

- OAuth token refresh를 먼저 수행한다.
- claude.ai access token과 organization UUID가 필요하다.
- `/v1/code/triggers` API를 beta header와 organization header로 호출한다.
- timeout은 20초.
- status와 JSON string을 반환한다.

Agentica 적용점:

- 원격 trigger는 local runtime이 아니라 account/org-scoped remote control plane operation이다.
- read/write classification은 action별로 달라야 한다.
- auth/org context는 runtime-only argument로 executor가 주입해야 한다.

## Schedule Cron Tools

Cron 계열은 session scheduler와 durable task file을 모두 지원한다.

공통 gate:

- build-time `AGENT_TRIGGERS`와 runtime `tengu_kairos_cron` gate가 모두 맞아야 한다.
- `CLAUDE_CODE_DISABLE_CRON`은 local kill switch다.
- durable cron은 별도 `tengu_kairos_cron_durable` gate를 가진다.

`CronCreate`:

- 표준 5-field cron expression을 local timezone으로 받는다.
- `prompt`, `recurring`, `durable`을 받는다.
- cron parse 실패, 다음 1년 안에 매치 없음, max 50 jobs 초과를 validation에서 막는다.
- teammate context에서는 durable cron을 금지한다.
- durable gate가 꺼지면 call 시점에 session-only로 강제한다.
- task를 추가한 뒤 scheduler enable flag를 켠다.
- recurring task는 기본 30일 후 auto-expire된다.

prompt 전략:

- one-shot은 minute/hour/day/month를 pin하고 `recurring: false`로 만든다.
- recurring은 “every N minutes/hour/weekdays”류에 사용한다.
- 가능한 경우 `:00`과 `:30` minute mark를 피하라고 강하게 안내한다.
- runtime은 idle일 때만 fire하며 jitter가 붙는다.

`CronList`:

- read-only/concurrency-safe.
- team lead는 전체를 보고 teammate는 자기 agentId의 cron만 본다.
- output은 id, human schedule, recurring/session-only marker, prompt preview다.

`CronDelete`:

- id가 존재해야 한다.
- teammate는 자기 cron만 삭제할 수 있다.
- durable file 또는 in-memory store에서 제거한다.

Agentica 적용점:

- scheduled operation은 history가 아니라 runtime scheduler state다.
- durable과 session-only를 명시해야 한다.
- team/sub-agent ownership이 있으면 visibility와 delete 권한이 달라진다.
- 반복 task는 auto-expiry와 jitter 정책이 있어야 장기 리소스를 통제할 수 있다.

## Agentica 설계 결론

1. 외부 connector는 read/write/destructive 이상의 metadata가 필요하다. `externalNetwork`, `authRequired`, `remoteControlPlane`, `binaryResult`, `sourceAttributionRequired` 같은 축을 둔다.
2. MCP/Web/Remote/Schedule은 모두 “operation registry가 runtime 중 변할 수 있다”는 전제를 공유한다.
3. binary/large result는 reference로 저장하고 model-facing projection은 짧게 유지한다.
4. scheduled/remote operation은 immediate function call과 별도 transition으로 다뤄야 한다.
5. Agentica core에는 DBMS 없이 local registry와 in-memory/durable adapter hook을 먼저 두고, provider-specific storage는 외부 adapter로 밀어낸다.
