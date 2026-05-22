# Claude Code 아키텍처 관찰

## 분석 범위

대상 저장소는 `/home/samchon/github/samchon/claude-code`다. README에 따르면 npm 배포물의 source map 노출로 확보된 공개 snapshot이며 공식 Anthropic 저장소는 아니다. Agentica에는 코드를 복사하지 않고, 아키텍처 패턴과 실패 방지 전략만 학습 대상으로 삼는다.

## 큰 구조

Claude Code는 단순 function-calling wrapper가 아니라 장기 실행 query loop를 중심으로 구성된다.

- `src/query.ts`: main query loop. model call, streaming, tool execution, compaction, recovery, hooks, continuation을 한 상태 전이 안에서 처리한다.
- `src/Tool.ts`: 모든 tool의 공통 계약. schema뿐 아니라 permission, read-only/destructive, concurrency safety, result rendering, deferred loading, result size 정책까지 포함한다.
- `src/services/tools/*`: tool 실행, streaming 중 tool 실행, hook 처리, permission 결과를 model-facing tool result로 변환한다.
- `src/services/compact/*`: microcompact, auto compact, manual compact, session memory compact, partial compact를 분리한다.
- `src/tools/ToolSearchTool/*`와 `src/utils/toolSearch.ts`: 모든 tool schema를 초기에 싣지 않고 필요할 때 검색/로딩하는 deferred tool discovery를 담당한다.
- `src/memdir/*`, `src/services/SessionMemory/*`, `src/skills/*`: 파일 기반 기억, skill frontmatter, 필요 시 본문 로딩 구조를 제공한다.

## Query Loop의 핵심 패턴

`query.ts`는 한 번의 user turn을 단일 API 호출로 보지 않는다. 다음 단계를 반복하는 generator 상태 머신에 가깝다.

1. 기존 메시지에서 compact boundary 이후의 유효 context를 만든다.
2. 큰 tool result를 예산에 맞게 줄인다.
3. microcompact를 먼저 적용한다.
4. 필요하면 auto compact를 수행하고 post-compact 메시지로 교체한다.
5. model streaming을 시작한다.
6. streaming 중 tool_use가 도착하면 가능한 tool은 즉시 실행한다.
7. tool result를 모두 모아 다음 loop iteration의 user message로 넣는다.
8. prompt-too-long, max-output-tokens, model fallback, stop hook, token budget continuation을 transition reason으로 다룬다.

중요한 점은 `messages`, `toolUseContext`, `autoCompactTracking`, `transition`, `turnCount` 같은 상태를 명시적으로 carry한다는 것이다. Agentica의 현재 `initialize -> select -> call -> describe` 흐름보다 실패 복구와 확장이 훨씬 쉽다.

## Tool 계약의 밀도

Claude Code tool은 단순한 `{ name, description, parameters, execute }`가 아니다.

- `inputSchema`와 `inputJSONSchema`
- `validateInput`
- `checkPermissions`
- `isReadOnly`, `isDestructive`
- `isConcurrencySafe`
- `interruptBehavior`
- `shouldDefer`, `alwaysLoad`, `searchHint`
- `maxResultSizeChars`
- `mapToolResultToToolResultBlockParam`
- UI/rendering과 transcript search용 별도 표현

Agentica의 `AgenticaOperation`은 protocol/controller/function/name 중심이라 function calling에는 충분하지만, 장기 실행 agent runtime의 정책 표현에는 부족하다.

## Context 관리

Claude Code의 context 관리는 여러 층으로 나뉜다.

- Tool result budget: 큰 결과를 전체 context에 그대로 두지 않는다.
- Microcompact: 오래된 read/search/shell/web 결과를 축약하거나 삭제한다.
- Auto compact: threshold를 넘으면 summary를 만들고 compact boundary를 남긴다.
- Reactive compact: 실제 API가 prompt-too-long을 반환했을 때 error를 바로 노출하지 않고 압축 후 재시도한다.
- Session memory compact: 전체 summary 대신 session memory와 최근 tail을 조합한다.
- Post-compact restore: 최근 read file, plan, skill, deferred tool state, MCP instruction 같은 실행 지속에 필요한 정보를 다시 붙인다.

이 구조에서 중요한 설계 원칙은 압축 결과만 보존하는 것이 아니라, 압축 이후 첫 턴에 필요한 operational context를 재주입한다는 점이다.

## 로컬 RAG와 검색

Claude Code의 검색은 vector DB 일변도가 아니다.

- Deferred tool search는 tool name, MCP server name, description, searchHint를 keyword scoring으로 검색한다.
- Memory recall은 memory directory의 markdown frontmatter만 먼저 scan하고, LLM side query가 최대 몇 개의 memory file을 선택한다.
- Skill system은 frontmatter로 discoverability를 확보하고, 실제 본문은 invocation 시점에 로딩한다.
- 파일/코드 검색은 ripgrep, glob 등 로컬 primitive를 적극 사용한다.

Agentica의 `@agentica/vector-selector`가 DBMS/embedding 전략에 치우쳐 있다면, Claude Code식 접근은 core에 dependency-free local search layer를 넣기에 적합하다.

## Prompt와 workflow 전략

Claude Code는 상황별 prompt를 강하게 분리한다.

- Main system prompt와 user/system context를 분리한다.
- Compact prompt는 tool 사용을 금지하고 summary 형식을 강제한다.
- Recovery prompt는 사과/요약 없이 이어서 진행하도록 작게 주입한다.
- ToolSearch prompt는 query form을 명확히 제한한다.
- Stop hook, post compact, memory extraction, prompt suggestion 등은 main response 이후의 lifecycle hook으로 동작한다.

Agentica도 `SELECT`, `EXECUTE`, `VALIDATE` prompt가 있으나, workflow 상태와 prompt가 강하게 연결되어 있지는 않다. 앞으로는 prompt를 "상태 전이별 contract"로 다뤄야 한다.

