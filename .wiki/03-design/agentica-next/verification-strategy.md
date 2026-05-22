# Agentica Next 검증 전략

## 목표

Agentica 강화 작업은 selector, context projection, compact, runtime loop, public surface를 건드릴 수 있다. 기존 LLM e2e만으로는 회귀를 빠르게 잡기 어렵다. 이 문서는 구현 전 세션이 따라야 할 검증 전략이다.

`MicroAgentica`는 변경하지 않는다. 다만 regression test는 계속 실행한다.

## 검증 계층

| 계층 | 목적 | 실행 조건 |
| --- | --- | --- |
| deterministic unit | tokenizer, scorer, projector, state transition, compact policy의 불변식 검증 | API key 불필요 |
| package type/build | workspace 타입 계약과 export surface 검증 | API key 불필요 |
| focused e2e | base event, streaming, validate correction, RPC ordering 검증 | `CHATGPT_API_KEY` 필요 |
| benchmark | selector/call 품질과 token/time trend 확인 | API key 및 외부 shopping backend 필요 |
| optional vector comparison | 기존 `@agentica/vector-selector` 대비 local/hybrid selector 품질 비교 | connector-hive/Cohere 등 선택 의존성 |

## 구현 Phase별 필수 게이트

### Phase 1: Local Operation Index

필수 unit test:

- controller/function/name/description/parameter/path/tag tokenization
- camelCase, snake_case, path segment split
- exact name/prefix/path/method 가중치
- `select:<operationKey>` direct selection과 comma-separated multi-select
- `+required` term pre-filter가 name/description/searchHint/schema field 전체에 적용되는지
- curated `searchHint` match가 description-only match보다 높은 점수를 받는지
- already-loaded/always-load operation을 select해도 retry churn 없이 no-op success 처리되는지
- top-K 정렬 안정성
- operation key 충돌 감지
- no DBMS/no network path
- registry version 또는 operation key set 변경 시 index/description/token-estimate cache invalidation
- pending connector/operation registry가 있을 때 no-match result가 hard failure가 아니라 retryable state로 남는지
- unavailable operation reference가 projection에서 제거되고 validation retry reason으로 남는지
- provider-native deferred schema 미지원 환경에서 pre-call top-K/full-schema projection fallback
- `auto` selector mode의 token-count threshold와 character heuristic fallback
- deferred/hidden operation full schema가 선택 전 model-facing request에 누출되지 않는지
- compact boundary 이후 selected/discovered operation state 복원
- `MicroAgentica`가 local selector state 없이 기존 full schema direct path를 유지하는지

기존 benchmark 재사용:

- `AgenticaSelectBenchmark`에 local selector adapter를 넣어 shopping scenario 성공률 비교
- plain LLM selector, local-only, hybrid selector를 같은 scenario/repeat로 비교

합격 기준 초안:

- deterministic unit은 100% 통과
- local-only는 후보 recall을 우선한다. 정확한 최종 선택은 hybrid가 담당해도 된다.
- hybrid는 plain selector 대비 token input 감소를 보여야 한다.

### Phase 2: Selector Runtime Integration

필수 unit/e2e:

- existing `orchestrate.select` fallback 유지
- custom `config.executor.select`와 새 selector config 충돌 정책
- hallucinated function name validation 유지
- `select` event/history shape 유지
- `call` listener argument override 영향 없음

기존 tests:

```bash
pnpm --filter @agentica/test start --include base_event base_work validate_correction
pnpm --filter @agentica/test start --include benchmark_select
```

실제 명령은 repo scripts 확인 후 조정한다. 위 명령은 test runner의 include filter 구조를 따른 후보 명령이다.

### Phase 3: Context Projector와 Result Budget

필수 unit test:

- full `AgenticaHistory[]`에서 model-facing messages 생성
- execute result preview/reference projection
- OpenAI tool call/result pairing 유지
- failed validation feedback 유지
- describe history가 model-facing request에 들어가지 않는 기존 의미 유지
- compact marker/systemMessage가 projection에서 올바른 위치에 들어가는지

기존 e2e:

- `test_base_streaming`
- `test_base_streaming_describe`
- `test_call_streaming_base`
- `test_select_streaming_base`
- `test_validate_correction`

추가 e2e:

- 큰 execute result를 반환하는 class controller
- result budget 적용 후 다음 turn에서 model request가 prompt-too-long 없이 진행되는지

### Phase 4: Compact

필수 unit test:

- threshold 계산
- auto compact circuit breaker
- compact request tool calling 금지
- summary message formatting
- compact boundary metadata 생성
- boundary 이후 projection
- preserved history id와 summarized history id 기록
- prompt-too-long retry가 operation/API round 단위로 안전하게 절단

필수 e2e:

- manual compact 후 다음 user turn이 이어지는지
- reactive prompt-too-long mock/fake vendor test
- compact marker가 history/report/chat에서 과도하게 노출되지 않는지
- RPC event surface가 기존 listener를 깨지 않는지

주의:

- compact 1차는 `systemMessage` marker + internal runtime state로 시작한다.
- structured compact history/event는 별도 phase에서 검증한다.

### Phase 4A: Runtime Command Surface

필수 unit test:

- command registry가 prompt/local/interactive UI command를 분리하는지
- noninteractive adapter가 지원 command만 남기는지
- remote/RPC bridge local command allowlist가 기본 차단으로 동작하는지
- remote mode safe command set과 remote-control bridge inbound safe command set을 서로 다른 allowlist로 검증하는지
- local command `text`, `skip`, `compact`, `diagnostic` result가 서로 다른 transcript 정책을 적용하는지
- side question command가 main history에 assistant/user turn을 append하지 않고 fork/side-query preview로만 표시되는지
- local machine mutation command가 backup/restore 또는 exclusive create 실패를 audit하고 public history에 local path/token/QR을 과도하게 노출하지 않는지
- manual compact command가 일반 user message append가 아니라 compact transaction으로 commit되는지
- clear/resume/branch/rewind command가 session/history transaction으로 처리되고 user text append로 떨어지지 않는지
- prompt workflow command의 allowed operation override가 command invocation 뒤에 남지 않는지
- permission/mode/sandbox command가 typed policy update와 audit record를 남기는지
- model/fast/effort/advisor/login/logout command가 projector/selector/cache invalidation을 trigger하는지
- skills/agents/tasks command가 capability/agent/task registry projection으로 처리되고 model context append가 되지 않는지
- MCP enable/disable/reconnect command가 connector registry version bump와 reconnect transition으로 반영되는지
- media input/voice command가 device permission/dependency failure를 typed adapter result로 반환하고 normal model validation failure로 오분류되지 않는지
- adapter intent command가 editor/browser/clipboard/local path를 public history에 노출하지 않는지
- context diagnostics가 raw history가 아니라 projected model request를 기준으로 token/category를 계산하는지
- memory edit command가 core model loop를 직접 변경하지 않고 cache invalidation/control marker만 남기는지

필수 compatibility test:

- command stdout, hidden meta message, editor path, memory file path가 public history/RPC event에 과도하게 노출되지 않는지
- GitHub/web setup token, Chrome extension URL/state, mobile/desktop QR/URL, terminal preference path가 model-facing context에 들어가지 않는지
- command execution 실패가 function call validation 실패로 오분류되지 않는지
- headless mode에서 interactive UI command가 실행되지 않는지
- `MicroAgentica` event/history flow가 변하지 않는지

### Phase 4B: Chat Adapter Compatibility

필수 unit/component test:

- `systemMessage` compact marker가 짧게 렌더링되고 internal metadata를 노출하지 않는지
- 새 structured compact history type을 도입하는 phase에서는 `AgenticaChatMessageMovie`가 명시적으로 처리하는지
- large execute result가 full JSON card로 무제한 렌더링되지 않고 preview/reference contract를 따르는지
- top-level `execute` 숨김과 `describe.executes` 접힘 동작이 기존 호환성을 유지하는지
- `validate`/`jsonParseError` diagnostic을 추가할 경우 기존 final-only message ordering을 깨지 않는지
- token usage side panel이 vendor/model price estimate와 token count를 혼동하지 않는지

필수 example regression:

- BBS example은 `MicroAgentica` 경로로 기존처럼 동작해야 한다.
- Shopping example은 OpenAPI/HTTP controller와 large result preview/reference를 검증한다.
- Uploader example은 arbitrary OpenAPI document와 headers JSON path에서 selector/result budget이 깨지지 않는지 확인한다.

### Phase 4F: Render Projection/UI Adapter Compatibility

Claude Code UI adapter 분석 결과, chat renderer는 public history를 단순 map하는 계층으로 두면 compact/result budget/task marker를 안전하게 받기 어렵다.

필수 unit/component test:

- 같은 `AgenticaHistory[]`에서 model context projection과 render projection이 서로 다르게 나올 수 있는지
- compact boundary 이후 model context는 잘리지만 UI transcript 정책은 별도로 적용되는지
- `systemMessage` compact marker가 짧게 렌더링되고 summary 전문/metadata를 노출하지 않는지
- large execute result가 full JSON code block으로 무제한 출력되지 않고 preview/reference contract를 따르는지
- render row id가 append, compact, collapse/expand 뒤에도 안정적인지
- render cap이 count 기반으로 흔들리지 않고 UUID+index anchor fallback으로 안정적인지
- grouping/collapse/brief filter 변경 후에도 selected row, unseen divider, function stack row가 remount/중복/누락되지 않는지
- streaming operation row가 deterministic id를 가져 React key remount를 만들지 않는지
- static row memoization이 streaming/unresolved/latest-output/thinking/width 변화에서는 풀리고, 확실한 static row에서만 적용되는지
- row component가 full renderable array를 prop으로 받지 않아 historical arrays를 pin하지 않는지
- operation selection/cancel/function stack 재구성이 render projection 도입 후에도 유지되는지
- search text extractor가 renderer visible text와 drift하지 않는지
- search/current-match/selection overlay가 canonical history나 model projection을 mutate하지 않는지
- wide char, emoji, grapheme cluster, soft-wrap row, no-select gutter가 copy/search projection에서 어긋나지 않는지
- terminal adapter를 추가하는 경우 bracketed paste, terminal response, SGR mouse, scroll delta가 public history/RPC event에 섞이지 않는지
- prompt input paste/image reference가 public history text에 과도하게 들어가지 않는지
- transcript/plain-text export renderer가 markdown/card renderer와 다른 projection을 써도 누락/중복이 없는지
- final-only chat listener가 새 optional runtime listener 추가 후에도 기존 ordering을 유지하는지

필수 compatibility test:

- adapter cursor/scroll/search/clipboard/editor path가 public history/RPC event에 노출되지 않는지
- headless/RPC adapter가 interactive-only UI state를 요구하지 않는지
- `MicroAgentica` chat path가 render projection 도입 후에도 selector/compact/task state 없이 동작하는지

### Phase 4C: Test Harness Compatibility

필수 확인:

- `test/src/features` 자동 e2e와 `test/src/cli`, `test/src/examples` manual harness를 구분한다.
- `cli/index.ts` shopping flow는 external swagger/backend/API key 의존성을 명시하고 optional/manual gate로 둔다.
- `cli/micro.ts`와 `examples/websearch.ts`는 `MicroAgentica` 비변경 수동 회귀 표면으로 유지한다.
- RPC WebSocket examples의 partial listener object가 새 optional listener 추가 후에도 깨지지 않는지 확인한다.
- `BbsArticleService` fixture의 UUID/date-time/image URI/partial DTO/void return 성격을 deterministic schema/projection test로 재사용한다.
- result preview/reference 도입 후 CLI execute log가 full value를 기대하는지, reference를 기대하는지 compatibility 정책을 정한다.

### Phase 4D: Scaffold/Template Compatibility

필수 unit/integration test:

- `agentica start --project` choices가 지원 template과 일치하는지
- standalone/nodejs/nestjs/react/react-native/combined template 모두 `.env`와 generated code가 맞는지
- connector codegen이 selected connector의 import/controller code를 안정적으로 삽입하는지
- template placeholder가 바뀌면 테스트가 실패하는지
- runtime/selector/compact config를 scaffold에 노출할 경우 server/client template 주입 위치가 분리되는지
- `.env` value escaping, duplicate key, optional secret 입력 정책이 명시되어 있는지
- `create-agentica` alias가 `agentica` CLI와 같은 command surface를 유지하는지

필수 compatibility test:

- 기존 BbsArticleService 기본 template 제거/유지 정책이 connector 선택 여부에 따라 그대로 동작하는지
- `react` template은 connector 선택을 건너뛰는 현재 UX가 유지되는지 또는 변경 시 명시적으로 migration되는지
- combined templates가 server/client directory를 모두 생성하고 각각 필요한 env만 갖는지
- `MicroAgentica` template이 있다면 Agentica Next runtime config가 주입되지 않는지

### Phase 4E: Website/Docs Compatibility

필수 docs/static test:

- setup CLI docs의 command, option, template matrix가 `packages/cli` current surface와 일치하는지
- docs/snippets에서 stale `agent.on("text")`, `IAgenticaRpcListener.text`, `AgenticaHistory.Text`, `type: "text"` 표현이 제거되거나 compatibility note로 격리되는지
- `@agentica/pg-vector-selector`와 `/docs/plugins/pg-vector-selector` stale reference가 current package/route로 정리되는지
- local selector/no-DBMS docs와 optional `@agentica/vector-selector` DBMS/embedding docs가 서로 충돌하지 않는지
- compact/history docs가 current `userMessage`/`assistantMessage`/`systemMessage` contract를 기준으로 설명되는지
- WebSocket/RPC docs가 `assistantMessage`/`describe` final forwarding과 optional listener compatibility를 깨지 않는지
- landing/static preview code가 새 runtime public config와 어긋나지 않는지
- TypeDoc API build pack list가 새 public package/API 노출 정책과 일치하는지

필수 build/smoke:

```bash
pnpm --filter @agentica/website build
```

주의:

- website build는 `prebuild:typedoc`의 external JSON fetch와 local TypeDoc generation, `prebuild:playground`의 `packages/chat` static build에 의존한다.
- Nextra build는 MDX code fence를 TypeScript compile하지 않는다. stale snippet은 grep 또는 dedicated snippet compile fixture로 잡는다.
- `basePath: "/agentica"` 때문에 public image, playground, article redirect path를 static export 후 확인한다.
- 루트 `articles`와 `website/public/articles`는 function-calling-first positioning 표면이다. Agentica Next 소개가 "복잡한 workflow graph를 요구하지 않는다"는 기존 message를 깨지 않는지 확인한다.

### Phase 5: Stateful Runtime Loop

필수 unit test:

- `prepare_context -> select_operations -> call_model -> execute_operations -> describe_or_finish`
- no operation path
- validation retry transition
- prompt-too-long compact retry transition
- context-collapse drain retry transition
- max-output-tokens escalate/recovery/exhaustion transition
- model fallback tombstone/discard transition
- streaming fallback이 partial assistant/tool_use를 public history에 확정하지 않는지
- abort transition
- max turns/token budget transition
- token budget continuation과 diminishing return stop
- stop hook blocking/prevent-continuation transition
- attachment drain이 slash command를 mid-turn model attachment로 보내지 않는지
- memory/skill prefetch가 settled result만 zero-wait로 consume하는지
- connector/tool registry refresh가 다음 iteration tool projection에만 반영되는지
- custom executor hook compatibility

기존 e2e:

- base work/describe
- MCP work/describe
- RPC websocket call/initialize
- benchmark call

합격 기준:

- 기존 `Agentica.conversate()` public signature 유지
- existing event ordering은 명시적으로 변경하지 않는 한 유지
- `AgenticaTokenUsage` aggregate가 계속 증가해야 한다.

추가 operation execution unit test:

- concurrency-safe operation은 병렬 실행하되 final result projection은 operation order를 지키는지
- exclusive operation이 뒤 operation 시작을 막는지
- context modifier가 completion order가 아니라 configured order로 적용되는지
- progress event가 final execute history보다 먼저 나와도 pairing이 깨지지 않는지
- sibling failure policy가 같은 kind만 취소하거나 batch 전체를 취소하는지 fixture로 고정되는지
- fallback/discard 시 old operation id에 대한 synthetic result가 만들어져 model API invariant를 유지하는지

### Phase 5A: Team/Mailbox Runtime

초기 team runtime은 public API가 아니라 internal wrapper 검증으로 제한한다.

필수 unit test:

- teammate spawn transaction이 registry, task state, mailbox 초기화 중간 실패를 정리하는지
- backend mode snapshot이 session 중 임의 config 변경으로 흔들리지 않는지
- in-process teammate identity가 AsyncLocalStorage 또는 명시 context로 격리되는지
- initial prompt가 command line/history가 아니라 mailbox/control adapter로 전달되는지
- graceful terminate와 force kill transition이 분리되는지
- idle은 terminal status가 아니라 재할당 가능한 상태인지
- permission/mode change message가 typed control message로 projection되는지
- env/flag inheritance allowlist가 provider/config/proxy/cert 등 허용 항목만 전달하는지
- plan-mode required 상태에서 bypass permission 계열 mode 전파가 차단되는지
- external-pane adapter mock의 `kill`, `hide/show`, cleanup 실패가 public history를 오염시키지 않는지

필수 compatibility test:

- team/member status marker가 기존 `assistantMessage`, `describe`, RPC ordering을 깨지 않는지
- mailbox raw payload, pane id, process command, local path가 public history/RPC event에 노출되지 않는지
- `MicroAgentica` event/history flow가 변하지 않는지

### Phase 5B: Remote/SDK Transport Runtime

remote runtime도 public API가 아니라 internal adapter 검증으로 제한한다.

필수 unit test:

- SDK `control_request` id, operation/tool id, connector JSON-RPC id가 서로 섞이지 않는지
- `control_response` 중복 도착 시 같은 tool_use를 재실행하지 않는지
- `control_cancel_request`가 pending permission promise를 unblock하는지
- remote `interrupt`/`stop_task`가 operation failure가 아니라 control transition으로 남는지
- WebSocket replay buffer가 confirmed uuid를 evict하고 unconfirmed message만 replay하는지
- SSE sequence high-water mark와 duplicate sequence pruning이 동작하는지
- event queue는 ordered retry/backpressure를 적용하고 worker metadata는 last-value coalescing을 적용하는지
- worker epoch mismatch가 reconnectable transport close와 다른 terminal transition으로 분류되는지
- stream text delta coalescing이 full-so-far snapshot을 만들고 assistant final message에서 accumulator를 정리하는지
- internal transcript event와 client-visible event가 별도 persistence path로 처리되는지
- delivery ack `received`/`processing`/`processed`가 retry 가능한 side effect로 기록되는지
- `update_environment_variables` 같은 process-wide env patch가 trusted transport에서만 허용되는지

필수 compatibility test:

- SDK `result` success, `auth_status`, `rate_limit_event`, `tool_use_summary`가 public chat history에 그대로 들어가지 않는지
- compact boundary는 짧은 system marker와 internal metadata로 분리되는지
- remote status/QR/keyboard toggle 같은 CLI renderer state가 core event에 노출되지 않는지
- reconnect/heartbeat/auth refresh가 task failure로 보고되지 않는지
- `MicroAgentica` event/history flow가 변하지 않는지

### Phase 5C: Shell/Platform Policy Runtime

shell/platform runtime은 Agentica public API가 아니라 internal capability/provider로 제한한다.

필수 unit test:

- platform/env/user-type gate가 tool list, prompt shell expansion, input routing에서 동일하게 적용되는지
- default shell이 Windows에서 자동 PowerShell로 바뀌지 않는지
- parser unavailable, timeout, command-too-long이 allow가 아니라 ask/deny fallback이 되는지
- parser divergence, legacy fallback, parser unavailable이 `parser-untrusted` reason class로 기록되는지
- permission reducer가 어떤 순서에서도 `deny > ask > allow`를 보장하는지
- exact allow rule이 path-like executable/script name에 적용되지 않는지
- prefix/wildcard allow rule normalization이 deny rule보다 보수적인지
- exact allow rule과 broad prefix allow rule이 parser-untrusted gate를 다르게 취급하는지
- read-only auto-allow가 parser trust gate 이후에만 실행되는지
- PowerShell alias/cmdlet canonicalization이 `rm`, `del`, `Remove-Item` 같은 동치 command를 같은 deny surface로 보는지
- provider path, UNC path, environment/registry/function/cert provider access가 read-only auto-allow를 우회하지 않는지
- `Invoke-Expression`, nested `pwsh`, encoded command, dynamic command name, download cradle이 approval로 떨어지는지
- compound command에서 cwd change 또는 symlink creation 뒤의 read/write가 auto-allow되지 않는지
- `grep` no-match, `findstr` no-match, `robocopy` 0-7 같은 non-error exit semantic이 failure로 오분류되지 않는지
- sandbox-required policy에서 platform이 sandbox를 지원하지 않으면 shell execution을 거부하는지
- REPL/scripting wrapper가 숨긴 primitive operation을 renderer, compact/collapse, permission audit에서는 계속 식별하는지
- alternate shell tool이 REPL primitive set에 포함될지 독립 direct tool로 남을지 fixture로 고정되는지
- shell execution이 pre-spawn error, spawn error, semantic non-error exit, semantic error exit을 분리하는지
- stdout/stderr file-mode interleave와 pipe-mode callback path가 서로 다른 projection을 만드는지
- large output이 inline history로 무제한 들어가지 않고 output reference와 preview로 분리되는지
- progress threshold 이전 fast command가 progress/task state를 만들지 않는지
- progress threshold 이후 foreground task 등록, user background, auto-background, completion race가 중복 notification 없이 처리되는지
- timeout이 policy에 따라 background 전환, graceful stop, hard kill로 나뉘는지
- user interrupt가 hard kill과 다르게 partial output/background 전환 가능 상태로 남는지
- background task completion notification이 다음 turn projection으로 들어가고 raw output path는 public history에 노출되지 않는지
- interactive prompt stall watchdog이 `(y/n)`, `Press Enter`, `Are you sure?` tail을 diagnostic notification으로 분류하는지
- sandbox temp/cwd tracking file cleanup과 cwd update가 foreground task에만 적용되는지
- sandbox violation annotation이 raw stderr를 덮어쓰기보다 projection 단계에서 추가되는지
- sed/edit preview가 승인된 preview와 실제 write를 같은 structured operation으로 묶는지
- safe heredoc/git commit 같은 early-allow fast-path가 remaining command 재검증, command-name position 금지, redirect/operator/substitution fallback을 fixture로 고정하는지
- ANSI-C quote, empty quote before dash, quote chaining, quoted dash flag, backslash-escaped whitespace/operator, CR/Unicode whitespace/control char, mid-word hash, quoted-newline-hash, brace expansion obfuscation, `/proc/*/environ`, zsh dangerous command fixture가 ask/fail-closed로 떨어지는지

필수 compatibility test:

- shell/provider runtime state와 task output path가 public history/RPC event에 노출되지 않는지
- background shell task가 function call result와 분리되고 terminal notification만 projection되는지
- `MicroAgentica` event/history flow가 변하지 않는지

### Phase 5D: Permission Control Flow Runtime

permission control flow는 public API 확장이 아니라 internal call-time gate와 approval adapter로 먼저 검증한다.

필수 unit test:

- global rule reducer가 `deny > ask > allow > passthrough`를 항상 지키는지
- hook allow 이후에도 deny/ask rule과 safety check가 재검사되는지
- hook ask가 forced prompt reason으로 전달되는지
- hook deny가 operation execution을 중단하고 audit source를 hook으로 남기는지
- `dontAsk` mode가 ask decision을 deterministic deny로 바꾸는지
- `bypassPermissions` mode가 explicit ask rule, deny rule, safety check를 우회하지 않는지
- `plan` mode에서 write/destructive operation이 plan approval 전 실행되지 않는지
- `auto` mode fast-path가 safe subset만 허용하고 classifier unavailable 정책을 fail-closed/fallback 중 설정대로 따르는지
- `shouldAvoidPermissionPrompts` context에서 PermissionRequest hook 또는 parent delegation 이후 결정이 없으면 deny하는지
- pending request가 local UI, SDK/RPC response, remote/channel response, classifier, hook, abort 중 첫 응답만 채택하는지
- pending request resolve 후 다른 channel에 cancel/closed signal이 나가는지
- permission update가 typed `AgenticaPermissionUpdate[]`로만 state/settings에 적용되는지
- managed/policy source가 user/local/session source보다 우선하는지
- shadowed allow rule diagnostic이 tool-wide deny/ask rule에 대해 생성되는지

필수 compatibility test:

- permission prompt, feedback, runtime request id, raw argument preview가 public history/RPC event에 과도하게 노출되지 않는지
- permission denial이 schema validation retry로 오분류되지 않는지
- operation execute failure와 permission deny/abort audit event가 분리되는지
- worker/sub-agent permission delegation이 parent history를 오염시키지 않는지
- `MicroAgentica` event/history flow가 변하지 않는지

### Phase 6: Capability Registry와 Reload Boundary

초기에는 public marketplace를 열지 않더라도 internal capability pack registry 검증을 먼저 둔다.

필수 unit test:

- source declaration과 materialized source state 분리
- install/enable intent 기록 후 materialization failure가 나도 recovery 가능한 state 유지
- update가 running projection을 즉시 바꾸지 않고 `pendingReload`만 세우는지
- failed/flagged/needs-config capability가 control-plane item으로 남는지
- sensitive userConfig blank reconfigure가 기존 secret을 지우지 않는지
- remote MCPB/connector artifact가 same-source-root 또는 explicit allowlist 밖이면 다운로드 전에 차단되는지
- redirect 후 최종 artifact URL이 allowlist 밖이면 차단되는지
- local artifact path `./../escape.mcpb`가 pack root containment에서 차단되는지
- local/archive cache backend에서 old materialization orphan marker와 search exclusion이 적용되는지
- reload가 operation/procedure/connector/hook projection과 connector reconnect key를 한 boundary에서 갱신하는지

필수 validator test:

- manifest unknown field warning/error 정책
- procedure/skill/agent frontmatter parse failure
- hook config schema failure
- connector/MCPB required userConfig missing이 install failure가 아니라 needs-config로 분류되는지
- MCPB URL은 suffix뿐 아니라 source policy를 통과해야 하는지
- MCPB zip traversal, absolute path, zip bomb, missing `manifest.json`, missing `server` fixture
- path traversal과 source-root resolution hint
- interactive validate와 CI validate의 coverage 차이
- reload command text summary와 SDK/RPC structured reload response
- startup registry reconcile이 workspace trust gate 이전에 실행되지 않는지
- connector OAuth flow가 token 저장 후 reconnect/discover/projection refresh까지 수행하는지
- step-up auth가 refresh loop로 빠지지 않고 pending auth state로 보존되는지
- `.mcp.json` connector approval, workspace trust, tool-call permission이 서로 섞이지 않는지
- SDK-hosted connector의 JSON-RPC id와 outer control request id가 서로 독립적으로 correlation되는지
- `mcp_set_servers`에 해당하는 dynamic connector mutation이 직렬화되고 `added/removed/errors` response를 안정적으로 반환하는지
- SDK connector는 control response 전에 handshake를 기다리지 않아 deadlock을 만들지 않는지
- in-process connector transport close가 양쪽 client/server cleanup을 모두 트리거하는지
- IDE/internal connector notification이 public history/RPC transcript에 노출되지 않는지
- auth/headers helper secret이 history/RPC/public event에 노출되지 않는지

Claude Code 참고 snapshot에는 plugin validate 전용 fixture/spec bundle이 확인되지 않았다. Agentica는 이 공백을 그대로 가져오지 않고 Phase 6 시작 시 first-party fixture pack을 만든다.

fixture pack 최소 구성:

- 정상 plugin과 정상 marketplace
- invalid JSON, unknown field, missing required field
- bad component frontmatter, missing description warning, bad hook schema
- command/procedure/capability collision warning
- MCPB local traversal과 pack root containment
- remote artifact disallowed host와 redirect host mismatch
- zip traversal, absolute path, zip bomb, missing `manifest.json`, missing `server`
- required userConfig를 install failure가 아닌 needs-config로 분류하는 case

authoring validator fixture와 runtime loader smoke test는 분리한다. 전자는 stable diagnostic과 exit/result shape를 검증하고, 후자는 materialization, needs-config, reload projection, connector reconnect를 검증한다.

합격 기준:

- registry mutation result와 UI/CLI output adapter가 분리되어야 한다.
- reload 전후 operation selector 결과가 의도한 projection version을 따른다.
- public history/RPC에는 install path, cache path, secure-storage key, secret value가 노출되지 않는다.

## 현재 test runner 사용법

`test/src/index.ts`는 `--include`, `--exclude` substring filter를 지원한다.

예시:

```bash
pnpm --filter @agentica/test start --include base_streaming
pnpm --filter @agentica/test start --include rpc
pnpm --filter @agentica/test start --exclude benchmark
```

API key가 없는 test는 `false`를 반환해 skip/pass처럼 처리된다. 따라서 CI에서 "성공"만 보고 LLM e2e가 실제 실행됐다고 판단하면 안 된다. 결과를 해석할 때 env 존재 여부를 함께 확인해야 한다.

## Benchmark 해석 규칙

benchmark는 pass/fail test가 아니라 품질 측정 도구다.

해석해야 할 지표:

- scenario별 success/failure/error 수
- select 성공률
- call 성공률
- 평균 시간
- token usage aggregate
- failure event의 selected operations 또는 prompt histories

Agentica Next selector 변경에서는 최소 세 baseline을 비교한다.

1. 기존 plain Agentica selector
2. local-only selector
3. hybrid selector

vector-selector는 optional comparison이다. DBMS/embedding 의존성 때문에 core default 기준으로 삼지 않는다.

## Regression 보호 항목

절대 깨면 안 되는 기존 계약:

- `Agentica.on/off()` listener 동작
- `Agentica.conversate()`가 userMessage history를 포함해 반환하는 동작
- `assistantMessage`/`describe` stream과 `join()` 일치
- `call` event listener의 arguments override
- validation feedback 후 execute recovery
- RPC event ordering
- `MicroAgentica` event/history flow

## 문서화 규칙

구현 세션은 test를 추가하거나 수정할 때 다음을 위키에 남긴다.

- 어떤 invariant를 검증하는지
- API key/외부 서비스가 필요한지
- deterministic gate인지 LLM quality gate인지
- 실패 시 어느 설계 문서를 다시 봐야 하는지

이 문서와 [Agentica Benchmark/Test 현재 구조](../../04-agentica/benchmark-test-current.md)를 함께 갱신한다.
