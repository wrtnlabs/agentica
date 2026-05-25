# Claude Code Slash Command Catalog 분석

## 범위

이 문서는 `/home/samchon/github/samchon/claude-code/src/commands`의 개별 slash command를 Agentica 적용 관점에서 분류한 1차 catalog다.

주요 근거 파일:

- `/home/samchon/github/samchon/claude-code/src/commands.ts`
- `/home/samchon/github/samchon/claude-code/src/types/command.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/add-dir/*`
- `/home/samchon/github/samchon/claude-code/src/commands/clear/*`
- `/home/samchon/github/samchon/claude-code/src/commands/branch/*`
- `/home/samchon/github/samchon/claude-code/src/commands/resume/*`
- `/home/samchon/github/samchon/claude-code/src/commands/copy/*`
- `/home/samchon/github/samchon/claude-code/src/commands/export/*`
- `/home/samchon/github/samchon/claude-code/src/commands/model/*`
- `/home/samchon/github/samchon/claude-code/src/commands/fast/*`
- `/home/samchon/github/samchon/claude-code/src/commands/effort/*`
- `/home/samchon/github/samchon/claude-code/src/commands/permissions/*`
- `/home/samchon/github/samchon/claude-code/src/commands/hooks/*`
- `/home/samchon/github/samchon/claude-code/src/commands/plan/*`
- `/home/samchon/github/samchon/claude-code/src/commands/sandbox-toggle/*`
- `/home/samchon/github/samchon/claude-code/src/commands/login/*`
- `/home/samchon/github/samchon/claude-code/src/commands/logout/*`
- `/home/samchon/github/samchon/claude-code/src/commands/bridge/*`
- `/home/samchon/github/samchon/claude-code/src/commands/install-github-app/*`
- `/home/samchon/github/samchon/claude-code/src/commands/commit.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/commit-push-pr.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/init.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/init-verifiers.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/review.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/security-review.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/pr_comments/index.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/statusline.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/insights.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/agents/*`
- `/home/samchon/github/samchon/claude-code/src/commands/btw/*`
- `/home/samchon/github/samchon/claude-code/src/commands/chrome/*`
- `/home/samchon/github/samchon/claude-code/src/commands/config/*`
- `/home/samchon/github/samchon/claude-code/src/commands/desktop/*`
- `/home/samchon/github/samchon/claude-code/src/commands/doctor/*`
- `/home/samchon/github/samchon/claude-code/src/commands/exit/*`
- `/home/samchon/github/samchon/claude-code/src/commands/feedback/*`
- `/home/samchon/github/samchon/claude-code/src/commands/keybindings/*`
- `/home/samchon/github/samchon/claude-code/src/commands/mcp/*`
- `/home/samchon/github/samchon/claude-code/src/commands/remote-setup/*`
- `/home/samchon/github/samchon/claude-code/src/commands/skills/*`
- `/home/samchon/github/samchon/claude-code/src/commands/tasks/*`
- `/home/samchon/github/samchon/claude-code/src/commands/terminalSetup/*`
- `/home/samchon/github/samchon/claude-code/src/commands/voice/*`
- `/home/samchon/github/samchon/claude-code/src/commands/install.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/agents/AgentsMenu.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/skills/SkillsMenu.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/tasks/BackgroundTasksDialog.tsx`

`/compact`, `/context`, `/memory`의 깊은 분석은 [slash-command-runtime.md](./slash-command-runtime.md)에 있다. 이 문서는 그 밖의 command를 catalog화한다.

## Registry 관찰

Claude Code command registry는 builtin command만 모으지 않는다. `getCommands(cwd)`는 bundled skill, builtin plugin skill, `.claude/skills` command, workflow command, plugin command, plugin skill, builtin command를 합친 뒤 `availability`와 `isEnabled()`를 매번 재평가한다.

중요한 점:

- `availability`는 auth/provider gate다. 예를 들어 `claude-ai`, `console`은 Anthropic 1P provider만 통과한다.
- `isEnabled()`는 feature flag, env var, platform, policy, subscription 상태를 본다.
- dynamic skills는 runtime file touch 이후 발견되어 builtin command 앞에 삽입된다.
- `prompt` command 중 source가 builtin이 아닌 것은 SkillTool/model invocation 후보가 될 수 있다.
- `local-jsx` command는 bridge-safe가 아니고, `local` command는 allowlist 없이는 bridge에서 차단된다.
- remote mode command set과 bridge inbound command set은 서로 다르다.

Agentica 결론: command registry는 static enum이 아니라 capability registry의 일부다. selector/skill discovery와 같은 invalidation, source annotation, availability filter가 필요하다.

Feature-gated command audit:

- `commands.ts`는 `feature()`와 `require()`를 섞어 external build에서 ant-only module을 dead-code-eliminate한다.
- snapshot에는 `assistant`, `proactive`, `force-snip`, `workflows`, `subscribe-pr`, `torch`, `peers`, `fork`, `buddy`, `remoteControlServer`, `agents-platform` 구현 파일이 보이지 않거나 stub만 보인다. registry 흔적만 설계 근거로 삼고, 구현 세부는 확인된 파일처럼 취급하지 않는다.
- `INTERNAL_ONLY_COMMANDS`는 user type과 demo gate를 타며, 외부 공개 command surface와 분리된다.
- `REMOTE_SAFE_COMMANDS`와 `BRIDGE_SAFE_COMMANDS`는 서로 다르다. remote mode에서 보이는 command와 remote-control bridge inbound로 실행 가능한 command를 같은 allowlist로 다루면 안 된다.

## Command Type별 의미

| type | Claude Code 의미 | Agentica 번역 |
| --- | --- | --- |
| `prompt` | prompt block으로 확장되어 model turn을 시작 | model-facing workflow prompt |
| `local` | runtime action 후 `text`, `compact`, `skip` 반환 | typed local control transaction |
| `local-jsx` | Ink UI를 띄우고 `onDone` callback으로 종료 | adapter-owned interactive control |

`LocalJSXCommandOnDone`은 `display: skip | system | user`, `shouldQuery`, `metaMessages`, `nextInput`을 지원한다. 즉 command 결과는 항상 user transcript에 붙는 것이 아니다. 일부는 UI-only이고, 일부는 hidden model-visible message를 추가할 수 있다.

## Prompt-expanding Commands

### `/commit`

`commit.ts`는 builtin `prompt` command다. prompt 안에서 `git status`, `git diff HEAD`, `git branch --show-current`, `git log --oneline -10`을 `executeShellCommandsInPrompt()`로 미리 실행해 context에 넣는다.

특징:

- command-specific `allowedTools`를 `Bash(git add:*)`, `Bash(git status:*)`, `Bash(git commit:*)`로 제한한다.
- `toolPermissionContext.alwaysAllowRules.command`에 allowed tool을 주입한 context로 prompt shell을 실행한다.
- amend, skip hooks, secret commit, interactive git command를 명시적으로 금지한다.

Agentica 적용: workflow prompt command는 단순 텍스트 macro가 아니라 preflight shell/context expansion과 command-scoped tool permission을 가진다. Agentica에 유사 기능을 넣으면 allowed operation override가 prompt lifetime에만 적용되어야 한다.

### `/commit-push-pr`

`commit-push-pr.ts`는 commit, branch, push, PR 생성까지 이어지는 internal prompt command다.

특징:

- `getDefaultBranch()`와 PR attribution을 동적으로 계산한다.
- `git diff <defaultBranch>...HEAD`, `gh pr view`, user/SAFEUSER를 prompt context로 넣는다.
- allowed tools는 git/gh/slack/ToolSearch로 제한한다.
- 기존 PR이 있으면 `gh pr edit`, 없으면 `gh pr create`를 하도록 지시한다.
- Slack posting은 CLAUDE.md 언급과 ToolSearch 결과, 사용자 확인 후에만 수행한다.

Agentica 적용: multi-step side-effect workflow는 command 자체가 executor가 아니라 안전 절차를 포함한 model prompt로 작동할 수 있다. 다만 command-scoped allowlist와 user confirmation boundary가 없으면 위험하다.

### `/init`

`init.ts`는 CLAUDE.md, CLAUDE.local.md, skill, hook을 설정하는 긴 prompt command다.

OLD prompt는 codebase를 분석해 CLAUDE.md를 만들라고 지시한다. NEW prompt는 다음 phase를 포함한다.

- `AskUserQuestion`으로 project/personal/both와 skills/hooks 선택
- subagent로 repo survey
- gap-fill 질문
- artifact proposal preview
- CLAUDE.md/CLAUDE.local.md 작성
- `.claude/skills/*/SKILL.md` 생성
- hook reference skill 로딩
- GitHub CLI, lint, frontend/plugin suggestion

Agentica 적용: project bootstrap은 prompt strategy와 tool capability, user interaction, local file write policy가 결합된 command다. 이것을 core API로 넣기보다 adapter/workflow layer로 둬야 한다.

### `/init-verifiers`

`init-verifiers.ts`는 verifier skill 생성을 위한 prompt command다.

핵심 단계:

- project area autodetection
- web/CLI/API verifier type 선택
- Playwright, Chrome DevTools MCP, Claude Chrome Extension 등 verification tool setup
- auth/login flow 질문
- `.claude/skills/<verifier-name>/SKILL.md` 생성
- verifier folder naming convention과 self-update instruction 명시

Agentica 적용: verification capability도 code generator prompt로 만들 수 있다. Agentica Next의 검증 전략은 이런 command를 core loop에 섞지 말고 project skill/capability generation workflow로 둔다.

### `/review`, `/ultrareview`

`review.ts`의 `/review`는 local `prompt` command다. `gh pr list/view/diff`를 사용하도록 지시하고, correctness, convention, performance, test, security를 검토하게 한다.

`/ultrareview`는 `local-jsx` command다. 별도 remote bughunter path의 유일한 entry point이며, free review 소진 시 overage permission dialog를 렌더링한다.

Agentica 적용: 같은 "review" UX라도 local model prompt와 remote service action은 별도 command type으로 나누어야 한다.

### `/security-review`

`security-review.ts`는 marketplace plugin으로 이동한 command를 fallback prompt로 제공한다. external user에게는 markdown frontmatter에서 allowed tools를 파싱하고 `git status`, `git diff`, `git log`를 prompt shell로 확장한다. ANT user에게는 plugin 설치 안내 prompt만 반환한다.

특징:

- 보안 리뷰 범위를 "신규 PR 변경의 high-confidence exploitability"로 좁힌다.
- DOS, secret-on-disk, docs, tests, low-confidence issue 등 false positive exclusion이 매우 상세하다.
- sub-task로 vulnerability identification과 false-positive filtering을 분리한다.

Agentica 적용: command는 deprecated/moved-to-plugin transition도 표현해야 한다. Agentica capability registry에도 builtin fallback, plugin redirect, marketplace migration 상태가 필요하다.

### `/pr-comments`

`pr_comments/index.ts`도 moved-to-plugin fallback prompt다. `gh api`로 issue comments와 review comments를 가져와 diff hunk, path, line, replies를 formatting하라고 지시한다.

Agentica 적용: external integration command는 "model이 gh를 쓰는 prompt"와 "connector가 직접 호출하는 adapter"를 분리할 수 있어야 한다.

### `/statusline`

`statusline.tsx`는 prompt command지만 내용은 `AgentTool` 호출 지시다.

- allowed tools: AgentTool, `Read(~/**)`, `Edit(~/.claude/settings.json)`
- noninteractive disabled
- args가 없으면 shell PS1 기반으로 statusLine을 구성하라고 한다.

Agentica 적용: prompt command가 subagent/tool invocation을 생성하는 bridge 역할을 할 수 있다. command prompt의 allowed tool 범위를 명확히 해야 한다.

### `/btw`

`btw.tsx`는 side question command다. 현재 conversation을 직접 이어가지 않고 forked agent로 짧은 질문을 던진다.

핵심:

- `getLastCacheSafeParams()`가 있으면 직전 main request의 system prompt/user context/system context bytes를 재사용해 prompt cache hit 가능성을 높인다.
- compact boundary 이후 메시지만 fork context로 쓰고, 진행 중인 assistant message는 제거한다.
- fallback으로 system/user/system context를 다시 만든다.
- 결과는 `Markdown` UI로 보여주고, 닫으면 `display: skip`으로 transcript 오염을 피한다.
- global config의 `btwUseCount`만 갱신한다.

Agentica 적용: "질문 하나 더" UX는 main model loop의 user turn이 아니라 side-query/fork runtime이다. side query 결과를 public history에 자동 append하면 다음 turn의 model context를 오염시킨다. Agentica에는 `AgenticaSideQueryRuntime` 또는 adapter-owned preview가 필요하다.

### `/insights`

`insights.ts`는 heavy module이라 `commands.ts`가 lazy shim으로 감싼다. 실제 command는 session logs/facets를 분석하고 HTML report를 만들며, ANT user는 remote homespace session collection과 S3 upload를 시도한다.

Agentica 적용: report command는 runtime read/report side effect와 model response prompt를 함께 가진다. output URL, local path, upload hint 같은 값은 public history 노출 정책을 별도로 둬야 한다.

## Session/Transcript Commands

### `/clear`

`clear`는 단순 `messages=[]`가 아니다.

주요 동작:

- SessionEnd hook 실행
- cache eviction hint emit
- foreground task kill, background local/in-process teammate task 보존
- conversation id/session id 재생성
- cwd/readFileState/discovered skills/nested memory reset
- MCP clients/tools/commands/resources reset
- plan slug, session metadata, session file pointer reset
- preserved task output symlink 재연결
- SessionStart hook 실행 및 hook message 삽입
- user/system/git context cache, file suggestion, command/skill cache, prompt cache, memory cache, images, permissions callback 등 광범위 cache clear

Agentica 적용: reset/new session은 transaction이다. history만 지우면 task, permission, connector, memory cache가 stale해진다.

### `/resume`

`resume.tsx`는 current repo logs 또는 all projects logs를 로딩하고, current session과 sidechain을 제외한다.

특징:

- 같은 repo/worktree면 `context.resume(sessionId, log, entrypoint)` 호출 후 `display: skip`
- 다른 project면 `claude -r` command를 clipboard에 복사하고 안내만 한다.
- args가 있으면 UUID lookup, filtered log lookup, custom title exact match를 순서대로 시도한다.

Agentica 적용: resume은 history append가 아니라 runtime state switch다. cross-project resume은 adapter command로 둬야 한다.

### `/branch`

`branch.ts`는 현재 transcript file을 복사해 새로운 session id를 만든다.

핵심:

- sidechain을 제외하고 main conversation만 복사한다.
- sessionId, parentUuid, isSidechain을 새 session에 맞게 rewrite한다.
- `forkedFrom` trace를 추가한다.
- content replacement entry의 sessionId도 rewrite한다. 그렇지 않으면 resume reconstruct 시 full tool result가 들어갈 수 있기 때문이다.
- fork transcript는 `0600` mode로 쓴다.
- title에는 `(Branch)` suffix collision 처리를 한다.

Agentica 적용: branch/fork는 history copy가 아니라 transcript identity와 content replacement/reference를 보존하는 structured fork다.

### `/rewind`

`rewind.ts`는 command 자체가 복구를 수행하지 않고 `context.openMessageSelector`를 띄운 뒤 `{ type: "skip" }`을 반환한다.

Agentica 적용: rewind UI는 adapter trigger다. 실제 rollback/replay transaction은 command에서 분리해야 한다.

### `/rename`

`rename.ts`는 current session custom title과 standalone agent name을 갱신한다.

특징:

- teammate rename은 막는다.
- args가 없으면 compact boundary 이후 메시지에서 title을 생성한다.
- transcript path에 custom title/agent name을 저장한다.
- bridge session title update는 best-effort다.

Agentica 적용: naming은 model message가 아니라 session metadata mutation이다.

### `/tag`

`tag.tsx`는 ANT-only command다. unicode sanitize 후 현재 session tag를 toggle하고, 동일 tag가 있으면 removal confirmation UI를 띄운다.

Agentica 적용: tag는 resume/search metadata다. history text에 넣지 않는다.

### `/copy`, `/export`, `/diff`, `/files`, `/cost`, `/release-notes`

이 계열은 transcript/materialized view command다.

- `/copy`: 최근 assistant text 20개에서 code block을 추출해 OSC clipboard 또는 temp file fallback으로 복사한다. full response copy setting을 저장할 수 있다.
- `/export`: tool renderer로 conversation을 plain text로 렌더링하고 `.txt` 파일로 쓰거나 dialog를 띄운다.
- `/diff`: current messages 기반 diff dialog를 렌더링한다.
- `/files`: `readFileState` cache key를 상대 경로로 보여준다. bridge-safe다.
- `/cost`: subscription/overage/user type에 따라 cost 또는 usage state를 보여준다.
- `/release-notes`: 500ms fresh changelog fetch를 시도하고 cached notes 또는 URL로 fallback한다. bridge-safe다.

Agentica 적용: transcript export/copy/diff는 core model loop가 아니라 adapter-side materialization이다. 파일 경로, temp path, clipboard 결과는 public model history에 넣지 않는다.

### `/skills`, `/agents`, `/tasks`

이 셋은 모두 runtime registry/control UI다.

- `/skills`는 prompt command 중 `loadedFrom`이 `skills`, deprecated `commands`, `plugin`, `mcp`인 항목만 그룹화해 보여준다. source별 path/server/plugin name과 frontmatter token estimate를 표시한다.
- `/agents`는 built-in/user/project/local/policy/flag/plugin agent를 source별로 묶고, active override를 resolve한다. create/edit/delete는 agent file과 AppState의 `agentDefinitions`를 함께 갱신한다.
- `/tasks`는 background task registry를 보여준다. local bash, remote agent, local agent, in-process teammate, workflow, MCP monitor, dream task를 list item으로 normalize하고, detail dialog에서 foreground/stop/retry/skip/kill 같은 task-specific action을 제공한다.

Agentica 적용: skills/agents/tasks는 "명령 결과 텍스트"가 아니다. capability registry, agent registry, task registry의 materialized view와 control surface다. 이 목록을 public history에 append하지 말고 adapter projection과 internal registry state로 유지해야 한다.

## Workspace/Permission/Mode Commands

### `/add-dir`

`add-dir`는 working directory allowlist를 늘리는 command다.

동작:

- `expandPath`, `resolve`, `stat`으로 path validation
- 이미 accessible한 path는 거부
- user가 remember scope를 고르면 `PermissionUpdate { type: "addDirectories", destination: session | localSettings }` 생성
- `toolPermissionContext`, bootstrap additional dirs, sandbox config, local settings를 갱신

Agentica 적용: workspace scope 추가는 permission/runtime config update다. 모델 prompt에 path를 그냥 넣는 것으로 대체하면 안 된다.

### `/permissions`

`permissions.tsx`는 permission rule list UI를 띄운다. `onRetryDenials`는 `createPermissionRetryMessage(commands)`를 messages에 append한다.

Agentica 적용: permission UI가 model-visible retry message를 만들 수 있다. permission result의 transcript 정책을 typed로 분리해야 한다.

### `/hooks`

`hooks.tsx`는 현재 tool permission context에서 tool list를 resolve하고 `HooksConfigMenu`를 렌더링한다. hook execution이 아니라 hook configuration UI다.

Agentica 적용: hook config command와 hook runtime execution은 별도 subsystem이다.

### `/plan`

`plan.tsx`는 mode command다.

동작:

- 현재 mode가 plan이 아니면 `handlePlanModeTransition`, `prepareContextForPlanMode`, `PermissionUpdate { type: "setMode", mode: "plan", destination: "session" }` 적용
- args가 description이면 `shouldQuery: true`로 model turn을 이어갈 수 있다.
- 이미 plan mode면 current plan을 문자열로 렌더링하거나 `/plan open`으로 editor를 연다.

Agentica 적용: plan은 prompt label이 아니라 permission mode 전환이다. optional args가 다음 model query trigger가 될 수 있다.

### `/sandbox`

`sandbox-toggle`은 platform/dependency/policy lock을 확인하고, no args면 settings UI를 띄운다. `exclude "pattern"` subcommand는 local settings에 excluded command pattern을 추가한다.

Agentica 적용: sandbox setting은 shell/provider policy의 일부다. command pattern exclusion은 permission rule과 같은 감사 대상이다.

## Runtime Setting Commands

### `/model`

`model.tsx`는 model picker 또는 direct set command다.

특징:

- org allowlist와 1M context entitlement를 검사한다.
- alias와 `validateModel()`을 통해 model string을 검증한다.
- `mainLoopModel`을 바꾸고 `mainLoopModelForSession`을 null로 한다.
- fast mode와 호환되지 않는 model이면 fast mode를 끈다.
- extra usage billing 표시가 필요한 경우 안내한다.

Agentica 적용: model change는 runtime state mutation이며 selector/projector/token budget에 즉시 반영되어야 한다.

### `/fast`

`fast.tsx`는 fast mode picker/toggle이다. org unavailable reason, runtime cooldown, pricing/extra usage 상태를 본다. 적용 시 user settings를 저장하고 필요하면 fast model로 변경한다.

Agentica 적용: model mode와 billing/availability는 public API config만으로 표현하기 어렵다. runtime state observer가 필요하다.

### `/effort`

`effort.tsx`는 `low|medium|high|max|auto`를 user settings에 저장하고 `appState.effortValue`를 갱신한다. `CLAUDE_CODE_EFFORT_LEVEL` env가 있으면 effective session 값이 env로 override된다.

Agentica 적용: effort/reasoning level은 user config, env override, active request projection을 분리한다.

### `/advisor`

`advisor.ts`는 local command로 advisor model을 설정하거나 해제한다.

특징:

- base model이 advisor를 지원하는지 확인한다.
- advisor model validity를 검증한다.
- userSettings와 AppState를 함께 갱신한다.
- noninteractive 지원 command다.

Agentica 적용: assistant-side advisor/critic model을 넣더라도 main model capability와 별도 enablement가 필요하다.

### `/extra-usage`

`extra-usage-core.ts`는 extra usage page open 또는 admin request creation을 처리한다.

특징:

- visited flag와 overage credit grant cache를 갱신한다.
- team/enterprise에서 billing 권한이 없으면 pending/dismissed request를 확인하고 admin request를 만들 수 있다.
- noninteractive path는 opened URL/text result를 반환한다.

Agentica 적용: account/billing command는 model workflow가 아니라 external account control이다.

### UI/local preferences

`/config`, `/status`, `/theme`, `/color`, `/vim`, `/keybindings`, `/ide`, `/terminal-setup`, `/output-style` 등은 settings UI 또는 local preference command다.

- `/vim`: global config `editorMode`를 normal/vim으로 toggle한다.
- `/keybindings`: keybindings file을 `wx`로 안전 생성하고 editor로 연다. existing file stat 후 write가 아니라 exclusive create로 TOCTOU를 피한다.
- `/status`: settings UI의 Status tab을 연다.
- `/theme`, `/color`: terminal/agent visual preference다.
- `/config`와 `/status`는 같은 `Settings` component를 서로 다른 tab으로 여는 proxy command다.
- `/output-style`은 deprecated hidden command이며 `/config`로 이동하라는 system display만 반환한다.

Agentica 적용: adapter preference는 core history에 넣지 않는다.

### `/terminal-setup`, native `/install`, `/exit`

이 계열은 local machine mutation 또는 process lifecycle command다.

`terminal-setup.tsx`는 terminal 종류별로 다른 파일/OS 설정을 수정한다.

- native CSI-u terminal은 no-op 안내만 한다.
- VSCode/Cursor/Windsurf/Zed는 keybindings JSON/JSONC를 수정한다.
- Apple Terminal은 plist backup을 만들고 Option-as-Meta, visual bell을 설정한 뒤 실패 시 backup restore를 시도한다.
- Alacritty는 config path 후보를 찾아 TOML binding을 append하고 backup을 만든다.
- VSCode Remote SSH에서는 remote server에서 local keybindings를 수정할 수 없으므로 수동 안내로 종료한다.
- 성공 후 global config marker와 onboarding completion을 갱신한다.

`install.tsx`는 slash command registry가 아니라 CLI install flow에서 쓰이는 local-jsx command다. native build install, launcher/shell integration, old npm install cleanup, shell alias cleanup, auto update channel 저장을 한 transaction으로 처리한다.

`exit.tsx`는 일반 종료만 하지 않는다. background session이면 tmux detach를 수행하고, worktree session이면 `ExitFlow`를 띄우며, 일반 경우에는 graceful shutdown을 호출한다.

Agentica 적용: local machine mutation은 `adapterIntent`보다 더 강한 `localMachineMutation` 분류가 필요하다. 파일 backup, exclusive create, restore, platform/remote-SSH gate, process detach/shutdown은 model-visible command output과 분리해야 한다.

## Remote/Account/Integration Commands

### `/session`

remote mode에서 remote session URL과 QR을 보여준다. remote mode가 아니면 안내 UI만 렌더링한다.

Agentica 적용: remote session URL/QR은 adapter display state다. core runtime에는 remote session id/status만 둔다.

### `/remote-control`

`bridge/index.ts`, `bridge/bridge.tsx`는 bidirectional bridge connection을 toggle한다.

핵심:

- feature flag와 bridge enablement gate를 통과해야 command가 보인다.
- org policy `allow_remote_control`, bridge disabled reason, min version, access token을 preflight로 검사한다.
- first-time remote callout을 보여줄 수 있다.
- connect 시 AppState의 `replBridgeEnabled`, `replBridgeExplicit`, `replBridgeOutboundOnly`, `replBridgeInitialName`을 갱신한다.
- 이미 연결되어 있으면 session URL/QR과 disconnect/continue dialog를 보여준다.

Agentica 적용: remote connection은 command stdout이 아니라 transport lifecycle state transition이다.

### `/mobile`, `/desktop`, `/chrome`, `/remote-env`, `/web-setup`

- `/mobile`: iOS/Android app URL QR selector를 표시한다.
- `/desktop`: DesktopHandoff UI를 표시한다.
- `/chrome`: Claude AI availability와 noninteractive disable gate를 가진 browser integration command다. Chrome extension installed/connected 상태를 MCP client state에서 보고, install/reconnect/permission URL을 browser/Chrome으로 연다. WSL과 non-subscriber는 UI 안에서 disable된다.
- `/remote-env`: remote environment dialog를 표시한다.
- `/web-setup`: remote sessions policy와 feature flag가 켜진 경우 Claude Code on the web setup UI를 표시한다. local `gh auth token`을 읽어 redacted token confirmation을 거친 뒤 web backend로 import하고 default environment 생성은 best-effort로 처리한다.

Agentica 적용: device/browser/web setup command는 adapter integration이다. core가 직접 UI를 소유하지 않는다.

### `/login`, `/logout`

`login.tsx`는 OAuth login 성공 후 광범위한 auth-dependent cache를 갱신한다.

- API key changed callback
- signature-bearing blocks stripping
- cost state reset
- remote managed settings, policy limits, user cache, GrowthBook refresh
- trusted device token clear/re-enroll
- bypass/auto mode killswitch gate reset
- `authVersion` increment

`logout.tsx`는 telemetry flush 후 credentials와 secure storage를 지우고 auth-related caches를 clear한 뒤 graceful shutdown한다.

Agentica 적용: auth change는 connector/capability registry invalidation event다. 기존 transcript의 signed/thinking blocks를 그대로 재사용하면 안 되는 경우가 있다.

### `/install-github-app`, `/install-slack-app`

`install-github-app`는 GitHub CLI, auth scope, repo permission, existing workflow/secret을 검사하고 GitHub Actions workflow와 secret을 설정한다.

특징:

- `gh --version`, `gh auth status -a`, repo admin permission, workflow existence를 검사한다.
- branch를 만들고 `.github/workflows/claude.yml`, `.github/workflows/claude-code-review.yml`를 GitHub contents API로 생성한다.
- API key 또는 OAuth token을 repo secret으로 저장한다.
- PR 생성은 직접 `gh pr create`가 아니라 compare URL을 browser로 연다.

`install-slack-app`는 Slack marketplace URL을 browser로 열고 install count를 global config에 기록한다.

Agentica 적용: third-party setup command는 heavy side effects를 가진 wizard다. core command registry에 넣더라도 adapter/write permission과 browser/open side effect를 별도 classification해야 한다.

### `/usage`, `/upgrade`, `/privacy-settings`, `/passes`

이 계열은 claude.ai account/subscription gated UI command다. plan usage, Max upgrade, privacy settings, referral passes를 다룬다.

Agentica 적용: vendor account UI는 Agentica core 일반 runtime과 분리한다.

### `/voice`

`voice.ts`는 local text command지만 단순 toggle이 아니다.

동작:

- Claude.ai auth와 voice kill-switch를 확인한다.
- toggle off는 settings update만 한다.
- toggle on은 microphone recording availability, STT stream availability, SoX 등 recording dependency, OS microphone permission request를 순서대로 preflight한다.
- 성공 시 `voiceEnabled` user setting을 저장하고 settings change detector를 notify한다.
- push-to-talk keybinding과 STT language normalization/fallback hint를 반환한다.

Agentica 적용: media input mode는 message type 하나가 아니다. device permission, dependency probe, settings mutation, keybinding hint, language fallback state가 결합되어 있으므로 adapter capability와 runtime setting으로 분리해야 한다.

## Diagnostics/Support/Internal Commands

### `/doctor`, `/feedback`, `/help`, `/stats`, `/tasks`

- `/doctor`: installation/settings diagnostic screen
- `/feedback`: current messages와 optional description을 feedback UI에 전달. abort signal과 background task context도 함께 넘길 수 있다.
- `/help`: 현재 filtered commands를 help UI에 전달
- `/stats`: usage/statistics UI
- `/tasks`: background task dialog

Agentica 적용: diagnostic/support command는 model prompt가 아니다. 단, feedback처럼 current messages를 외부 support channel에 전달할 수 있는 command는 privacy policy와 confirmation이 필요하다.

### `/mcp`

`mcp.tsx`는 connector registry UI이면서 일부 direct action을 지원한다.

- `/mcp reconnect <server>`는 `MCPReconnect` dialog를 띄운다.
- `/mcp enable|disable [server|all]`은 AppState MCP client list와 `useMcpToggleEnabled()`를 이용해 enabled state를 바꾼다.
- ANT build에서는 base `/mcp`가 plugin installed tab으로 redirect될 수 있다.
- `ide` pseudo client는 bulk toggle 대상에서 제외한다.

Agentica 적용: connector registry command는 UI command와 direct mutation subcommand를 동시에 가질 수 있다. direct mutation도 public history append가 아니라 registry version bump와 connector reconnect/refresh transition으로 처리해야 한다.

### Internal-only command

`INTERNAL_ONLY_COMMANDS`에는 commit, commit-push-pr, init-verifiers, bughunter, summary, env, oauth-refresh, debug-tool-call, reset-limits, agents-platform, autofix-pr 등 ANT/internal command가 들어간다. 외부 build에서는 제거되거나 user type gate를 탄다.

Agentica 적용: experimental/internal command는 build-time 또는 runtime audience gate가 필요하다. public API에 곧바로 노출하지 않는다.

## Agentica Command Surface 설계로 번역

Agentica에 slash command류를 도입한다면 다음 taxonomy가 필요하다.

```ts
type AgenticaRuntimeCommand =
  | AgenticaPromptCommand
  | AgenticaLocalCommand
  | AgenticaInteractiveCommand;

interface AgenticaCommandBase {
  name: string;
  aliases?: string[];
  description: string;
  source: "builtin" | "project" | "plugin" | "mcp" | "workflow";
  availability?: AgenticaCommandAvailability[];
  isEnabled?: (state: AgenticaRuntimeState) => boolean;
  isSensitive?: boolean;
}

interface AgenticaPromptCommand extends AgenticaCommandBase {
  type: "prompt";
  allowedOperations?: AgenticaOperationRule[];
  buildPrompt(args: string, ctx: AgenticaRuntimeContext): Promise<AgenticaPromptBlock[]>;
}

interface AgenticaLocalCommand extends AgenticaCommandBase {
  type: "local";
  supportsNonInteractive: boolean;
  bridgeSafe?: boolean;
  run(args: string, ctx: AgenticaRuntimeContext): Promise<AgenticaLocalCommandResult>;
}

interface AgenticaInteractiveCommand extends AgenticaCommandBase {
  type: "interactive";
  adapter: "local-ui" | "rpc-ui" | "web";
}
```

Local command result는 최소한 다음을 분리한다.

```ts
type AgenticaLocalCommandResult =
  | { type: "text"; text: string; display: "user" | "system" }
  | { type: "skip" }
  | { type: "compact"; transaction: AgenticaCompactTransaction }
  | { type: "sessionSwitch"; sessionId: string }
  | { type: "permissionUpdate"; updates: AgenticaPermissionUpdate[] }
  | { type: "diagnostic"; summary: string; detailsRef?: string }
  | { type: "adapterIntent"; intent: AgenticaAdapterIntent };
```

## Agentica 적용 원칙

1. `/compact`, `/clear`, `/resume`, `/branch`는 history append가 아니라 session/history transaction이다.
2. `/context`, `/files`, `/cost`, `/release-notes`는 diagnostic/materialized view이며 model input이 아니다.
3. `/memory`, `/add-dir`, `/permissions`, `/hooks`, `/plan`, `/sandbox`는 control plane command다.
4. `/model`, `/fast`, `/effort`, `/advisor`는 runtime state/config mutation이다.
5. `/login`, `/logout`, connector install/setup command는 capability registry invalidation과 secure storage policy를 동반한다.
6. `/copy`, `/export`, browser open, editor open은 adapter side effect다.
7. prompt workflow command는 command-scoped allowed operation을 가질 수 있으나, 그 범위는 해당 invocation에만 유효해야 한다.
8. noninteractive/RPC/remote bridge command surface는 default-deny allowlist로 시작한다.
9. command args와 results는 `isSensitive`, hidden meta message, system display, public history를 명시적으로 선택해야 한다.
10. `MicroAgentica`에는 이 command runtime을 넣지 않는다.

## 잘못 이식하면 생기는 문제

- command를 user text로 저장하면 `/compact`, `/clear`, `/resume`이 transcript를 오염시키고 다음 turn projection이 틀어진다.
- permission/settings command를 model prompt로 처리하면 사용자가 설정한 allow/deny/source 우선순위를 잃는다.
- UI command를 headless/RPC에서 허용하면 terminal picker나 editor/browser side effect가 원격 요청 중에 터진다.
- prompt command의 allowed tools를 global allow rule로 저장하면 일회성 workflow 권한이 영구 권한이 된다.
- auth change 후 cache invalidation을 하지 않으면 stale connector/tool schema와 signed block이 남는다.
- branch/fork에서 result reference/content replacement를 rewrite하지 않으면 resume 시 대형 tool result가 다시 model context로 들어간다.
