# Claude Code Session Control Tools 분석

## 범위

이 문서는 Claude Code의 사용자 상호작용, 계획 모드, 설정, 워크트리, 스킬, 사용자 메시지, 구조화 출력 계열 도구를 정리한다.

읽은 주요 파일:

- `/home/samchon/github/samchon/claude-code/src/tools/AskUserQuestionTool/AskUserQuestionTool.tsx`
- `/home/samchon/github/samchon/claude-code/src/tools/EnterPlanModeTool/EnterPlanModeTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ConfigTool/ConfigTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ConfigTool/supportedSettings.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ConfigTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/EnterWorktreeTool/EnterWorktreeTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ExitWorktreeTool/ExitWorktreeTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SkillTool/SkillTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SkillTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/BriefTool/BriefTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/BriefTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SyntheticOutputTool/SyntheticOutputTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SleepTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/commands.ts`

## AskUserQuestionTool

`AskUserQuestion`은 모델이 임의 텍스트 질문을 던지는 도구가 아니다. UI가 렌더링할 수 있는 제한된 multiple-choice 질문 객체만 받는다.

입력 구조:

- `questions`: 1-4개.
- 각 질문은 `question`, `header`, `options`, `multiSelect`를 가진다.
- `options`: 2-4개.
- 각 option은 `label`, `description`, optional `preview`.
- 질문 텍스트 중복과 옵션 label 중복을 refine로 금지한다.
- preview format이 HTML이면 전체 문서 태그, `script`, `style`을 금지하고 HTML tag 존재를 확인한다.

runtime 성격:

- `shouldDefer: true`.
- read-only, concurrency-safe.
- `requiresUserInteraction() = true`.
- Kairos remote channel에서는 비활성화된다. 이유는 원격 채널이 TUI dialog를 렌더링하지 못하기 때문이다.
- permission 단계에서 사용자의 answer가 주입되고, call은 질문/응답/annotation을 그대로 반환한다.

Agentica 적용점:

- 사용자 상호작용은 normal operation call과 분리된 `requiresUserInteraction` 표면이 필요하다.
- UI별 렌더링 가능성에 따라 도구 enablement를 달리해야 한다.
- 모델이 만든 입력과 사용자가 permission UI에서 주입한 출력은 분리해야 한다.

## EnterPlanModeTool

`EnterPlanMode`는 프롬프트 문구가 아니라 permission context 전환이다.

동작:

- 입력은 없다.
- agent context에서는 금지된다.
- 현재 mode를 `plan`으로 바꾸고 `prePlanMode`를 저장한다.
- `prepareContextForPlanMode`와 `applyPermissionUpdate({ type: "setMode", mode: "plan" })`로 권한 컨텍스트를 갱신한다.
- plan mode interview feature가 켜져 있으면 plan file workflow를 안내한다.
- remote Kairos channel에서는 비활성화된다.

중요한 설계 원칙:

- 계획 모드는 “모델이 계획만 하라”는 약속이 아니라 runtime policy state다.
- read-only 탐색 권한과 edit/write 금지가 permission layer에서 보장된다.
- sub-agent 안에서는 plan mode 진입을 막는다.

Agentica 적용점:

- Agentica Next의 plan mode는 `AgenticaRuntimeMode = "default" | "plan" | ...`처럼 runtime state로 둔다.
- plan mode에서는 selector/call은 허용하되 side-effect operation execution은 gate에서 막아야 한다.
- MicroAgentica는 제외한다.

## ExitPlanModeV2Tool

`ExitPlanModeV2`는 승인, plan file 저장, teammate leader approval, permission mode 복원을 한 번에 처리한다.

입력/출력:

- 입력은 optional `allowedPrompts`와 SDK/CCR injected `plan`, `planFilePath`를 가진다.
- 출력은 `plan`, `isAgent`, `filePath`, `hasTaskTool`, `planWasEdited`, `awaitingLeaderApproval`, `requestId`.

검증과 권한:

- teammate는 별도 경로로 통과한다.
- 일반 세션은 현재 permission mode가 `plan`이어야 한다.
- 일반 세션은 user approval을 묻는다.
- teammate의 plan mode required 상황에서는 team lead에게 `plan_approval_request`를 mailbox로 보내고 대기 상태를 반환한다.

mode 복원:

- 승인 후 `prePlanMode`로 복원한다.
- transcript classifier/auto mode gate 상태를 확인한다.
- auto mode에서 dangerous permission을 strip/restore한다.
- plan attachment와 auto mode exit attachment 필요 플래그를 세운다.

Agentica 적용점:

- plan exit은 “승인 후 실행 시작” transition이다.
- 승인된 plan text는 runtime artifact로 보존하고 다음 loop에서 참조 가능해야 한다.
- 팀/서브에이전트가 있으면 self-approval을 금지하고 leader approval channel을 둔다.

## ConfigTool

`Config`는 get/set을 같은 tool로 제공한다.

지원 설정 registry는 `SUPPORTED_SETTINGS`에 집중되어 있다.

대표 설정:

- global: `theme`, `editorMode`, `verbose`, `preferredNotifChannel`, `autoCompactEnabled`, `fileCheckpointingEnabled`, `showTurnDuration`, `terminalProgressBarEnabled`, `todoFeatureEnabled`, `teammateMode`.
- project/settings: `autoMemoryEnabled`, `autoDreamEnabled`, `model`, `alwaysThinkingEnabled`, `permissions.defaultMode`, `language`.
- gated: `classifierPermissionsEnabled`, `voiceEnabled`, `remoteControlAtStartup`, notification flags.

동작:

- `value`가 없으면 get이고 read-only다.
- set은 permission ask를 거친다.
- 문자열 `"true"`/`"false"`를 boolean으로 coercion한다.
- options 검증과 `validateOnWrite`를 수행한다.
- `model`은 dynamic options와 `validateModel`을 사용한다.
- 일부 설정은 AppState에 즉시 sync된다. 예: `verbose`, `mainLoopModel`, `thinkingEnabled`, `remoteControlAtStartup`.
- voice enable은 auth, recording, stream, dependency, mic permission preflight를 수행한다.

Agentica 적용점:

- runtime config는 schema가 있는 registry로 관리한다.
- config 변경은 저장소 반영과 runtime AppState 반영을 분리하되, 즉시 반영이 필요한 키를 명시한다.
- prompt는 registry에서 생성해야 설정 목록 drift를 줄일 수 있다.

## Worktree Tools

`EnterWorktree`는 현재 세션을 isolated git worktree로 전환한다.

Enter 동작:

- 이미 current session worktree가 있으면 실패한다.
- canonical git root로 이동한다.
- slug를 검증하거나 plan slug를 생성한다.
- `createWorktreeForSession`으로 worktree를 만들고 `process.chdir`, `setCwd`, `setOriginalCwd`를 갱신한다.
- worktree state를 session storage에 저장한다.
- system prompt cache, memory file cache, plans directory cache를 비운다.

`ExitWorktree`는 current session에서 만든 worktree만 다룬다.

Exit 안전 장치:

- `getCurrentWorktreeSession()`이 없으면 no-op 실패 메시지를 반환한다.
- `remove`인데 `discard_changes`가 없으면 git status와 rev-list로 변경 파일/커밋 수를 계산한다.
- 변경 상태를 확인할 수 없으면 fail-closed 한다.
- `keep`은 worktree를 보존하고 original cwd로 복원한다.
- `remove`는 tmux session을 죽이고 worktree cleanup 후 original cwd로 복원한다.
- restore 시 project root, hook snapshot, system prompt/memory/plans cache를 정리한다.

Agentica 적용점:

- 격리 실행 환경은 “현재 cwd만 바꾸기”가 아니라 session state, cache invalidation, cleanup contract가 함께 필요하다.
- 삭제/폐기 동작은 확인 불가능하면 안전하지 않다고 판단해야 한다.

## SkillTool

`SkillTool`은 slash command/skill을 model-invocable tool로 노출한다.

검색/목록:

- `getSkillToolCommands()`는 prompt command 중 model invocation 가능 항목을 모은다.
- bundled/skills/legacy commands는 description이 자동 파생되어도 포함한다.
- plugin/MCP commands는 명시 description 또는 `whenToUse`가 있어야 listing에 들어간다.
- prompt listing은 context window의 약 1% character budget을 사용한다.
- 각 description은 최대 250 chars로 제한한다.
- bundled skills는 가능하면 full description을 보존하고, 나머지를 truncate하거나 names-only로 낮춘다.

권한:

- deny rule을 먼저 본다.
- allow rule을 본다.
- safe property allowlist에 있는 속성만 의미 있는 값을 가진 prompt command는 자동 허용한다.
- 나머지는 `Skill(skillName)` 또는 prefix rule suggestion과 함께 ask한다.
- experimental remote canonical skill은 deny 이후 auto-allow된다.

실행 모드:

- inline skill: `processPromptSlashCommand`로 prompt를 expansion하고 newMessages로 삽입한다.
- fork skill: `command.context === "fork"`이면 `runAgent`로 isolated sub-agent에서 실행하고 result text만 반환한다.
- remote canonical skill: discovered slug를 캐시에서 load하고 SKILL.md 내용을 meta user message로 직접 주입한다.

context modifier:

- skill frontmatter의 allowed tools를 permission context에 추가한다.
- model override를 적용하되 현재 model의 `[1m]` 같은 window suffix를 보존한다.
- effort override를 AppState에 반영한다.
- invoked skill은 compaction preservation state에 등록된다.

Agentica 적용점:

- 프롬프트 전략은 “큰 system prompt에 다 넣기”보다 discover/listing과 invoke/load를 분리한다.
- skill invocation은 allowed operations, model, effort, fork 여부를 runtime context modifier로 반영해야 한다.
- compact 후에도 활성 skill instruction이 복원되어야 한다.

## BriefTool

`SendUserMessage`는 사용자가 실제로 읽는 primary output channel이다.

특징:

- Kairos/Brief feature와 user opt-in이 모두 맞아야 활성화된다.
- message, attachments, status를 받는다.
- attachments는 file path를 resolve하고 remote bridge 상태에 맞춰 업로드/메타데이터를 만든다.
- `status`는 `normal`과 `proactive`를 구분한다.
- tool result는 “Message delivered to user”만 모델에 돌려준다.

Agentica 적용점:

- 일반 assistant text와 user-visible notification을 분리하는 공개 표면은 장기적으로 유용하다.
- background task, schedule, remote session에서는 “최종 답변”과 “사용자에게 지금 보낼 짧은 알림”이 다르다.

## SyntheticOutputTool

`StructuredOutput`은 non-interactive session에서 최종 구조화 출력을 강제하기 위한 synthetic tool이다.

특징:

- read-only, concurrency-safe.
- 항상 allow.
- JSON schema를 받아 AJV로 compile하고 입력을 검증한다.
- schema object identity 기준 WeakMap cache로 반복 workflow 비용을 줄인다.
- 성공 시 `structured_output`을 별도로 반환한다.

Agentica 적용점:

- structured final output은 normal operation call과 다른 finish tool로 취급할 수 있다.
- schema validation failure는 일반 함수 argument validation과 같은 retry loop로 흡수 가능하다.

## Sleep Prompt

`Sleep` prompt는 shell sleep 대신 tool-level wait를 쓰게 한다.

중요한 점:

- user interrupt 가능.
- concurrent 가능.
- tick prompt를 받을 수 있다.
- API call/cache expiry 비용을 고려하라고 안내한다.

Agentica 적용점:

- background/idle loop가 생기면 “대기”도 명시적 runtime transition이어야 한다.

## Agentica 설계 결론

1. plan mode, user question, config, skill, brief는 단순 prompt 문구가 아니라 runtime/public surface다.
2. `Agentica`에만 optional runtime mode와 interaction event를 추가하고 `MicroAgentica`에는 연결하지 않는다.
3. skill/operation listing은 budgeted discovery로 두고 full instruction/schema는 invoke 시점에 load한다.
4. 설정은 registry 기반으로 관리하고 prompt 문서는 registry에서 생성한다.
5. isolated worktree나 background output처럼 runtime cache에 영향을 주는 기능은 state transition과 cache invalidation을 함께 설계한다.
