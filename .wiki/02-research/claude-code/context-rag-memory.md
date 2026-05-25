# Claude Code Context/RAG/Memory 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/services/compact/microCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/autoCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/compact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/sessionMemoryCompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/apiMicrocompact.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/services/compact/grouping.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ToolSearchTool/ToolSearchTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ToolSearchTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/toolSearch.ts`
- `/home/samchon/github/samchon/claude-code/src/services/api/claude.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/messages.ts`
- `/home/samchon/github/samchon/claude-code/src/memdir/memoryScan.ts`
- `/home/samchon/github/samchon/claude-code/src/memdir/findRelevantMemories.ts`
- `/home/samchon/github/samchon/claude-code/src/skills/loadSkillsDir.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/context/context.tsx`
- `/home/samchon/github/samchon/claude-code/src/commands/context/context-noninteractive.ts`
- `/home/samchon/github/samchon/claude-code/src/commands/memory/memory.tsx`
- `/home/samchon/github/samchon/claude-code/src/components/memory/MemoryFileSelector.tsx`

## Microcompact

주요 anchor:

- cleared result marker: `microCompact.ts:36`
- compactable tool set: `microCompact.ts:41`
- message token estimate: `microCompact.ts:164`
- `microcompactMessages()`: `microCompact.ts:253`
- time-based trigger: `microCompact.ts:422`

핵심은 "전체 대화 요약" 전에 낡은 tool result를 먼저 줄이는 것이다. 특히 read/search/list/shell/web 결과는 시간이 지나면 full content 가치가 낮아진다.

Agentica에는 function result budget이 필요하다. HTTP response, MCP result, class function result를 그대로 JSON stringify하여 history에 넣는 현재 방식은 긴 세션에서 위험하다.

## Auto Compact

주요 anchor:

- effective context window: `autoCompact.ts:33`
- warning/error/auto threshold: `autoCompact.ts:93`
- circuit breaker limit: `autoCompact.ts:70`
- `shouldAutoCompact()`: `autoCompact.ts:160`
- `autoCompactIfNeeded()`: `autoCompact.ts:241`

Claude Code는 context window에서 summary output reserve를 뺀 effective window를 기준으로 compact threshold를 계산한다. 또한 auto compact가 연속 실패하면 circuit breaker로 반복 낭비를 막는다.

Agentica에는 vendor/model별 context window 설정이 없다. 우선 config 기반 수동 지정으로 시작하고, vendor별 default table은 후속 phase에서 추가하는 편이 좋다.

## Full Compact

주요 anchor:

- image/document stripping: `compact.ts:145`
- reinjected attachment stripping: `compact.ts:211`
- prompt-too-long retry truncation: `compact.ts:243`
- post compact messages builder: `compact.ts:330`
- `compactConversation()`: `compact.ts:387`
- compact boundary creation: `compact.ts:598`
- pre-compact discovered tools carry: `compact.ts:606`
- post-compact hooks: `compact.ts:723`

중요한 설계는 summary만 남기는 것이 아니다. compact boundary를 만들고, compact 이후 첫 turn에 필요한 file/plan/skill/tool state를 다시 붙인다.

세부 분석은 [Claude Code Compact System 정밀 분석](./compact-system.md)에 분리했다. 특히 `preservedSegment` relink, post-compact attachment ordering, API-round 기반 prompt-too-long retry는 Agentica compact 설계의 직접 근거다.

Agentica에서는 다음 state를 boundary metadata로 남겨야 한다.

- selected operation names
- pending stack
- validation failure history
- 최근 execute result preview/reference
- compact trigger와 token estimate

## ToolSearch와 Deferred Tool Loading

주요 anchor:

- mode/env parsing: `toolSearch.ts:155`
- model/provider optimistic gate: `toolSearch.ts:270`
- definitive enable gate: `toolSearch.ts:385`
- discovered tool scan: `toolSearch.ts:545`
- deferred tools delta: `toolSearch.ts:646`
- defer rule and prompt: `prompt.ts:50`
- keyword/direct search: `ToolSearchTool.ts:147`
- tool result to `tool_reference`: `ToolSearchTool.ts:440`
- API tool filtering and beta header: `claude.ts:1120`
- `tool_reference` normalization/stripping: `messages.ts:1536`

Claude Code의 ToolSearch는 RAG라기보다 "도구 스키마를 처음부터 다 넣지 않는 런타임"이다. deferred tool은 목록에는 이름만 노출되고, 모델이 `ToolSearch`를 호출하면 결과가 `tool_reference` block으로 돌아온다. Anthropic API는 이 reference를 full tool schema로 확장하고, 다음 요청부터 해당 tool이 callable해진다.

활성화 mode는 환경 변수와 provider/model gate로 나뉜다.

- `ENABLE_TOOL_SEARCH=true` 또는 `auto:0`: 항상 ToolSearch 사용
- `ENABLE_TOOL_SEARCH=auto` 또는 `auto:N`: deferred tool schema token 총량이 context window의 N% 이상일 때만 사용
- `ENABLE_TOOL_SEARCH=false` 또는 `auto:100`: 비활성화
- unset: 기본적으로 ToolSearch 사용
- `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`: beta shape인 `defer_loading`/`tool_reference`를 wire에 보내지 않도록 강제 비활성화
- unsupported model pattern은 negative list로 관리하며 현재 기본값은 `haiku`

`isToolSearchEnabledOptimistic()`과 `isToolSearchEnabled()`가 분리되어 있다. 전자는 base tool list에 `ToolSearch`를 넣고 오래된 transcript의 `tool_reference`를 보존할지 판단하는 느슨한 gate다. 후자는 실제 API 요청 직전에 model support, `ToolSearchTool` availability, auto threshold, pending MCP server까지 보고 결정한다. Agentica도 selector capability detection과 actual projection decision을 분리해야 한다.

Deferred 대상은 다음 규칙이다.

- `alwaysLoad === true`면 어떤 경우에도 deferred가 아니다.
- MCP tool은 기본적으로 deferred다.
- `ToolSearch` 자기 자신, fork subagent mode의 `Agent`, `Brief`, REPL bridge의 `SendUserFile`처럼 turn 1부터 보여야 하는 communication/control tool은 deferred에서 제외한다.
- 일반 builtin tool은 `shouldDefer === true`일 때만 deferred다.
- `searchHint`는 model-facing list에는 렌더링하지 않지만 keyword scoring에는 쓴다.

검색은 DBMS나 embedding 없이 로컬 lexical scorer로 처리된다.

- `select:ToolA,ToolB`는 exact direct selection이다. 이미 inline으로 로드된 tool을 선택해도 no-op으로 허용한다.
- bare exact name도 fast path로 처리한다.
- `mcp__server` prefix query는 해당 MCP server tool prefix를 반환한다.
- `+term`은 required term으로 name part, description, `searchHint` 중 하나에 모두 매칭되어야 한다.
- scoring은 name part exact/partial, full-name fallback, `searchHint`, description word-boundary match를 합산한다. MCP name part는 더 높은 weight를 받는다.
- 결과가 없고 MCP server가 아직 pending이면 `pending_mcp_servers`를 함께 알려 재검색 가능성을 남긴다.

API projection은 search 결과 그 자체보다 더 중요하다. `claude.ts`는 ToolSearch가 활성화되면 non-deferred tool과 `ToolSearch`만 기본 전송하고, deferred tool은 message history에서 발견된 `tool_reference` 이름만 full schema로 포함한다. 그러므로 "선택된 도구 집합"은 현재 turn의 임시 결과가 아니라 transcript에서 재구성되는 runtime state다.

Compaction도 이 state를 보존한다. compact summary는 `tool_reference` block 자체를 보존하지 못하므로 `extractDiscoveredToolNames()`가 compact boundary metadata의 `preCompactDiscoveredTools`에 발견된 tool name을 snapshot한다. compact 이후에는 deferred tool delta attachment로 현재 deferred pool을 다시 공지한다. Snip 계열은 반대로 `tool_reference` 보유 message를 제거하지 않도록 보호한다.

Normalization은 실패 방어선이다.

- ToolSearch 비활성/unsupported model 전환 시 `tool_reference` block과 assistant `caller` field를 제거해 API 400을 막는다.
- MCP server가 제거되어 reference 대상 tool이 사라지면 unavailable reference만 제거한다.
- `tool_reference`가 들어 있는 `tool_result.content`에는 text를 섞을 수 없으므로, sibling text를 별도 위치로 옮기거나 turn boundary text를 sibling으로 주입한다.
- prompt cache break detection에서는 `defer_loading` tool schema가 실제 server-side prompt cache key에 포함되지 않는다고 보고 hash에서 제외한다.

Agentica에 적용할 때 가장 중요한 점은 "검색 정확도"보다 "스키마 로딩 상태의 수명"이다. selected operation set은 selector call의 local variable이 아니라, retry/compact/resume 이후에도 재구성 가능한 runtime state여야 한다.

## Session Memory와 File-based Recall

주요 anchor:

- memory file scan: `memoryScan.ts:35`
- manifest format: `memoryScan.ts:84`
- relevant memory selection: `findRelevantMemories.ts:39`
- selector prompt: `findRelevantMemories.ts:18`
- side query: `findRelevantMemories.ts:98`
- selected memory JSON schema: `findRelevantMemories.ts:114`

Claude Code의 memory recall은 vector DB 없이 markdown frontmatter manifest를 먼저 만들고, 작은 side query로 최대 몇 개를 고르는 구조다.

Agentica에 바로 필요한 것은 user memory가 아니라 operation/tool memory다. 같은 원리를 operation index와 API catalog에 적용한다.

`/memory` command는 이 recall 자체가 아니라 persistent instruction file을 고르는 interactive control plane이다. user/project `CLAUDE.md`, imported memory, auto-memory/team/agent memory folder를 보여주고 editor를 연다. 따라서 Agentica core에는 editor UI를 넣지 않고, memory source adapter와 context projection/cache invalidation만 설계한다.

`/context` command는 raw transcript가 아니라 compact boundary, context collapse, microcompact가 반영된 API-view를 분석한다. Agentica의 diagnostics도 `AgenticaHistory[]` 총량이 아니라 실제 model-facing projection을 기준으로 해야 한다. 세부 command runtime은 [Claude Code Slash Command Runtime 분석](./slash-command-runtime.md)에 정리했다.

## Skill Frontmatter

`skills/loadSkillsDir.ts`는 skill 본문 전체를 항상 넣지 않고 frontmatter로 discoverability를 만든다. Agentica의 OpenAPI/MCP/function catalog에도 비슷한 계층이 필요하다.

- selector에는 summary/frontmatter만 제공한다.
- caller에는 선택된 function의 full schema만 제공한다.
- function description이 빈약하면 별도 `searchHint`를 둘 수 있게 한다.

## Agentica 적용 결정

- local RAG의 1차 대상은 operation catalog다.
- file-based memory는 core 필수 기능이 아니라 adapter로 남긴다.
- compact는 `summary + operational restore` 형태여야 한다.
- function result는 full history와 projected context를 분리해야 한다.
- compact boundary metadata는 public history text와 internal runtime state를 분리해 설계한다.
- microcompact는 Agentica에서 execute result budget과 result reference로 번역한다.
