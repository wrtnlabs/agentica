# 외부 Reference 조사

## 범위

Claude Code snapshot 분석에서 뽑은 Agentica Next 설계 원칙을 외부 공식 문서/표준과 대조한다.

2026-05-22 기준으로 확인한 주요 reference:

- OpenAI Function Calling guide: https://developers.openai.com/api/docs/guides/function-calling
- OpenAI Structured Outputs guide: https://developers.openai.com/api/docs/guides/structured-outputs
- Anthropic Tool Use overview: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic Prompt Caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Anthropic Context Editing: https://platform.claude.com/docs/en/build-with-claude/context-editing
- Anthropic Compaction: https://platform.claude.com/docs/en/build-with-claude/compaction
- Model Context Protocol specification 2025-11-25: https://modelcontextprotocol.io/specification/2025-11-25
- Model Context Protocol server features: https://modelcontextprotocol.io/specification/2025-11-25/server/index
- Model Context Protocol tools: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- Model Context Protocol tasks: https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks
- SQLite FTS5: https://www.sqlite.org/fts5.html
- React preserving/resetting state: https://react.dev/learn/preserving-and-resetting-state
- React `useDeferredValue`: https://react.dev/reference/react/useDeferredValue
- React `memo`: https://react.dev/reference/react/memo
- Unicode UAX #29 Text Segmentation: https://unicode.org/reports/tr29/
- JSON Schema Draft 2020-12: https://json-schema.org/draft/2020-12

## Tool Calling과 Structured Output

OpenAI와 Anthropic 모두 tool/function call을 "model이 호출 의도를 구조화하고 application이 실행한 뒤 result를 다시 넘기는 loop"로 설명한다. OpenAI guide는 tool call output이 특정 call id를 참조해야 한다고 설명하고, Anthropic guide도 client tool은 application이 실행하고 `tool_result`로 되돌리는 구조를 둔다.

Agentica 적용:

- `select -> call -> execute -> describe/final`을 append-only chat text가 아니라 state transition으로 다루는 현재 설계와 맞다.
- tool call/result pairing은 context projector가 보존해야 한다.
- provider별 tool result shape는 다르므로 internal `AgenticaOperationRunState`와 provider projection을 분리해야 한다.
- Anthropic은 tool schema와 tool use block 자체도 token cost에 포함된다고 설명한다. Agentica local selector와 deferred schema projection은 token budget 절감 목적과 부합한다.

Structured Outputs/strict tool use는 JSON Schema 기반 schema adherence를 강화하지만, provider별 schema subset과 strict mode 요구사항이 다르다.

Agentica 적용:

- Agentica는 TypeScript/typia schema를 provider request로 투영하되 provider별 strict mode 요구사항을 adapter에서 정규화해야 한다.
- validation retry는 유지해야 한다. strict mode가 있더라도 모든 provider/모델/병렬 호출 조합에서 같은 보장을 기대하면 안 된다.
- `additionalProperties: false`, required field 처리, unsupported schema keyword 제거/변환은 projector 단계에서 결정한다.

## Context Management, Caching, Compaction

Anthropic prompt caching 문서는 long multi-turn conversation, repeated instructions, large context가 caching 대상이 될 수 있지만, cache breakpoint 뒤의 dynamic content와 tool choice/image/thinking setting 변화가 cache hit에 영향을 준다고 설명한다.

Anthropic context editing/compaction 문서는 두 가지 축을 분리한다.

- context editing: 오래된 tool result/thinking block을 선택적으로 지우거나 placeholder로 대체한다.
- compaction: conversation summary를 만들고 이전 raw history를 summary 기준으로 대체한다.

Agentica 적용:

- compact는 단순 transcript summarize가 아니라 "model-facing context를 다시 쓰는 transaction"이어야 한다.
- tool result clearing, result reference, output preview는 compaction과 별개 phase로 설계할 수 있다.
- prompt caching을 고려하면 stable prefix와 dynamic tool result를 분리해야 한다. 매 turn마다 schema/order/cache breakpoint가 흔들리는 projector는 비용/latency 이점을 잃는다.
- compact summary는 chat UI에 전문을 그대로 노출하지 않는다. model-facing summary, public marker, adapter details view를 분리한다.

## MCP와 Connector Public Surface

MCP 2025-11-25 specification은 JSON-RPC 2.0, stateful connection, capability negotiation을 기본으로 두고, server primitives를 prompts/resources/tools로 나눈다. server feature overview는 prompts를 user-controlled, resources를 application-controlled, tools를 model-controlled로 구분한다.

MCP tool spec은 다음을 뒷받침한다.

- tool name/description/schema는 discoverable metadata다.
- tool result는 unstructured content, structured content, resource link, embedded resource를 가질 수 있다.
- output schema가 있으면 server는 structured result를 schema에 맞춰야 하고 client는 validate하는 것이 권장된다.
- protocol error와 tool execution error는 의미가 다르다.
- sensitive operation은 user confirmation, input visibility, timeout, audit가 필요하다.

MCP task utility는 task가 durable state machine이며 deferred result retrieval/polling에 맞는다고 설명한다. 실험적 기능이므로 core public event에 바로 강하게 묶으면 변경 비용이 크다.

Agentica 적용:

- connector runtime state, tool registry, auth/permission, progress/cancel/logging은 public history와 분리한다.
- `operationResult`는 inline JSON 하나가 아니라 content block, structured content, resource reference, error class를 다룰 수 있어야 한다.
- protocol error는 model self-correction feedback으로 항상 유용하지 않다. validation/business execution error와 구분한다.
- task/remote runtime은 optional adapter/runtime surface로 시작하고, `MicroAgentica`에는 강제하지 않는다.

## Local Search와 No-DB Selector

SQLite FTS5는 tokenizer, prefix index, BM25 ranking, column weighting, custom tokenizer/auxiliary function을 제공한다. 이는 local-only lexical selector를 만들 때 충분한 building block이다. 다만 Claude Code ToolSearch처럼 직접 token scoring을 구현하는 방식도 가능하다.

Agentica 적용:

- `@agentica/vector-selector`의 DBMS/embedding 방식은 optional package로 유지할 수 있다.
- core에는 network/DBMS 의존이 없는 lexical index를 먼저 둔다.
- schema name, path, HTTP method, operation id, tag, `searchHint`, parameter name, required field를 field-weighted token으로 색인한다.
- SQLite FTS5를 쓰더라도 local file/db artifact는 cache implementation detail이어야 한다. public API가 SQLite/Postgres에 묶이면 안 된다.

## Render Projection과 UI State

React state docs는 component state가 render tree position/key에 묶인다고 설명한다. `useDeferredValue`는 느린 UI 부분의 update를 뒤로 미룰 수 있고, `memo`는 props가 바뀌지 않을 때 re-render skip에 쓸 수 있다.

Unicode UAX #29는 grapheme cluster 단위 segmentation 기준을 제공한다. Terminal/chat renderer에서 emoji/CJK/combining mark를 단순 code unit으로 자르면 cursor/search/copy가 어긋난다.

Agentica 적용:

- render row id 안정성은 UI state 보존 조건이다. compact/collapse/grouping 뒤에도 row key가 안정적이어야 한다.
- long transcript transform은 streaming input과 분리하고, 필요하면 deferred rendering/virtualization을 쓴다.
- render projection, search text, visible text, copy text는 drift test를 둔다.
- terminal adapter를 만든다면 grapheme/wide-char/soft-wrap/no-select edge를 adapter test로 둔다. core history test로 끌어올리지 않는다.

## 설계 결정에 주는 영향

1. Provider API는 tool loop와 schema validation을 제공하지만, Agentica의 operation selection/context compaction/public history 정책을 대신 설계해주지 않는다.
2. MCP는 connector/tool/resource/task vocabulary를 제공하지만, public chat history와 runtime control channel을 섞으라고 요구하지 않는다.
3. Context management는 summary, clearing, cache, reference를 분리해야 한다.
4. Local selector는 official provider tool search가 있는 환경에서도 필요하다. provider-neutral fallback, no-network path, MicroAgentica 비변경 원칙을 지키기 때문이다.
5. UI adapter는 core history의 단순 map이 아니라 별도 projection이어야 한다.
