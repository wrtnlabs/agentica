# Claude Code BashTool/Policy 분석

이 문서는 `~/github/samchon/claude-code/src/tools/BashTool/*`를 읽고 tool policy 설계에서 배울 점을 정리한다.

PowerShell/REPL/platform-specific shell 계층은 별도 문서인 [Claude Code PowerShell/REPL/Platform Tools 분석](./powershell-repl-platform-tools.md)에 정리한다.

Permission UI, hook, remote/channel approval, worker approval control flow는 별도 문서인 [Claude Code Tool Permission Control Flow 분석](./tool-permission-control-flow.md)에 정리한다.

## BashTool은 실행기보다 policy engine에 가깝다

`BashTool.tsx`는 shell command 실행뿐 아니라 다음 기능을 함께 가진다.

- command schema
- timeout/background option
- sandbox override option
- read/search/list command UI classification
- silent command classification
- image output handling
- large output persistence
- foreground/background task 등록
- progress event forwarding
- permission check integration
- file history tracking
- git operation tracking

Agentica 적용 관점에서는 "tool metadata와 policy가 실행기 주변에 두껍게 있어야 한다"가 핵심이다.

## Model-facing schema와 internal schema 분리

`fullInputSchema`에는 internal `_simulatedSedEdit`가 있지만, model-facing `inputSchema`에서는 항상 omit된다.

의미:

- LLM에게 보여도 되는 argument와 내부 권한 승인 후 주입되는 argument를 구분한다.
- permission bypass 가능성이 있는 field는 schema에서 숨긴다.

Agentica 적용:

- operation schema에도 model-visible input과 runtime-only input을 분리해야 한다.
- HTTP header, auth, tenant id, internal override, approved preview result는 LLM function schema에 직접 노출하면 안 된다.

## Command semantics

`commandSemantics.ts`는 exit code를 단순 0/비0로 해석하지 않는다.

예:

- `grep`, `rg`: exit 1은 "no matches"이지 error가 아니다.
- `find`: exit 1은 일부 directory inaccessible로 해석한다.
- `diff`: exit 1은 files differ다.
- `test`, `[`: exit 1은 condition false다.

Agentica 적용:

- operation result도 `success: boolean` 하나로 충분하지 않을 수 있다.
- HTTP 404, 409, 422, validation failure, empty search result처럼 domain-specific non-error를 표현할 semantic layer가 필요하다.

## Destructive warning

`destructiveCommandWarning.ts`는 permission logic을 바꾸지 않고, dialog에 표시할 human warning을 만든다.

패턴:

- `git reset --hard`
- force push
- `git clean -f`
- checkout/restore all
- stash drop/clear
- recursive/force rm
- DB drop/truncate/delete all
- kubectl delete
- terraform destroy

Agentica 적용:

- operation metadata에 `sideEffect`와 `destructiveHint`가 있어야 한다.
- selector 단계에서 destructive operation을 숨기는 것이 아니라, call 직전 approval/policy에 넘겨야 한다.
- UI/RPC에서 warning을 표시할 수 있도록 event payload에 warning을 둘 수 있다.

## Read-only validation

`readOnlyValidation.ts`는 command allowlist와 flag validation을 매우 상세하게 관리한다.

특징:

- read-only command map을 command별 safe flags로 정의한다.
- `xargs` 같은 command는 optional argument semantics까지 고려한다.
- `sed`는 별도 allowlist callback을 붙인다.
- git, rg, gh, docker, pyright 등 command별 read-only subset이 있다.

Agentica 적용:

- "조회 API"와 "쓰기 API"를 HTTP method만으로 판단하면 안 된다.
- GET도 side effect가 있을 수 있고 POST도 search일 수 있다.
- operation metadata를 자동 추론하되, controller author override가 가능해야 한다.

## 실행 파이프라인

추가 독해한 파일:

- `src/tools/BashTool/BashTool.tsx`
- `src/utils/Shell.ts`
- `src/utils/ShellCommand.ts`
- `src/utils/shell/bashProvider.ts`
- `src/utils/task/TaskOutput.ts`
- `src/utils/task/diskOutput.ts`
- `src/tasks/LocalShellTask/LocalShellTask.tsx`

Claude Code의 BashTool 실행은 대략 다음 단계로 쪼개진다.

1. `BashTool.call()`이 permission을 통과한 input을 받고, `_simulatedSedEdit`이면 shell을 띄우지 않고 파일 수정 path로 바로 보낸다.
2. 일반 command는 `runShellCommand()` async generator로 들어간다.
3. `runShellCommand()`는 `exec()`를 호출하되, progress/background 전환을 직접 관리한다.
4. `exec()`는 shell provider가 만든 command string을 sandbox wrapper에 통과시키고 child process를 spawn한다.
5. spawn된 process는 `ShellCommand`로 감싸지고, output은 `TaskOutput`이 소유한다.
6. 완료 후 `BashTool.call()`은 command semantic interpreter, sandbox stderr annotation, image detection, large output persistence, git operation tracking, history hint filtering을 적용해 tool result를 만든다.

중요한 점은 execution result가 곧 model result가 아니라는 것이다. Claude Code는 raw stdout/stderr, progress UI, background task notification, persisted output reference, model-facing preview를 모두 분리한다.

Agentica 적용:

- operation executor는 `return value`만 돌려주는 함수가 아니라 run state, progress, output reference, semantic interpretation을 가진 runtime이어야 한다.
- execute history에 raw payload를 그대로 넣기보다 model projection과 audit 원본, UI projection을 분리해야 한다.
- 이 계층은 `Agentica` 전용 wrapper에서 시작해야 하며, `MicroAgentica` 공유 call path에는 넣지 않는다.

## Shell provider와 spawn 경계

`Shell.ts`와 `bashProvider.ts`의 핵심은 shell command를 "문자열 그대로 spawn"하지 않는다는 점이다.

확인한 동작:

- `CLAUDE_CODE_SHELL` 또는 사용자 `$SHELL`을 쓰더라도 bash/zsh 실행 가능성 검사를 거친다.
- shell snapshot이 있으면 login shell 비용을 줄이고, 없으면 login shell로 fallback한다.
- command 앞에는 snapshot/session env source, extglob disable, `eval <quoted command>`가 붙는다.
- command 뒤에는 `pwd -P > cwdFilePath`가 붙어 foreground command가 바꾼 cwd를 runtime state에 반영한다.
- sandbox가 켜져 있으면 command string을 `SandboxManager.wrapWithSandbox()`로 감싸고 sandbox 전용 temp directory를 만든다.
- sandboxed PowerShell은 sandbox runtime이 POSIX shell을 감싸는 구조라 `/bin/sh -c`로 실행한다.
- stdout/stderr는 기본적으로 같은 output file fd로 들어간다. 실시간 stdout callback이 필요한 hook path만 pipe mode를 쓴다.
- output fd는 Unix에서 `O_NOFOLLOW`를 써서 sandbox 내부 symlink가 host 파일을 가리키는 공격을 막는다.
- process spawn 실패는 shell execution error로 normalize되고, command 시작 전 abort는 synthetic aborted command로 표현된다.
- command 완료 후 foreground task만 cwd를 갱신하고, sandbox command 뒤에는 sandbox cleanup과 bare git repo scrub을 수행한다.

Agentica 적용:

- local shell capability를 넣는다면 provider boundary를 둔다. `bash`, `powershell`, `remote-shell`, `container-shell`은 parser/path/sandbox/cwd semantics가 다르다.
- cwd, temp dir, session env, output file path는 runtime-only state다. public history/RPC event에 직접 노출하면 안 된다.
- spawn 직전의 command string은 permission/audit 대상이고, spawn 후의 stdout은 result projection 대상이다. 같은 데이터 흐름으로 섞지 않는다.

## Timeout, abort, foreground/background

`runShellCommand()`와 `ShellCommand`는 timeout을 단순 kill로만 보지 않는다.

확인한 정책:

- progress threshold는 2초다. 2초 안에 끝나면 progress UI를 만들지 않는다.
- 일정 시간이 지나면 foreground task로 등록해 사용자가 background로 보낼 수 있게 한다.
- `run_in_background`가 true이면 즉시 `LocalShellTask`로 등록하고 task id만 돌려준다.
- KAIROS assistant mode에서는 main agent가 15초 이상 blocking되면 자동 background를 시도한다.
- timeout 시 auto-background가 가능한 경우 kill 대신 background 전환을 선택할 수 있다.
- abort reason이 `interrupt`이면 child process를 즉시 죽이지 않는다. caller가 partial output이나 background 전환을 처리할 수 있게 한다.
- 실제 kill은 tree-kill로 process tree를 `SIGKILL`한다.
- `exit` event를 사용하고 `close`를 기다리지 않는다. shell은 끝났지만 grandchild가 fd를 붙잡는 case에서 result가 무한정 지연되는 것을 피하기 위해서다.
- foreground task가 background로 넘어가는 도중 command가 끝나면 notification 중복을 막기 위해 task를 notified 처리하고 foreground result로 돌려준다.

Agentica 적용:

- 장기 실행 operation은 `running -> backgrounded -> completed/failed/stopped` 전이를 갖는 task state로 모델링해야 한다.
- user interrupt, timeout kill, timeout background, explicit stop은 모두 다른 transition이다.
- background task completion은 execute failure가 아니라 다음 turn에 투영되는 runtime notification이다.

## TaskOutput과 large output

`TaskOutput`은 shell output의 single source of truth다.

확인한 구조:

- bash file mode에서는 stdout과 stderr가 같은 파일에 시간순으로 interleave된다. `getStderr()`는 빈 문자열을 돌려준다.
- progress UI는 output file tail을 1초 polling한다.
- progress tail은 최근 4KB에서 최근 5줄/100줄과 전체 line/byte 추정을 만든다.
- hook pipe mode는 memory buffer를 쓰다가 8MB를 넘으면 disk로 spill한다.
- background output은 session id가 포함된 project temp task directory에 저장된다. concurrent session이 서로 output file을 지우는 문제를 피하기 위해 session id를 first-call memoize한다.
- disk output cap은 5GB다. file mode background task는 watchdog이 stat으로 파일 크기를 보고 초과 시 process를 kill한다.
- foreground command의 큰 output은 inline preview와 별도로 tool result directory에 hardlink/copy된다. BashTool 쪽 persisted output hard limit은 64MB다.
- model-facing result에는 `<persisted-output>` wrapper와 preview가 들어갈 수 있고, UI에는 wrapper 없는 stdout preview가 유지된다.

Agentica 적용:

- result budget은 "문자열 자르기"가 아니라 output storage/reference/projection 정책이어야 한다.
- `AgenticaResultReference`는 task id, byte size, digest, preview, eviction policy를 가져야 한다.
- render projection과 model projection은 서로 다른 preview를 써도 된다.

## LocalShellTask notification과 stall watchdog

`LocalShellTask`는 background bash를 AppState task로 등록한다.

확인한 동작:

- completion notification은 `<task_notification>` XML-like message로 task id, output file, status, summary를 포함한다.
- notification은 pending queue에 들어가고, task가 이미 notified이면 중복 enqueue를 막는다.
- background task state가 바뀌면 prompt speculation을 abort한다. speculated answer가 stale output을 참조할 수 있기 때문이다.
- output이 45초 이상 자라지 않고 tail 마지막 줄이 `(y/n)`, `Press Enter`, `Are you sure?` 같은 interactive prompt로 보이면 별도 notification을 만든다.
- Monitor task는 일반 bash completion fold와 다른 summary prefix를 쓴다.

Agentica 적용:

- async operation은 completion event와 "interactive prompt로 block된 것 같다"는 diagnostic event를 분리해야 한다.
- background task raw output path를 history에 그대로 넣지 않고, model context projector가 필요한 marker만 투영해야 한다.

## Sandbox adapter

`shouldUseSandbox.ts`와 `utils/sandbox/sandbox-adapter.ts`는 permission과 sandbox를 분리한다.

확인한 정책:

- sandbox disabled, platform unsupported, dependency missing, excluded command, allowed unsandboxed override이면 sandbox를 쓰지 않을 수 있다.
- `dangerouslyDisableSandbox`는 설정상 unsandboxed command가 허용된 경우에만 작동한다.
- sandbox auto-allow는 sandbox enabled와 `autoAllowBashIfSandboxed`가 켜져 있을 때만 permission flow에 참여한다.
- sandbox config는 settings permission rule과 sandbox filesystem/network settings를 runtime config로 변환한다.
- write allow에는 cwd, Claude temp dir, additional directories, worktree main repo path가 포함될 수 있다.
- write deny에는 settings files, managed settings drop-in dir, `.claude/skills` 등이 들어간다.
- bare git repo escape를 막기 위해 cwd/original cwd의 `HEAD`, `objects`, `refs`, `hooks`, `config`를 deny하거나 post-command scrub 대상으로 둔다.
- WebFetch domain permission rule은 sandbox network allowed/denied domain으로도 변환된다.
- managed policy가 `allowManagedDomainsOnly` 또는 `allowManagedReadPathsOnly`를 강제할 수 있다.
- 설정 변경은 sandbox runtime config refresh로 이어진다.
- Linux/WSL에서는 glob pattern 지원 한계를 warning으로 노출한다.

Agentica 적용:

- "permission allow"와 "sandbox 적용"은 같은 판단이 아니다. sandbox가 성공했다고 destructive operation을 자동 승인하면 안 된다.
- connector/network policy도 execution sandbox config로 내려갈 수 있어야 한다. 예: allowed domain, deny write path, temp dir, credential helper.
- sandbox unavailable인데 policy가 sandbox를 요구하면 실행하지 않는 fail-closed mode가 필요하다.

## AST 기반 command security gate

`bashPermissions.ts`는 `utils/bash/ast.ts`의 tree-sitter 기반 parser를 우선 사용한다.

확인한 구조:

- `parseForSecurity()`는 `simple`, `too-complex`, `parse-unavailable` 중 하나를 돌려준다.
- control character, Unicode whitespace, backslash-escaped whitespace, zsh `~[...]`, zsh `=cmd`, quote가 섞인 brace expansion 같은 tree-sitter/bash differential은 parse 전에 fail-closed 처리한다.
- parser timeout/resource abort는 `parse-unavailable` fallback이 아니라 `too-complex`로 간주해 ask로 떨어뜨린다.
- clean parse 후에도 semantic check가 한 번 더 돈다. `eval`, unsafe builtin, wrapper 뒤 dangerous command, `timeout` flag ambiguity 같은 token-level 위험을 잡기 위해서다.
- parser unavailable일 때만 legacy shell-quote/regex path로 fallback한다.
- too-complex나 semantic failure도 exact deny/prefix deny를 먼저 본 뒤 ask로 떨어진다. deny rule을 ask로 낮추지 않는다.
- prompt deny/ask classifier는 병렬로 돌 수 있지만 deny가 ask보다 우선한다.

Agentica 적용:

- operation argument policy도 "파싱 실패면 허용"이 아니라 "검증 불가" 상태를 가져야 한다.
- policy decision reducer는 `deny > ask > allow > passthrough`를 불변식으로 둔다.
- classifier/heuristic은 deterministic parser와 rule을 대체하는 것이 아니라 ask/deny reason을 보강하는 계층으로 둔다.

## Legacy bashSecurity validator

추가 독해한 파일:

- `src/tools/BashTool/bashSecurity.ts`
- `src/utils/bash/shellQuote.ts`
- `src/utils/bash/ParsedCommand.ts`
- `src/utils/bash/treeSitterAnalysis.ts`

`bashSecurity.ts`는 legacy라고 이름 붙었지만 단순한 낡은 정규식 묶음이 아니다. tree-sitter가 없거나 legacy 경로가 필요한 곳에서 shell-quote와 bash의 해석 차이를 찾아내는 방어선이다.

핵심 구조:

- `bashCommandIsSafe_DEPRECATED()`는 sync legacy path다. `readOnlyValidation.ts` 같은 sync caller가 사용한다.
- `bashCommandIsSafeAsync_DEPRECATED()`는 `ParsedCommand.parse()`를 통해 tree-sitter quote context가 있으면 그것을 쓰고, 없으면 sync path로 fallback한다.
- `ParsedCommand`는 tree-sitter가 가능하면 AST 기반 pipe/redirection/quote context를 쓰고, 아니면 `RegexParsedCommand_DEPRECATED`로 떨어진다.
- legacy validator 결과 중 일부는 `isBashSecurityCheckForMisparsing` 플래그를 붙인다. `bashPermissions.ts`는 이 플래그를 "splitCommand를 믿을 수 없음"으로 해석해 early block/ask로 처리한다.
- newline/redirection 같은 정상 shell 구조는 non-misparsing validator로 분리된다. 다만 뒤쪽 misparsing validator를 놓치지 않도록 non-misparsing ask는 defer한다.

주요 validator 축:

- safe heredoc substitution: `$(cat <<'EOF' ... EOF)`만 매우 엄격한 조건에서 early allow한다. quoted/escaped delimiter, line-based closing delimiter, command-name position 금지, nested match 금지, remaining text 재검증을 모두 요구한다.
- git commit message early allow: `git commit -m '...'`는 단순 message일 때만 allow한다. backslash, shell operator, redirect, substitution, dash-start message는 fallback/ask로 돌린다.
- jq: `system()`, `-f`, `--from-file`, `--rawfile`, `--slurpfile`, `-L` 같은 코드/파일 로딩 표면을 ask로 돌린다.
- substitution/metacharacter: backtick, `$()`, `${}`, `$[]`, process substitution `<()`, `>()`, zsh `=cmd`, `~[...]`, glob qualifier, `always` block, PowerShell comment syntax까지 잡는다.
- dangerous variable/context: `$VAR` 주변 pipe/redirection, `$IFS`, `/proc/*/environ` 접근은 민감한 parser/runtime surface로 본다.
- obfuscated flags: ANSI-C quote `$'...'`, locale quote `$"..."`, empty quotes before dash, quote chaining, quoted dash flag, split-quote flag, multi-quote word start를 ask로 돌린다.
- parser differential: carriage return, Unicode whitespace, control char, mid-word `#`, comment quote desync, quoted newline followed by `#`, shell-quote single-quote backslash bug, malformed token with command separators를 잡는다.
- backslash differential: backslash-escaped whitespace, backslash-escaped shell operator는 shell-quote/splitCommand가 재파싱할 때 구조를 잘못 볼 수 있어 misparsing concern으로 본다.
- brace expansion: unquoted `{a,b}`/`{1..2}`, quoted brace obfuscation, quote stripping 뒤 excess closing brace 같은 git flag/path bypass를 잡는다.
- zsh-specific 위험: `zmodload`, `emulate`, `sysopen`, `syswrite`, `zpty`, `ztcp`, `mapfile`, `zf_*`, `fc -e`를 방어한다.

중요한 설계 포인트:

- early allow는 validator chain 전체를 건너뛰므로, "거의 안전"이면 안 된다. safe heredoc과 git commit early allow가 과하게 엄격한 이유가 이것이다.
- parser differential validator는 normal safety warning과 다르다. command를 split하거나 path를 추출하기 전에 "이 parser를 신뢰해도 되는가"를 먼저 결정한다.
- quote/context 추출은 regex path와 tree-sitter path가 모두 있으며 divergence telemetry를 남긴다. Agentica도 validator migration 시 shadow/telemetry phase가 필요하다.
- exact allow rule은 일부 misparsing gate를 넘길 수 있다. 따라서 exact allow는 broad prefix allow와 다르게 "사용자가 그 문자열 자체를 승인했다"는 의미여야 한다.

Agentica 적용:

- operation argument가 DSL, query, script, filter expression을 포함하면 parser trust gate가 별도 필요하다. 예: SQL-like filter, JSONPath, jq, shell, template string, dynamic header helper.
- "read-only로 보이는 operation"도 argument parser가 misparse될 수 있으면 auto-allow하지 않는다.
- validator 결과는 `safety warning`, `parser untrusted`, `policy denied`, `semantic non-error`처럼 서로 다른 reason class로 남겨야 한다.
- first-party parser를 도입할 때 legacy parser와 shadow 비교 telemetry를 남기고, divergence가 있으면 허용이 아니라 ask/fail-closed로 간다.

## Permission rule suggestion

`bashPermissions.ts`는 command prefix를 추출해 재사용 가능한 permission rule을 제안한다.

중요한 안전장치:

- shell wrapper prefix는 broad allow rule로 제안하지 않는다.
- heredoc/multiline command는 full exact rule 대신 안정 prefix로 다룬다.
- complex compound command는 검사 수를 제한하고 ask로 fallback한다.
- unsafe env var prefix는 strip하지 않는다.

Agentica 적용:

- `Operation(controller.function:*)` 같은 allow rule을 바로 제안하면 너무 넓을 수 있다.
- safe reusable permission은 operation id뿐 아니라 argument pattern, tenant scope, user confirmation source를 포함해야 한다.
- 검사 복잡도가 높으면 "허용"이 아니라 "ask"로 fallback해야 한다.

## Agentica Next 결론

Agentica의 function calling은 현재 schema validation과 execute event에 강점이 있다. 그러나 Claude Code식 policy depth를 적용하려면 다음 레이어가 필요하다.

1. operation metadata inference
2. operation policy classifier
3. model-visible/runtime-only schema split
4. call-time permission gate
5. result semantic interpreter
6. warning/event payload
7. reusable permission rule proposal
8. execution run state/progress/background runtime
9. sandbox profile/runtime output reference
10. model/UI/audit result projection 분리
11. parser trust gate와 reason-class 분리

이것은 core public API 변경 가능성이 크므로, 처음에는 internal metadata와 optional listener event로만 도입한다.

## PowerShell과 REPL 보강 결론

후속 독해 결과, PowerShell은 BashTool의 runtime option이 아니라 독립 tool/policy/provider/parser 계층으로 구현되어 있다.

Agentica에 반영할 추가 원칙:

- shell family마다 parser, permission namespace, path semantics, sandbox capability를 분리한다.
- Windows 전용 PowerShell gate처럼 platform-specific tool은 tool list, prompt shell expansion, input routing에서 같은 visibility gate를 써야 한다.
- parser unavailable/timeout/too-long은 allow가 아니라 ask/deny fallback이다.
- permission decision은 early return보다 `deny > ask > allow` collect-then-reduce가 안전하다.
- REPL/scripting wrapper가 primitive tools를 숨겨도 renderer, compact/collapse, audit registry에는 hidden primitive를 계속 남긴다.

세부 근거는 [PowerShell/REPL/Platform Tools 분석](./powershell-repl-platform-tools.md)을 본다.

## Permission Control Flow 보강 결론

후속 독해 결과, Bash/PowerShell의 command policy는 전체 permission runtime 중 tool-local policy 단계에 해당한다. Claude Code는 이후 `hasPermissionsToUseTool`, PreToolUse/PermissionRequest hook, interactive prompt, bridge/channel approval, swarm worker approval, classifier를 하나의 ask-resolution flow로 묶는다.

Agentica에 반영할 추가 원칙:

- hook allow는 prompt를 생략할 수 있지만 deny/ask rule과 safety check를 우회하지 않는다.
- `dontAsk`, `auto`, `bypassPermissions`, `plan`, `shouldAvoidPermissionPrompts`는 prompt 문구가 아니라 permission mode transform이다.
- headless/worker 환경에서는 prompt가 불가능하므로 PermissionRequest hook 또는 leader delegation 이후 deterministic deny fallback이 필요하다.
- UI component는 policy engine이 아니라 `PermissionUpdate[]`, feedback, updated input을 만드는 adapter다.
- pending permission request는 local UI, remote bridge, channel relay, classifier, hook, abort가 race하므로 single-winner resolution primitive가 필요하다.

세부 근거는 [Tool Permission Control Flow 분석](./tool-permission-control-flow.md)을 본다.

## Classifier/Wrapper 추가 확인

`services/tools/toolExecution.ts`와 `tools/BashTool/pathValidation.ts`의 classifier 관련부를 추가 확인했다.

확인한 핵심:

- Bash tool은 schema validation 직후 speculative classifier check를 시작한다. PreToolUse hook, deny/ask classifier, permission dialog setup과 병렬로 돌려 latency를 숨기려는 구조다.
- UI의 classifier indicator는 speculative start 시점이 아니라 permission check가 `ask`와 pending classifier를 반환할 때 켠다. auto-allow command에서 indicator가 깜박이는 것을 막는다.
- auto mode에서 classifier가 느리면 tool progress가 시작되기 전 collapsed row가 "Running"으로 보일 수 있어 slow permission decision log를 남긴다.
- classifier denial은 normal permission denial과 같은 tool_result error로 들어가지만, `TRANSCRIPT_CLASSIFIER` gate가 켜진 경우 PermissionDenied hook이 retry 가능 여부를 추가로 알릴 수 있다.
- `pathValidation.ts`의 wrapper stripping이 canonical이다. `bashPermissions.ts`에는 더 좁은 dead-code copy가 남아 있는데, Bun feature DCE 경계 때문에 제거하면 `BASH_CLASSIFIER` evaluation이 깨진다는 주석이 있다.
- wrapper stripping은 `timeout`, `nice`, `stdbuf`, `env`, `time`, `nohup` 같은 safe wrapper argv를 벗겨 path validation 대상 command를 노출한다. AST semantic check와 permission prefix stripping과 sync가 필요하다.

Agentica 적용:

- safety classifier는 permission gate 내부의 asynchronous participant로 다룬다. 결과 race는 single-winner primitive로 합쳐야 한다.
- classifier indicator/progress는 public history가 아니라 adapter/runtime progress다.
- retry 가능 denial과 permanent denial을 구분해 model feedback을 만든다.
- wrapper/adapter normalization logic은 permission suggestion, path validation, semantic check가 같은 rule set을 공유해야 한다.
