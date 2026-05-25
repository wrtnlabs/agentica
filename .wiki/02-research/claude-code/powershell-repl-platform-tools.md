# Claude Code PowerShell/REPL/Platform Tools 분석

## 범위

대상은 Claude Code snapshot의 shell/platform-specific tool 계층이다.

- `/home/samchon/github/samchon/claude-code/src/tools/PowerShellTool/*`
- `/home/samchon/github/samchon/claude-code/src/utils/powershell/*`
- `/home/samchon/github/samchon/claude-code/src/utils/shell/*`
- `/home/samchon/github/samchon/claude-code/src/tools/REPLTool/*`
- `/home/samchon/github/samchon/claude-code/src/utils/processUserInput/processBashCommand.tsx`
- `/home/samchon/github/samchon/claude-code/src/utils/promptShellExecution.ts`
- `/home/samchon/github/samchon/claude-code/src/tools.ts`

이 문서는 Agentica source package를 변경하지 않고, 향후 `Agentica` runtime wrapper 설계에 반영할 지식을 정리한다. `MicroAgentica`는 적용 대상이 아니다.

## 핵심 결론

PowerShell은 BashTool의 옵션이 아니다. Claude Code는 `PowerShellTool`을 독립 tool로 두고 다음을 별도 구현한다.

- Windows 전용 tool visibility gate
- PowerShell AST parser
- cmdlet/alias canonicalization
- provider path, UNC, encoded command, nested PowerShell, dynamic invocation security check
- PowerShell-specific read-only allowlist
- PowerShell-specific path extraction
- PowerShell-specific permission rule matching과 suggestion
- PowerShell-specific shell provider와 spawn args

REPL mode도 단순 UI 모드가 아니다. REPL이 켜지면 직접 tool list에서 primitive tools를 숨기고, REPL VM 안에서만 쓰게 만든다. display/collapse 계층은 hidden primitive tools를 별도 fallback registry로 계속 이해한다.

Agentica 적용의 핵심은 "shell command operation"을 하나의 문자열 executor로 취급하지 않는 것이다. shell family마다 parser, permission namespace, path semantics, sandbox capability, result semantics가 다르다.

## PowerShell Tool Visibility

`utils/shell/shellToolUtils.ts`의 `isPowerShellToolEnabled()`가 PowerShellTool 노출 여부를 결정한다.

동작:

- `getPlatform() !== "windows"`면 항상 false다.
- ant/native build에서는 기본 on이고 `CLAUDE_CODE_USE_POWERSHELL_TOOL=0`으로 끌 수 있다.
- external/user build에서는 기본 off이고 `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`로 켠다.

`tools.ts`는 `getPowerShellTool()`을 lazy require로 호출한다. PowerShellTool은 parser/validator 크기가 크므로 모든 platform에서 startup import chain에 올리지 않는다.

Agentica 적용:

- optional shell/connector tool은 registry visibility gate를 가져야 한다.
- gate는 tool list, prompt inline shell expansion, input-box shell routing에서 동일하게 쓰여야 한다.
- platform-specific parser를 startup critical path에 올리지 않는다.

## Default Shell Routing

`resolveDefaultShell.ts`는 input-box `!` 명령의 shell을 정한다.

정책:

- resolution order는 `settings.defaultShell -> "bash"`다.
- Windows라도 자동으로 PowerShell로 바꾸지 않는다.
- 이유는 기존 Windows 사용자의 Git Bash hook/input workflow를 깨지 않기 위해서다.

`processBashCommand.tsx`는 이름은 Bash지만 실제로는 input-box `!` shell router다.

- `isPowerShellToolEnabled() && resolveDefaultShell() === "powershell"`이면 PowerShellTool을 lazy require한다.
- 아니면 BashTool을 사용한다.
- user-initiated `!` 명령은 `dangerouslyDisableSandbox: true`로 실행한다.
- 출력은 기존 `<bash-stdout>`/`<bash-stderr>` message wrapper를 재사용한다.

`promptShellExecution.ts`는 skill/command prompt 안의 ``!`cmd` ``와 ```! block```을 실행한다.

- 여기서는 settings `defaultShell`을 보지 않는다.
- shell 선택은 markdown frontmatter의 `shell`에서 온다.
- `shell: powershell`이어도 PowerShellTool gate가 꺼져 있으면 BashTool로 fallback한다.
- 직접 `Tool.call()`을 호출하므로 load-bearing validation은 `call()` 내부에도 있어야 한다.

hooks 경로는 별도다.

- hook shell resolution은 `hook.shell -> DEFAULT_HOOK_SHELL`이다.
- 현재 default hook shell은 bash다.
- settings `defaultShell` fallback은 아직 wiring되지 않았다.
- Windows bash hook path는 Git Bash용 POSIX path로 변환하고, PowerShell hook path는 native path를 쓴다.

Agentica 적용:

- user input shell, prompt/frontmatter shell, hook shell, model-call shell은 같은 개념이 아니다.
- default shell을 OS로 자동 추론하지 말고 explicit setting과 compatibility default를 둔다.
- shell routing policy는 public history message tag와 분리한다.

## PowerShell Provider

`utils/shell/powershellDetection.ts`는 PowerShell path를 찾는다.

- `pwsh`를 우선하고 없으면 `powershell`을 쓴다.
- Linux에서 snap launcher가 잡히면 `/opt/microsoft/powershell/7/pwsh` 또는 `/usr/bin/pwsh` direct binary를 우선한다.
- path는 memoized promise로 cache한다.
- binary name으로 edition을 추론한다. `pwsh`는 core, `powershell`은 desktop으로 본다.

`utils/shell/powershellProvider.ts`는 spawn command를 만든다.

- 기본 args는 `-NoProfile -NonInteractive -Command`.
- sandboxed path에서는 inner shell이 `/bin/sh -c`로 고정되므로, PowerShell command를 UTF-16LE base64 `-EncodedCommand`로 감싼다.
- cwd tracking file을 command 뒤에 붙인다.
- exit code는 `$LASTEXITCODE`를 우선하고, 없으면 `$?`를 본다.
- sandboxed Linux/macOS/WSL2에서는 tmpdir을 sandbox tmp 아래로 둔다.
- session env vars는 PowerShell child process에도 주입한다.

Windows native sandbox policy:

- PowerShellTool은 Windows native에서 sandbox를 사용할 수 없다고 본다.
- enterprise policy가 sandbox를 요구하고 unsandboxed command를 금지하면 실행을 거부한다.
- 이 검사는 `validateInput()`와 `call()` 양쪽에 있다.

Agentica 적용:

- shell provider는 `buildExecCommand`, `spawnArgs`, `environmentOverrides`, `sandboxCapability`를 분리해야 한다.
- sandbox policy는 "사용자가 shell command를 승인했는가"와 별개다.
- direct call path가 validation을 우회할 수 있으므로 load-bearing guard는 executor/call boundary에도 있어야 한다.

## PowerShell Execution Lifecycle

`PowerShellTool.tsx`는 BashTool과 같은 task/output 모델을 공유하지만 PowerShell-specific guard를 추가한다.

입력 schema:

- `command`
- `timeout`
- `description`
- `run_in_background`
- `dangerouslyDisableSandbox`

실행 특징:

- `getCachedPowerShellPath()`가 없으면 graceful stderr로 "PowerShell is not available"을 반환한다.
- foreground progress는 일정 시간 뒤 UI hint를 표시한다.
- timeout, interrupt, assistant-mode blocking budget에서 background task로 전환할 수 있다.
- `Start-Sleep`/`sleep`이 첫 statement로 2초 이상 blocking하면 monitor mode에서 background 실행을 요구한다.
- background task output은 `TaskOutput` 파일에 기록된다.
- large output은 tool-results dir로 hardlink/copy해 reference로 남긴다.
- image data URL이면 BashTool utility를 재사용해 resize/image block으로 변환한다.
- Claude Code hint tag는 model-visible stdout에서 제거하고 main thread에서만 recommendation state에 기록한다.
- git/gh/glab/curl usage metrics는 BashTool과 같은 tracker를 쓴다.

PowerShell external command exit semantics:

- 기본은 exit code 0만 success다.
- `grep`, `rg`, `findstr`는 exit 1을 "no matches"로 해석한다.
- `robocopy`는 0-7을 success, 8 이상을 error로 해석한다.
- PowerShell-native cmdlet은 `$?`/terminating error 체계라 별도 exit code semantics가 필요하지 않다.

Agentica 적용:

- 장기 실행 operation은 function call result와 background task를 분리해야 한다.
- result success 판단은 transport status code 하나가 아니라 domain semantic interpreter를 거쳐야 한다.
- output reference, preview, full output storage는 shell뿐 아니라 모든 large external operation에 적용 가능하다.

## PowerShell Parser

`utils/powershell/parser.ts`는 string regex parser가 아니라 PowerShell 자체 AST parser를 spawn한다.

동작:

- `pwsh -NoProfile -NonInteractive -NoLogo -EncodedCommand ...`를 실행한다.
- user command는 UTF-8 base64로 script 변수에 전달되고, wrapper script는 UTF-16LE `-EncodedCommand`로 실행된다.
- `System.Management.Automation.Language.Parser.ParseInput` 결과를 JSON으로 만든다.
- statement, pipeline element, command element, redirection, variable, type literal, stop-parsing token, using statement, `#Requires`를 추출한다.
- parse timeout 기본은 5초이고 env로 조정 가능하다.
- command length 제한을 둔다.
- valid parse만 LRU cache에 남긴다. transient spawn failure는 cache에서 제거한다.

보안상 중요한 점:

- parse 실패는 allow가 아니라 ask로 fallback한다.
- parse 실패 상태에서도 raw deny/ask rule과 일부 dangerous removal scan은 먼저 돌린다.
- alias map은 `Object.create(null)`로 prototype pollution을 막는다.
- PowerShell의 en dash/em dash/horizontal bar/`/` parameter prefix를 고려한다.

Agentica 적용:

- shell policy를 만들려면 shell family별 structured parser adapter가 필요하다.
- parser unavailable/timeout/too-long은 "안전"이 아니라 "검증 불가" 상태다.
- parser cache는 valid result만 보존하고 transient failure를 고정하지 않는다.

## Permission Flow

`powershellPermissions.ts`의 permission flow는 BashTool보다 더 명시적으로 collect-then-reduce 구조를 쓴다.

순서:

1. raw exact deny/ask/allow rule 검사
2. prefix/wildcard deny rule 검사
3. parse 실패 fallback deny scan
4. security checks를 decision list에 추가
5. provider/UNC/path/git/link/archive/path constraint 결정을 추가
6. exact allow와 read-only allow를 추가
7. `deny > ask > allow > passthrough`로 reduce
8. 남은 sub-command별 approval suggestion 생성

중요한 원칙:

- deny가 ask보다 항상 우선한다.
- ask가 allow보다 항상 우선한다.
- sub-command deny가 earlier ask에 가려지면 안 된다.
- PowerShell은 case-insensitive matching을 기본으로 한다.
- allow rule은 module prefix stripping을 조심해야 한다. deny/ask over-match는 괜찮지만 allow over-match는 fail-open이다.
- exact suggestion은 multiline과 `*`를 포함한 command에서 만들지 않는다.
- path-like command name은 cmdlet allow rule로 auto-allow하지 않는다.

보안 check 예:

- `Invoke-Expression`/`iex`
- dynamic command name
- nested `pwsh`/`powershell`
- `-EncodedCommand`
- download cradle
- standalone download utility
- `using module`/`using assembly`
- `#Requires -Modules`
- non-filesystem provider path: `env:`, `HKLM:`, `function:`, `cert:` 등
- UNC path credential leak
- PowerShell constrained language mode type allowlist
- script block/subexpression/member invocation/splatting/assignment/expandable string
- archive extraction + git bare repository TOCTOU
- `.git/` write and git internal path write
- symlink/junction/hardlink creation followed by later path use

Agentica 적용:

- permission policy는 early return으로 흩어지면 우선순위 버그가 생긴다.
- `deny > ask > allow` reduce를 공통 policy primitive로 둔다.
- allow rule normalization은 deny rule normalization보다 보수적이어야 한다.
- compound operation은 sub-operation별 deny/ask를 먼저 모은 뒤 최종 판단해야 한다.

## Read-only와 Path Validation

`readOnlyValidation.ts`는 PowerShell cmdlet allowlist를 별도로 가진다.

특징:

- cmdlet은 lowercase canonical name으로 관리한다.
- 각 cmdlet마다 safe flags를 둔다.
- flags 전체가 read-only인 cmdlet은 `allowAllFlags`를 명시한다.
- `argLeaksValue()`는 `$env:SECRET`, script block, hashtable, subexpression, expandable string 같은 value leak을 막는다.
- `Get-Clipboard`, `Get-Command`, `Get-Help`, WMI/CIM instance 조회 등은 auto-allow하지 않는다.
- external `git`, `gh`, `docker` 등은 shared read-only command validator를 재사용한다.

`pathValidation.ts`는 cmdlet별 path parameter schema를 둔다.

- operation type은 read/write/create로 나뉜다.
- path param, known switch, known value param을 명시한다.
- unknown param은 ask로 fallback한다.
- PowerShell wildcard는 `* ? [ ]`만 본다. brace는 literal이다.
- provider path와 local path를 분리한다.
- dangerous removal path는 deny한다.
- path validation은 working directory allowlist, internal path safety, Edit deny rule과 연결된다.

`modeValidation.ts`의 acceptEdits auto-allow는 좁다.

- `Set-Content`
- `Add-Content`
- `Remove-Item`
- `Clear-Content`

`New-Item`, `Copy-Item`, `Move-Item` 같은 복잡한 write cmdlet은 ask로 둔다. compound command에 cwd-changing cmdlet이나 symlink creation이 있으면 path validation stale cwd/TOCTOU 때문에 auto-allow하지 않는다.

Agentica 적용:

- read-only 분류는 method/name heuristic만으로 충분하지 않다.
- argument shape, path binding, provider/source, variable expansion, redirect, nested expression을 함께 봐야 한다.
- `acceptEdits` 같은 mode auto-allow는 가장 좁은 safe subset부터 시작해야 한다.

## REPL Mode와 Primitive Tools

`tools/REPLTool/constants.ts`는 REPL mode를 제어한다.

REPL enable policy:

- `CLAUDE_CODE_REPL=0`이면 off다.
- legacy `CLAUDE_REPL_MODE=1`이면 on이다.
- ant/native interactive CLI에서는 default-on이다.
- SDK entrypoints에서는 default-on이 아니다. SDK 사용자는 Bash/Read/Edit 같은 direct tool call을 script로 쓰기 때문이다.

`REPL_ONLY_TOOLS`:

- `Read`
- `Write`
- `Edit`
- `Glob`
- `Grep`
- `Bash`
- `NotebookEdit`
- `Agent`

`tools.ts`는 REPL mode가 켜지고 REPL tool이 tool list에 있으면 위 primitive tools를 direct model use에서 숨긴다. 단, `PowerShell`은 현재 `REPL_ONLY_TOOLS`에 포함되어 있지 않다.

`REPLTool/primitiveTools.ts`는 hidden primitive tools를 lazy registry로 보존한다.

이 registry는 실행용 direct list가 아니라 display/collapse용 fallback이다.

- `CollapsedReadSearchContent.tsx`는 hidden primitive tool renderer를 찾는다.
- `collapseReadSearch.ts`는 REPL wrapper 자체를 absorbed/silent로 처리한다.
- REPL 내부 virtual messages가 Read/Grep/Bash 등으로 방출될 때 기존 collapse/read/search 분류를 계속 쓸 수 있다.

prompt 조정:

- REPL mode에서는 "dedicated tools over Bash" guidance를 제거한다.
- Read/Grep/Bash가 direct tool list에서 숨겨졌기 때문이다.

Agentica 적용:

- scripting/REPL wrapper를 만들면 primitive operation list와 direct operation list를 분리해야 한다.
- 숨긴 primitive도 renderer, result projection, compact/collapse, permission audit에서는 계속 식별 가능해야 한다.
- alternate shell tool을 REPL primitive set에 넣을지 독립 direct tool로 둘지 명시해야 한다.
- `PowerShell`처럼 platform-specific tool이 primitive set에서 빠지는 경우 direct model surface가 의도치 않게 넓어질 수 있으므로 검증 항목으로 둔다.

## Bash와 PowerShell의 차이

| 축 | BashTool | PowerShellTool |
| --- | --- | --- |
| tool gate | 기본 tool | Windows + env/user type gate |
| parser | bash/tree-sitter/command spec 중심 | spawned PowerShell AST parser |
| shell provider | bash/zsh snapshot, login shell fallback | pwsh/powershell detection, `-NoProfile`, `-EncodedCommand` sandbox path |
| path semantics | POSIX/Git Bash 변환, glob/extglob/heredoc 처리 | provider path, UNC, cmdlet path params, alias canonicalization |
| sandbox | POSIX sandbox path 중심 | Windows native sandbox unavailable gate |
| read-only | command/flag/spec allowlist | cmdlet/parameter/AST allowlist |
| permission rules | shell prefix/exact/wildcard | case-insensitive, alias canonical, module-prefix-aware |
| default routing | default fallback | explicit settings/defaultShell only |

Agentica는 Bash/PowerShell을 하나의 `ShellOperation`으로 뭉개면 안 된다. 최소한 다음 abstraction이 필요하다.

```ts
interface AgenticaShellProvider {
  family: "bash" | "powershell";
  platformGate(): boolean;
  parse(command: string): Promise<AgenticaShellParseResult>;
  classifyReadOnly(parsed: AgenticaShellParseResult): AgenticaPolicyDecision;
  validatePaths(parsed: AgenticaShellParseResult): AgenticaPolicyDecision;
  interpretResult(result: AgenticaShellRawResult): AgenticaShellResultSemantics;
  buildSpawn(command: string, policy: AgenticaShellSpawnPolicy): Promise<AgenticaShellSpawnRequest>;
}
```

초기 Agentica core에는 shell executor를 공개 API로 넣기보다, operation policy/state 설계의 참고 모델로 둔다. 필요해지면 `Agentica` 전용 runtime wrapper나 optional capability pack으로 도입한다.

## MicroAgentica 비적용

`MicroAgentica`에 적용하지 않는다.

금지:

- shell provider registry 주입
- PowerShell parser/permission gate 연결
- REPL primitive hiding
- task output/background shell runtime 연결
- defaultShell setting 반영

`MicroAgentica`의 장점은 function-call facade가 작고 예측 가능하다는 점이다. shell/platform policy는 `Agentica` runtime extension으로만 다룬다.

## Agentica 설계 반영

필수 원칙:

1. platform-specific operation은 visibility gate를 가진다.
2. gate는 tool list, prompt expansion, input routing에서 동일하게 적용한다.
3. shell family별 parser/provider/policy namespace를 분리한다.
4. parser failure는 allow가 아니라 ask/deny fallback이다.
5. permission decision은 collect-then-reduce로 `deny > ask > allow`를 강제한다.
6. exact allow와 prefix allow는 path-like executable/script name에 적용하지 않는다.
7. read-only classification은 argument/path/provider/source/value-leak 검사를 포함한다.
8. result semantic interpreter는 operation family별로 둘 수 있다.
9. hidden primitive operation도 renderer/projection/compact/audit registry에는 남겨야 한다.
10. direct operation list와 scripting/REPL-internal primitive list를 분리한다.
11. sandbox capability는 platform별로 명시하고, policy가 요구하는데 platform이 지원하지 않으면 실행을 거부한다.
12. `MicroAgentica`는 변경하지 않는다.

Permission UI/control flow와 shell permission engine 연결은 [Tool Permission Control Flow 분석](./tool-permission-control-flow.md)에 후속 정리했다.
