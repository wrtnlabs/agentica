# Claude Code AgentTool 분석

이 문서는 `~/github/samchon/claude-code/src/tools/AgentTool/*`를 읽고 Agentica에 적용할 수 있는 구조를 정리한다.

## 핵심 구조

Claude Code의 `AgentTool`은 단순한 "sub-agent 호출 도구"가 아니다. 다음 요소가 하나의 lifecycle로 결합되어 있다.

- agent definition loading
- tool permission filtering
- model/effort/permission mode override
- MCP server inheritance와 agent-specific MCP 추가
- sync/background/remote/worktree execution mode
- fork subagent prompt-cache 전략
- transcript persistence
- progress tracking
- agent memory
- cleanup hooks

Agentica가 배워야 할 점은 sub-agent 자체보다 lifecycle boundary다.

## Agent definition

`loadAgentsDir.ts`의 `AgentDefinition`은 built-in, custom, plugin agent로 나뉜다.

공통 field:

- `agentType`
- `whenToUse`
- `tools`
- `disallowedTools`
- `skills`
- `mcpServers`
- `hooks`
- `color`
- `model`
- `effort`
- `permissionMode`
- `maxTurns`
- `requiredMcpServers`
- `background`
- `initialPrompt`
- `memory`
- `isolation`

중요한 설계:

- agent 파일 frontmatter와 JSON schema가 명확하다.
- agent activation priority가 있다. built-in, plugin, user/project/policy/flag settings가 merge된다.
- MCP requirement가 맞지 않으면 agent prompt에서 제외한다.
- memory가 켜진 agent에는 memory 접근 도구를 자동 보강한다.

Agentica 적용:

- controller operation에도 `whenToUse`, `risk`, `requires`, `domain`, `sideEffect`, `cost`, `protocol` 같은 metadata facet이 필요하다.
- 사용자 정의 "operation group" 또는 "worker profile"을 넣을 때 frontmatter/JSON schema가 있어야 한다.

## Tool filtering

`agentToolUtils.ts`는 agent별 tool pool을 계산한다.

핵심 규칙:

- MCP tool은 모든 agent에 허용된다.
- 모든 agent에 금지되는 tool set이 있다.
- custom agent에만 금지되는 tool set이 있다.
- async agent는 별도 allowlist만 쓸 수 있다.
- `Agent(toolA,toolB)` 형태의 allowed agent types metadata를 해석한다.
- disallowedTools는 wildcard allow보다 후순위가 아니라 실제 필터링으로 적용된다.

Agentica 적용:

- HTTP/class/MCP operation에도 단순 name filter가 아니라 policy filter가 필요하다.
- selection 전 단계에서 permission/policy로 operation candidate를 줄여야 한다.
- 호출 직전에도 다시 검사해야 한다. selector prompt만 믿으면 안 된다.

## runAgent lifecycle

`runAgent.ts`는 sub-agent 실행 전용 query loop wrapper다.

중요 단계:

1. agent id 생성
2. parent/fork context messages 구성
3. file read state cache clone 또는 새 cache 생성
4. user/system context 구성
5. read-only agent에는 일부 무거운 context를 제거
6. permission mode와 effort override
7. tool list resolve
8. system prompt build
9. abort controller 결정
10. SubagentStart hook 실행
11. frontmatter hooks 등록
12. skill preload
13. agent-specific MCP 연결
14. query loop 실행
15. recordable message transcript 기록
16. cleanup: MCP, hooks, prompt cache tracking, file state cache, transcript mapping, todos, shell tasks

Agentica 적용:

- Agentica Next runtime은 `select/call/describe` 함수 호출 묶음이 아니라 lifecycle object가 되어야 한다.
- compact, local RAG, sub-agent, validation feedback은 모두 같은 `run phase -> record event -> cleanup` 규약을 공유해야 한다.

## Async/background

`AgentTool.tsx`는 sync agent도 일정 시간 뒤 foreground task로 등록하고 background 전환할 수 있다.

핵심 아이디어:

- background agent는 parent abort와 분리된다.
- task id를 먼저 만들고 progress를 지속 업데이트한다.
- 완료/실패/kill 상태를 먼저 전환하고, classifier나 worktree cleanup 같은 느린 후처리는 notification embellishment로 다룬다.

Agentica 적용:

- long-running tool call이나 multi-call workflow를 `AgenticaTask`로 표면화할 수 있다.
- `AgenticaExecuteEvent`만으로는 background 상태를 표현하기 어렵다. runtime event 또는 task event가 필요하다.

## Fork subagent

`forkSubagent.ts`는 prompt-cache hit를 위해 parent assistant message의 tool_use block들을 유지하고, 모든 tool_result를 동일 placeholder로 채운 뒤 child directive만 다르게 붙인다.

핵심:

- fork child는 parent system prompt bytes를 그대로 상속한다.
- recursive fork guard가 있다.
- fork child는 질문하지 않고 도구로 직접 수행하도록 강하게 지시된다.
- worktree isolation에서는 경로 번역 notice를 추가한다.

Agentica 적용:

- 일반 Agentica에는 바로 fork worker가 필요하지 않다.
- 대신 "operation selection fork" 또는 "plan verification fork"를 도입할 때, prompt-cache 안정성을 위해 공통 prefix를 byte-stable하게 만드는 전략은 중요하다.

## Agent memory

`agentMemory.ts`는 user/project/local 세 scope를 둔다.

- user: global agent memory
- project: `.claude/agent-memory/<agentType>/`
- local: `.claude/agent-memory-local/<agentType>/`

`agentMemorySnapshot.ts`는 project snapshot을 local memory로 initialize 또는 prompt-update 한다.

Agentica 적용:

- `.wiki`는 사람이 읽는 지식 저장소고, runtime memory는 별도 계층이어야 한다.
- operation/tool memory는 controller 별, project 별, local 별 scope를 구분해야 한다.
- memory가 tool selection에 영향을 주려면 local RAG index의 source facet으로 들어가야 한다.

## Agentica 설계 결론

Agentica가 Claude Code에서 배워야 할 것은 "에이전트를 많이 만든다"가 아니다.

핵심 전환:

- 현재: `initialize -> select -> call -> describe -> cancel` 함수형 오케스트레이션
- 목표: phase lifecycle, event stream, policy gate, context projector, cleanup을 갖춘 runtime

단, MicroAgentica는 현 구조를 유지한다.
