# Claude Code Tool System 정밀 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/Tool.ts`
- `/home/samchon/github/samchon/claude-code/src/services/tools/toolOrchestration.ts`
- `/home/samchon/github/samchon/claude-code/src/services/tools/toolExecution.ts`
- `/home/samchon/github/samchon/claude-code/src/services/tools/StreamingToolExecutor.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ToolSearchTool/ToolSearchTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/ToolSearchTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/toolSearch.ts`

## Tool 계약

`Tool.ts`의 핵심 anchor:

- `ToolUseContext`: `Tool.ts:158`
- `Tool` type: `Tool.ts:362`
- `isConcurrencySafe`: `Tool.ts:402`
- `shouldDefer`: `Tool.ts:442`
- `alwaysLoad`: `Tool.ts:449`
- `maxResultSizeChars`: `Tool.ts:466`
- `checkPermissions`: `Tool.ts:500`
- default filling `buildTool`: `Tool.ts:783`

Claude Code tool은 schema와 executor만 가진 객체가 아니다. runtime policy, permission, concurrency, result projection, deferred loading 여부까지 한 계약에 묶는다.

Permission control flow의 세부 구조는 [Claude Code Tool Permission Control Flow 분석](./tool-permission-control-flow.md)에 분리했다. 핵심은 tool-local `checkPermissions`가 전체 결정이 아니라 global rule/mode/hook/UI/remote approval flow의 입력이라는 점이다.

## Agentica와의 차이

Agentica의 `AgenticaOperation`은 protocol/controller/function/name 중심이다. function calling schema 생성에는 충분하지만 다음 runtime 판단에는 정보가 부족하다.

- 이 함수는 read-only인가?
- 동시에 실행해도 되는가?
- 결과가 너무 크면 어떻게 줄일 것인가?
- destructive operation이면 승인 정책이 필요한가?
- selector에서 검색 hint를 별도로 줄 수 있는가?
- 최초 prompt에 full schema를 노출해야 하는가?

따라서 Agentica에는 `AgenticaOperation` 자체를 무겁게 만들기보다, 별도 `AgenticaOperationRuntime` 또는 metadata layer가 필요하다.

## Tool Execution

`toolOrchestration.ts`는 tool calls를 concurrency-safe batch와 serial batch로 나눈다. read-only/search성 tool은 동시에 실행할 수 있고, write/destructive tool은 순차 실행한다.

`StreamingToolExecutor.ts`는 tool_use가 streaming 도중 도착하면 즉시 실행 queue에 넣는다. 실행 중 오류가 나면 sibling tool을 synthetic error로 정리해 API의 tool_use/tool_result pairing invariant를 지킨다.

Agentica에서 즉시 streaming tool execution을 바로 구현할 필요는 없다. 그러나 다음 원칙은 가져와야 한다.

- function call 실행 결과는 항상 대응되는 tool result/history를 가져야 한다.
- 병렬 실행 가능 여부는 operation metadata에서 결정한다.
- 실패/abort 시 synthetic failure history를 남겨 다음 LLM request가 깨지지 않게 한다.

## ToolSearch 분석

ToolSearch 관련 anchor:

- tool name parser: `ToolSearchTool.ts:132`
- keyword search: `ToolSearchTool.ts:186`
- direct `select:` query: `ToolSearchTool.ts:363`
- tool reference result: `ToolSearchTool.ts:444`
- deferrable tool predicate: `prompt.ts:62`
- discovered tool scan: `utils/toolSearch.ts:525`

Claude Code의 ToolSearch는 embedding/vector DB가 아니다. 이름, MCP server/action name, description, searchHint를 로컬 keyword scoring으로 검색한다.

Agentica는 OpenAI Chat Completions를 주요 vendor로 쓰므로 Anthropic의 `tool_reference`를 그대로 쓸 수 없다. 대신 runtime 단계에서 deferred schema loading을 구현한다.

1. local operation index로 top-K operation을 고른다.
2. LLM selector에는 top-K summary만 보낸다.
3. caller에는 선택된 operation의 full schema만 보낸다.

## Agentica 적용 결정

- `AgenticaOperation`은 기존 호환을 위해 유지한다.
- 새 metadata layer를 도입한다.
- local operation search는 core dependency-free로 둔다.
- vector/embedding selector는 optional strategy로 격리한다.
- `MicroAgentica`는 full operation list 직접 노출 방식을 유지한다.
