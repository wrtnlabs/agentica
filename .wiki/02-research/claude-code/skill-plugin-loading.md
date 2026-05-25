# Claude Code Skill/Plugin Loading 분석

## 분석 범위

대상은 Claude Code의 skill, plugin, SkillTool 실행 경로다.

Marketplace intent/state, install/update/autoupdate, dependency resolution, policy, userConfig secret storage는 별도 문서 `plugin-marketplace-runtime.md`에 보강했다.

핵심 파일:

- `src/skills/loadSkillsDir.ts`
  - frontmatter parsing: 185
  - skill command 생성: 270
  - skills directory loader: 407
  - all skill dir loader: 638
  - dynamic skill directory 추가: 923
  - conditional skill activation: 997
- `src/skills/bundledSkills.ts`
  - bundled skill registry: 53
  - bundled skill file extraction: 131
  - safe relative path validation: 196
- `src/skills/mcpSkillBuilders.ts`
  - MCP skill builder registry: 33, 37
- `src/plugins/builtinPlugins.ts`
  - builtin plugin registry/read: 57
  - builtin plugin skill projection: 108
- `src/utils/plugins/loadPluginCommands.ts`
  - plugin command directory loader: 169
  - plugin command 생성: 218
  - plugin command registry: 414
  - plugin skill directory loader: 687
  - plugin skill registry: 840
- `src/utils/plugins/schemas.ts`
  - plugin MCP schema: 543
  - userConfig schema: 632
  - channel schema: 670
  - manifest schema: 884
- `src/utils/plugins/mcpPluginIntegration.ts`
  - plugin MCP server loader: 131
  - plugin MCP scope 부여: 341
  - enabled plugin MCP 추출: 366
  - plugin MCP env/userConfig 해석: 465
- `src/tools/SkillTool/SkillTool.ts`
  - MCP skill 포함 command lookup: 81
  - forked skill 실행: 122
  - SkillTool contract: 331
  - validation/permission/call: 354, 432, 580
- `src/commands.ts`
  - all command/skill source merge: 449
  - available command 계산: 476
  - MCP skill filter: 547
  - SkillTool listing source: 563

## 핵심 결론

Claude Code의 Skill은 "slash command markdown"보다 큰 개념이다.

Skill은 다음 속성을 가진 lazy-loaded capability다.

- frontmatter metadata는 discovery와 ranking에 상시 사용된다.
- 본문 markdown은 호출 시 context에 들어간다.
- skill root directory를 알려 추가 파일을 필요할 때 읽게 한다.
- allowed tools, model, effort, agent, execution context를 선언한다.
- inline 실행과 forked sub-agent 실행을 모두 지원한다.
- plugin, bundled, local, managed, MCP source가 같은 command interface로 합쳐진다.

Agentica에 적용할 때 핵심은 operation schema만 indexing하지 말고, "지식/절차/정책 묶음"을 operation 주변 capability로 다루는 것이다.

## Skill Frontmatter 계약

`parseSkillFrontmatterFields`가 읽는 주요 필드:

- `description`
- `allowed-tools`
- `argument-hint`
- `arguments`
- `when_to_use`
- `version`
- `model`
- `disable-model-invocation`
- `user-invocable`
- `hooks`
- `context: fork`
- `agent`
- `effort`
- `shell`

`paths` frontmatter는 별도 처리된다. 모든 경로가 `**`면 조건 없는 skill처럼 취급하고, 특정 path pattern이 있으면 조건부 skill로 보관한다.

Agentica 적용:

- operation index에는 function schema뿐 아니라 `whenToUse`, examples, allowed tool/operation set, side effect hint를 넣어야 한다.
- skill 본문은 system prompt에 항상 넣지 말고 호출 시 injection하는 편이 맞다.
- paths 조건은 API domain, controller group, entity type에도 응용할 수 있다.

## Local Skill Loading

지원 format:

- 현대식: `.claude/skills/<skill-name>/SKILL.md`
- legacy: `.claude/commands/**/*.md` 또는 `SKILL.md`

loading source:

- managed policy skills
- user skills
- project skills
- `--add-dir` skills
- legacy commands

주요 특징:

- directory entry가 symbolic link여도 허용한다.
- `realpath`로 같은 파일 중복을 제거한다.
- `--bare` mode는 자동 발견을 끄고 explicit add-dir만 본다.
- plugin-only policy면 user/project/local skill discovery를 막는다.
- conditional skill은 처음에는 command list에 넣지 않고 path match 때 dynamic skill로 승격한다.
- file operation 중 nested `.claude/skills`를 발견하되 gitignored directory는 건너뛴다.

Agentica 적용:

- local procedure pack은 workspace 안에서 발견될 수 있지만, trust boundary와 gitignore policy가 필요하다.
- 중복 제거는 이름만으로 하지 말고 canonical source identity도 봐야 한다.
- conditional capability는 selector index에 "잠재 후보"로 두고, trigger가 맞을 때만 active registry에 넣는다.

## Prompt Injection과 Shell Expansion

local/plugin skill은 호출 시 markdown 본문에 다음을 적용한다.

- argument substitution
- `${CLAUDE_SKILL_DIR}`
- `${CLAUDE_SESSION_ID}`
- optional shell command expansion
- allowed tool rule injection

MCP skill은 remote/untrusted source이므로 shell command expansion을 하지 않는다.

Agentica 적용:

- remote capability pack과 local capability pack의 interpolation 권한을 분리해야 한다.
- skill/capability 본문에서 runtime variable을 사용할 수 있더라도 secret은 직접 prompt에 들어가면 안 된다.
- allowed operation rule은 execution context에만 주입하고 public history에 남기지 않는다.

## Bundled와 Builtin Plugin

Bundled skill:

- binary에 포함되어 모든 사용자에게 제공된다.
- 추가 reference files를 첫 호출 시 안전한 temp root에 추출한다.
- relative path는 traversal을 금지한다.
- 파일 write는 `O_EXCL`, owner-only mode를 사용한다.

Builtin plugin:

- `/plugin` UI에 나타난다.
- 사용자가 enable/disable할 수 있다.
- hooks, MCP servers, skills 같은 여러 component를 묶을 수 있다.
- skill은 Command로 투영될 때 `source: "bundled"`로 들어간다. hardcoded builtin slash command와 구분하기 위해서다.

Agentica 적용:

- core 내장 capability와 user-installable capability를 구분하되 selector에는 같은 shape로 투영한다.
- bundled reference file이 필요하면 prompt에 전부 넣지 말고 local readable directory로 제공한다.
- enable/disable 가능 내장 pack은 public operation list가 아니라 runtime registry layer에서 제어한다.

## Plugin Manifest

Plugin manifest는 다음 component를 묶는다.

- hooks
- commands
- agents
- skills
- output styles
- channels
- MCP servers
- LSP servers
- settings
- userConfig

MCP server 선언은 다음을 지원한다.

- plugin root의 `.mcp.json`
- manifest의 `mcpServers` inline object
- relative JSON path
- `.mcpb` 또는 `.dxt` bundle
- 위 항목들의 array

userConfig는 민감/비민감 값을 나누고, `${user_config.KEY}` 형태로 MCP/LSP/hook/skill/agent content에 들어갈 수 있다. sensitive 값은 prompt content에 직접 넣지 않는 방향이다.

channel declaration은 MCP server를 message channel로 선언하고, channel별 userConfig를 가질 수 있다.

Agentica 적용:

- plugin/capability pack manifest는 단일 extension point가 아니라 operation, prompt, memory, connector, hook, UI capability를 함께 담는 상위 묶음이 좋다.
- 다만 첫 구현은 operation selector와 connector registry에 필요한 최소 subset만 읽어야 한다.
- sensitive config는 model-visible prompt와 분리한다.
- marketplace catalog와 installed state는 manifest loader와 분리한다. install/update/security lifecycle은 `plugin-marketplace-runtime.md`의 intent/materialization/projection 모델을 따른다.

## Plugin Command/Skill Loading

Plugin command는 다음에서 로딩된다.

- default `commands/`
- manifest `commands` path
- manifest inline command metadata

Plugin skill은 다음에서 로딩된다.

- default `skills/`
- manifest `skills` path
- direct `SKILL.md` directory
- subdirectory `SKILL.md`

공통 특징:

- command name은 `pluginName:namespace:name` 형식이다.
- skill directory는 base directory를 prompt 앞에 붙인다.
- `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `${CLAUDE_SKILL_DIR}`, `${CLAUDE_SESSION_ID}`를 해석한다.
- plugin userConfig 값을 content에 치환할 수 있다.
- allowed tools와 shell expansion을 지원한다.
- 각 plugin 안에서 duplicate path를 제거한다.
- plugin들은 병렬로 로딩한다.

Agentica 적용:

- operation pack namespace는 collision 방지를 위해 `pack:domain:operation` 형태가 필요하다.
- plugin-local data directory와 pack root를 분리해야 한다.
- inline manifest content와 file-backed content를 같은 capability shape로 투영한다.

## Plugin MCP Integration

Plugin MCP server는 load 후 `plugin:<pluginName>:<serverName>`으로 scope가 붙는다. config에는 `scope: "dynamic"`과 `pluginSource`가 들어간다.

env 해석 순서:

1. `${CLAUDE_PLUGIN_ROOT}`와 plugin 변수
2. `${user_config.KEY}`
3. 일반 environment variable

stdio MCP에는 `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA` env가 추가된다.

Agentica 적용:

- plugin connector는 source namespace를 operation key에 반영해야 한다.
- connector env/userConfig 해석은 model prompt 구성과 분리된 runtime 단계로 둔다.
- 하나의 plugin 안에서 일부 MCP server config가 실패해도 나머지는 살아야 한다.

## Command Merge와 SkillTool

`commands.ts`는 다음 순서로 command를 merge한다.

1. bundled skills
2. builtin plugin skills
3. local skill dir commands
4. workflow commands
5. plugin commands
6. plugin skills
7. builtin slash commands

`getCommands`는 auth/provider availability와 `isEnabled`를 매번 재평가한다. expensive loading은 memoized되지만 runtime enablement는 fresh check다.

SkillTool 특징:

- MCP skills는 AppState `mcp.commands`에서 따로 가져와 local commands와 합친다.
- model이 볼 수 있는 skill listing은 prompt command 중 model invocation 가능한 것만 포함한다.
- permission rule은 exact skill 또는 prefix pattern을 지원한다.
- safe property allowlist에 들어가는 skill은 자동 허용될 수 있다.
- `context: fork` skill은 sub-agent에서 실행된다.
- inline skill은 prompt slash command 처리 결과를 current conversation에 추가한다.
- model override는 parent의 large context suffix를 보존한다.

Agentica 적용:

- procedure/capability invocation은 operation call과 다르다. 호출 결과가 "새 메시지를 주입하고 다음 LLM turn을 이어가라"일 수 있다.
- forked skill은 sub-agent runtime과 연결해야 하며, parent mutable state는 기본적으로 격리해야 한다.
- capability permission은 operation permission과 별도 namespace를 가진다.

## Remote Skill Search 관련 관찰

여러 파일이 `EXPERIMENTAL_SKILL_SEARCH`와 `services/skillSearch/*`를 feature-gated import하지만, 현재 snapshot의 `src` 파일 목록에는 해당 구현 directory가 보이지 않는다. 공개 snapshot에서는 인터페이스 흔적만 확인된다.

확인 가능한 흔적:

- SkillTool은 remote canonical skill을 발견된 session state에서 검증하고 로딩하는 경로를 가진다.
- constants/prompt/query/attachments/compact 쪽은 skill search가 있을 때 turn-zero discovery와 attachment suppression을 조정한다.
- local skill index cache를 clear하는 hook이 존재한다.
- `mcpSkillBuilders.ts`는 MCP skill discovery가 `loadSkillsDir.ts`와 cycle을 만들지 않도록 write-once registry를 둔다. non-literal dynamic import가 Bun bundle에서 깨지고, literal import는 dependency cycle diff를 폭발시키기 때문에 module-init registration을 쓴다.
- `useManageMCPConnections.ts`는 `MCP_SKILLS` gate가 켜진 경우 `../../skills/mcpSkills.js`를 require하지만, 공개 snapshot에는 `src/skills/mcpSkills.ts`가 없다. 따라서 MCP skill runtime은 interface seam만 보이고 구현은 누락된 상태로 봐야 한다.
- resources/list_changed notification은 MCP skills cache와 command cache를 함께 invalidate한다. prompts/list_changed는 skills가 resources에서 온다는 이유로 skills cache를 지우지 않는다.

Agentica 적용:

- 원격 skill marketplace는 후속 phase의 일이다.
- 지금 필요한 것은 local operation/capability index와 lazy loading contract다.
- DBMS/외부 backend 없는 기본 selector를 먼저 완성해야 한다.
- capability registry가 connector resource에서 materialize될 수 있으므로, prompts/tools/resources 변경 notification의 cache invalidation 범위를 분리해야 한다.

## Agentica 설계로 번역

초기 구조 초안:

```ts
interface AgenticaCapabilityPackManifest {
  name: string;
  version?: string;
  operations?: AgenticaPackOperationRef[];
  procedures?: AgenticaProcedureDefinition[];
  connectors?: AgenticaConnectorDefinition[];
  userConfig?: Record<string, AgenticaUserConfigOption>;
}

interface AgenticaProcedureDefinition {
  key: string;
  description: string;
  whenToUse?: string;
  allowedOperations?: string[];
  model?: string;
  execution?: "inline" | "fork";
  paths?: string[];
  contentRef: AgenticaContentReference;
}
```

도입 순서:

1. `Agentica` 내부 operation index에 `searchHint`, `whenToUse`, `sideEffect`, `source`를 추가한다.
2. procedure/capability pack manifest는 private experimental로 둔다.
3. local file-backed procedure는 prompt에 항상 넣지 않고, selector가 고른 뒤 주입한다.
4. connector registry와 capability registry의 version을 공유하거나 명시적으로 invalidate한다.
5. `MicroAgentica`에는 연결하지 않는다.
