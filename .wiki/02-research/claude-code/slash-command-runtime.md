# Claude Code Slash Command Runtime 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/commands.ts`
- `/home/samchon/github/samchon/claude-code/src/types/command.ts`
- `/home/samchon/github/samchon/claude-code/src/processSlashCommand.tsx`
- `/home/samchon/github/samchon/claude-code/src/main.tsx`
- `/home/samchon/github/samchon/claude-code/src/screens/REPL.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/compact/index.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/compact/compact.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/context/index.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/context/context.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/context/context-noninteractive.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/memory/index.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/memory/memory.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/memory/MemoryFileSelector.tsx`
- `/home/samchon/github/samchon/claude-code/src/utils/analyzeContext.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/claudemd.ts`

## 핵심 결론

Claude Code slash command는 단순 prompt shortcut이 아니다. command registry는 세 종류의 command를 분리한다.

| 종류 | 역할 | model-facing 여부 |
| --- | --- | --- |
| `prompt` | command/skill 본문을 prompt로 확장 | 기본적으로 model-visible |
| `local` | local runtime action 또는 text result 생성 | command별로 다름 |
| `local-jsx` | Ink UI를 렌더링하는 interactive command | headless/bridge 기본 차단 |

Agentica가 배워야 할 점은 `/compact`, `/context`, `/memory`를 모두 "채팅 텍스트"로 처리하지 않는 것이다. 이들은 각각 history rewrite transaction, projected context diagnostics, memory editing control plane이다.

그 밖의 개별 command catalog는 [slash-command-catalog.md](./slash-command-catalog.md)에 분리했다. 특히 `/clear`, `/resume`, `/branch`, `/plan`, `/permissions`, `/model`, `/login`, `/remote-control`, prompt workflow command는 이 문서의 runtime contract를 실제 예외 사례로 확장한다.

## Command Registry와 실행 계약

`Command` union은 `prompt`, `local`, `local-jsx`로 나뉜다. `LocalCommand`는 `supportsNonInteractive`를 명시할 수 있고, `LocalJSXCommand`는 `onDone(result, options)` callback으로 UI 종료와 transcript 반영 방식을 결정한다.

`LocalJSXCommandOnDone`의 `display` 옵션은 command 결과가 public transcript에 어떻게 남을지 정한다.

- `skip`: 아무 메시지도 남기지 않는다.
- `system`: command input과 stdout을 local command system message로 남긴다.
- `user` 또는 기본값: command input과 stdout을 user-visible command result로 남긴다.
- `metaMessages`: 사용자에게 보이지 않는 model-visible user message를 추가할 수 있다.

`processSlashCommand.tsx`는 command type별로 다른 path를 탄다.

- `prompt`: prompt text를 만들고, 필요하면 skill invocation과 permission metadata를 붙인다.
- `local`: command를 실행하고 `text`, `compact`, `skip` result를 처리한다.
- `local-jsx`: UI component를 띄우고 `onDone` 결과를 기다린다. headless session에서는 JSX 반환 command가 의미 없으므로 no-op 처리된다.

remote bridge에는 별도 allowlist가 있다. `local-jsx`는 bridge-safe가 아니고, `local` command는 `BRIDGE_SAFE_COMMANDS`에 있는 것만 허용된다. 이 allowlist에는 `compact`, `clear`, `cost`, `summary`, `releaseNotes`, `files`가 있다. `prompt` command는 type상 허용되지만, local runtime side effect가 있는 command는 별도 gate가 필요하다.

headless main path도 command를 필터링한다. non-interactive mode에서는 `prompt` command와 `supportsNonInteractive`가 있는 `local` command만 남는다. 따라서 `/compact`와 noninteractive `/context`는 가능하지만 `/memory` 같은 `local-jsx` UI command는 빠진다.

## `/compact`

`commands/compact/index.ts`는 `/compact [instructions]`를 `local` command로 등록한다.

- `type: "local"`
- `supportsNonInteractive: true`
- `argumentHint: "<optional custom summarization instructions>"`
- `isEnabled`: `DISABLE_COMPACT` 환경변수가 truthy면 비활성화

`commands/compact/compact.ts`의 실행 path는 다음 순서다.

1. `getMessagesAfterCompactBoundary(messages)`로 이미 compact된 앞부분과 REPL scrollback을 제외한다.
2. 메시지가 없으면 `No messages to compact`를 반환한다.
3. 사용자 custom instruction이 없으면 먼저 `trySessionMemoryCompaction(messages, agentId)`를 시도한다.
4. session memory compact가 성공하면 user context cache를 비우고 post-compact cleanup, prompt cache break notification, post-compaction marker, warning suppression을 처리한다.
5. reactive-only mode면 `compactViaReactive()`로 넘긴다.
6. 일반 path는 `microcompactMessages()` 후 `compactConversation()`을 호출한다.
7. compact 성공 후 `setLastSummarizedMessageId(undefined)`, warning suppression, user context cache clear, post cleanup을 수행한다.

reactive path는 manual command여도 hook/progress/status를 runtime transition으로 다룬다.

- `executePreCompactHooks({ trigger: "manual", customInstructions })`
- cache sharing params 생성
- hook instruction과 사용자 instruction 병합
- SDK status를 `compacting`으로 설정
- stream mode와 response length reset
- `reactiveCompactOnPromptTooLong(...)` 호출
- 실패 reason을 `not enough`, user abort, incomplete response error로 변환

`/compact`의 가장 중요한 부분은 `processSlashCommand.tsx`의 result handling이다. `LocalCommandResult`가 `{ type: "compact" }`이면 일반 stdout처럼 transcript 뒤에 붙이지 않는다.

- command input과 stdout message를 `messagesToKeep`에 합친다.
- stdout timestamp는 `Date.now() + 100`으로 둬 SDK `-p` resume에서 command 출력이 user command 뒤에 오도록 한다.
- `resetMicrocompactState()`를 호출한다.
- `buildPostCompactMessages(compactionResultWithSlashMessages)`로 `compact_boundary -> summary -> preserved tail -> attachments -> hook results` ordering을 만든다.
- compact boundary가 첫 메시지면 synthetic caveat ordering을 별도로 보존한다.

Agentica 결론: manual compact는 user prompt가 아니다. `Agentica.conversate("/compact")` 같은 UX를 만든다면 history append가 아니라 model-facing context rewrite transaction으로 처리해야 한다.

## `/context`

`commands/context/index.ts`는 같은 이름의 command 두 개를 등록한다.

| command | type | 활성 조건 | 출력 |
| --- | --- | --- | --- |
| interactive `/context` | `local-jsx` | interactive session | colored grid visualization |
| noninteractive `/context` | `local` | noninteractive session | markdown table |

interactive path는 `context.tsx`에서 다음 투영을 먼저 수행한다.

1. `getMessagesAfterCompactBoundary(messages)`
2. feature-gated `contextCollapse.projectView(...)`
3. `microcompactMessages(apiView)`
4. `analyzeContextUsage(...)`
5. Ink component를 ANSI string으로 렌더링

noninteractive path도 `context-noninteractive.ts`의 `collectContextData()`에서 같은 pre-API transform을 공유한다. 이는 SDK `get_context_usage` control request에서도 재사용되는 경로다.

`formatContextAsMarkdownTable()`은 단순 token total만 출력하지 않는다.

- model과 total token
- context collapse 상태
- category별 estimated usage
- MCP tools table
- ANT-only system tools/system prompt section breakdown
- custom agents
- memory files
- skills
- ANT-only message breakdown: tool calls, tool results, attachments, top tools, top attachments

`analyzeContextUsage.ts`는 다음 범주를 계산한다.

- effective system prompt
- built-in system tools와 deferred built-in tools
- MCP tools와 deferred MCP tools
- custom agents
- memory files
- skill frontmatter
- message tokens
- free space와 autocompact buffer

특히 MCP/tool search가 켜져 있으면 모든 MCP tool을 context에 넣었다고 계산하지 않는다. message 안에서 이미 사용되어 loaded된 MCP tool만 loaded로 보고 나머지는 deferred로 표시한다.

Agentica 결론: context diagnostics는 raw history를 세면 안 된다. compact boundary, context collapse, result budget, selected operation schema, deferred operation set이 반영된 "실제 다음 model request"를 분석해야 한다.

## `/memory`

`commands/memory/index.ts`는 `/memory`를 `local-jsx` command로 등록한다.

- `type: "local-jsx"`
- description: `Edit Claude memory files`
- `supportsNonInteractive` 없음

`memory.tsx`는 먼저 `clearMemoryFileCaches()`를 호출하고 `getMemoryFiles()`를 await하여 suspense fallback flash를 피한 뒤 `MemoryCommand`를 렌더링한다.

파일 선택 시 동작은 다음과 같다.

1. config home 아래 memory path면 directory를 `mkdir(..., { recursive: true })`로 만든다.
2. 파일이 없으면 `writeFile(..., { flag: "wx" })`로 빈 파일을 만든다.
3. `editFileInEditor(memoryPath)`로 `$VISUAL`, `$EDITOR`, default editor 순서의 외부 editor를 연다.
4. 성공하면 system display로 "Opened memory file..."을 남긴다.
5. 취소하면 "Cancelled memory editing" system message를 남긴다.

`MemoryFileSelector.tsx`는 기존 memory files에 더해 기본 user/project memory를 보장한다.

- user memory: `~/.claude/CLAUDE.md`
- project memory: `./CLAUDE.md`
- include된 nested file은 depth와 `@-imported` 설명으로 표시
- dynamically loaded memory도 별도 설명
- auto memory가 켜져 있으면 auto-memory folder open option 추가
- TEAMMEM feature가 켜져 있으면 team memory folder open option 추가
- active agent가 `agent.memory`를 가지면 agent memory folder open option 추가
- auto-memory, auto-dream toggle을 같은 selector 상단에서 제어

`utils/claudemd.ts`의 memory load 순서는 다음과 같다.

1. Managed memory: 정책성 global instruction
2. User memory: `~/.claude/CLAUDE.md`, user rules
3. Project memory: 상위 directory부터 CWD까지 `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md`
4. Local memory: `CLAUDE.local.md`
5. additional directories memory
6. auto-memory entrypoint
7. team-memory entrypoint

memory file은 `@include`를 지원하고 circular include를 방지한다. text extension allowlist로 binary include를 막고, frontmatter `paths`로 conditional rule을 만들 수 있다.

cache invalidation도 구분된다.

- `clearMemoryFileCaches()`: correctness를 위한 cache clear. `/memory` dialog나 settings/worktree 변화에 사용한다.
- `resetGetMemoryFilesCache(reason)`: 실제 context reload event로 보고 `InstructionsLoaded` hook reason을 설정한다. compaction 후 reload에 사용한다.
- `filterInjectedMemoryFiles()`: feature에 따라 auto/team memory index가 다른 attachment 경로로 제공될 때 system prompt injection에서 제외한다.

Agentica 결론: memory editing은 model prompt가 아니라 control plane이다. core에는 file editor UI를 넣지 말고, adapter가 memory source를 제공하면 core는 projected context와 cache invalidation만 다룬다.

## Agentica 적용 원칙

1. Command registry는 `prompt`, `local control`, `interactive UI`를 분리해야 한다.
2. `local` command result는 `text`, `skip`, `compact`, `diagnostic`처럼 typed result로 처리해야 한다.
3. compact command는 normal user message가 아니라 history/context rewrite transaction이다.
4. context command는 raw history가 아니라 실제 projected request를 분석해야 한다.
5. memory command는 persistent instruction source의 edit/control plane이며 core model loop에 직접 섞지 않는다.
6. noninteractive/headless/remote bridge command allowlist를 별도로 둔다.
7. command output이 public history, model-visible hidden message, UI-only state 중 어디로 가는지 command별로 명시해야 한다.
8. `MicroAgentica`는 이 command runtime 확장 대상이 아니다.

## Catalog 연결 결론

개별 command를 더 읽어보면 Claude Code command surface는 최소 여섯 부류로 나뉜다.

1. prompt workflow: `/commit`, `/init`, `/review`, `/security-review`
2. session/transcript transaction: `/clear`, `/resume`, `/branch`, `/rewind`
3. materialized view/export: `/copy`, `/export`, `/diff`, `/files`, `/cost`
4. workspace/permission/mode control: `/add-dir`, `/permissions`, `/hooks`, `/plan`, `/sandbox`
5. runtime/account state mutation: `/model`, `/fast`, `/effort`, `/advisor`, `/login`, `/logout`
6. adapter/integration wizard: `/remote-control`, `/mobile`, `/desktop`, `/install-github-app`, `/install-slack-app`

Agentica는 이 taxonomy를 먼저 세우고 command별 result display, public history 반영 여부, noninteractive/remote allowlist, adapter side effect를 명시해야 한다.
