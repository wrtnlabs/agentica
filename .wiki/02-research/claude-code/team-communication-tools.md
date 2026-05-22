# Claude Code Team Communication Tools 분석

## 범위

이 문서는 Claude Code의 team/swarm 생성, 삭제, agent 간 메시징 도구를 정리한다.

`utils/swarm` runtime, mailbox implementation, in-process runner, permission sync 세부는 별도 문서 `state-swarm-runtime.md`에 보강했다.

읽은 주요 파일:

- `/home/samchon/github/samchon/claude-code/src/tools/TeamCreateTool/TeamCreateTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TeamCreateTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TeamDeleteTool/TeamDeleteTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TeamDeleteTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SendMessageTool/SendMessageTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/SendMessageTool/prompt.ts`

## TeamCreateTool

`TeamCreate`는 multi-agent swarm의 project/task-list boundary를 만든다.

입력:

- `team_name`: 필수.
- `description`: optional.
- `agent_type`: optional team lead role.

enablement:

- `isAgentSwarmsEnabled()`가 true일 때만 활성화된다.
- 이미 leader가 team을 가지고 있으면 새 team 생성을 거부한다.
- 같은 이름의 team file이 있으면 실패하지 않고 word slug로 unique team name을 만든다.

생성 결과:

- team file: `~/.claude/teams/{team-name}/config.json`.
- task list directory: `~/.claude/tasks/{team-name}/`.
- lead agent id: `team-lead@teamName` 형태의 deterministic id.
- lead model: AppState session model/settings/default model을 parse해 기록한다.
- AppState `teamContext`에 team name, file path, lead agent, teammate registry를 넣는다.
- task list를 reset하고 task directory를 보장한다.
- session-end cleanup 대상으로 team을 등록한다.

prompt workflow:

1. TeamCreate로 team과 task list를 만든다.
2. TaskCreate/TaskList 등으로 shared task list를 만든다.
3. Agent tool로 teammate를 spawn한다.
4. TaskUpdate owner로 task를 할당한다.
5. teammate는 task를 완료하고 idle notification을 보낸다.
6. 완료 후 SendMessage structured shutdown request로 teammate를 종료한다.
7. 모든 teammate가 내려간 뒤 TeamDelete를 호출한다.

중요한 prompt 규칙:

- teammate는 UUID가 아니라 human-readable name으로 지칭한다.
- teammate idle은 정상 상태다.
- teammate message는 자동 전달되며 inbox를 수동 polling하지 않는다.
- 팀 활동을 보기 위해 terminal을 뒤지는 대신 SendMessage와 Task tools를 사용한다.
- JSON status message를 임의로 만들지 말고 TaskUpdate를 사용한다.

Agentica 적용점:

- team은 단순 agent 배열이 아니라 shared task list와 mailbox, cleanup boundary다.
- leader는 자기 자신을 teammate로 취급하지 않는다.
- task ownership은 team name 기준 namespace로 격리해야 한다.

## TeamDeleteTool

`TeamDelete`는 team directory와 task directory를 정리한다.

동작:

- 현재 AppState teamContext에서 team name을 찾는다.
- team file을 읽어 lead가 아닌 active member를 검사한다.
- `isActive !== false`인 non-lead member가 있으면 cleanup을 거부한다.
- cleanup 성공 시 team directories를 제거한다.
- session cleanup 등록을 해제한다.
- teammate colors와 leader team name을 clear한다.
- AppState `teamContext`와 `inbox.messages`를 비운다.

Agentica 적용점:

- team cleanup은 active child runtime이 모두 종료된 뒤 가능해야 한다.
- cleanup은 state clear뿐 아니라 durable artifacts와 scheduled cleanup registry까지 포함한다.

## SendMessageTool

`SendMessage`는 teammate, in-process local agent, UDS peer, bridge remote session까지 여러 routing backend를 가진다.

입력:

- `to`: teammate name, `*`, `uds:<socket>`, `bridge:<session-id>`.
- `summary`: plain string message일 때 UI preview로 필요하다. UDS/bridge string send는 summary 없이도 허용된다.
- `message`: plain string 또는 structured message.

structured message:

- `shutdown_request`
- `shutdown_response`
- `plan_approval_response`

권한/검증:

- cross-machine `bridge:` plain message는 explicit user consent가 필요하다.
- bridge structured message는 금지된다.
- bridge는 Remote Control handle과 active state가 있어야 한다.
- `to`에 `@`를 넣는 것은 금지된다. 한 세션에 team은 하나라는 가정 때문이다.
- plain string message는 일반 teammate 대상일 때 summary가 필요하다.
- structured broadcast는 금지된다.
- `shutdown_response`는 반드시 team-lead에게 보내야 한다.
- shutdown reject에는 reason이 필요하다.

plain message routing:

- `bridge:`는 Anthropic server를 통해 remote control peer로 보낸다. permission 대기 중 연결이 끊길 수 있으므로 call 시점에 handle을 재검증한다.
- `uds:`는 local socket으로 전송한다.
- registered in-process agent name 또는 raw agent id가 있으면 AppState task registry를 먼저 본다.
- running local agent에는 pending message를 queue한다.
- stopped local agent는 transcript/output file 기반으로 background resume을 시도한다.
- task가 evicted되어도 transcript가 있으면 resume을 시도한다.
- 그 외에는 team mailbox에 DM 또는 broadcast를 쓴다.

structured protocol:

- `shutdown_request`는 target mailbox에 request id와 reason을 보낸다.
- `shutdown_response approve`는 team lead에게 승인 메시지를 보내고, in-process teammate면 abort controller를 abort한다. 그 외 backend는 gracefulShutdown을 예약한다.
- `shutdown_response reject`는 reason을 team lead에게 보낸다.
- `plan_approval_response approve/reject`는 team lead만 보낼 수 있다.
- plan approval approve는 leader의 permission mode를 teammate에게 전달하되, leader가 plan mode면 default로 바꿔 전달한다.
- plan rejection은 feedback을 포함한다.

Agentica 적용점:

- agent 간 통신은 단일 `send(message)`가 아니라 routing backend별 safety rule이 필요하다.
- in-process child agent는 message queue/resume/abort가 runtime task state와 연결되어야 한다.
- remote peer prompt injection은 permission bypass/auto-mode를 뚫지 못하게 별도 safetyCheck로 두어야 한다.
- plan approval과 shutdown은 plain text가 아니라 typed protocol message가 낫다.

## Agentica Team Runtime 초안

Agentica에 team을 붙인다면 core operation call과 분리된 runtime 계층에 둔다.

```ts
interface AgenticaTeamRuntimeState {
  teamName: string;
  leadAgentId: string;
  members: Record<string, AgenticaTeamMemberState>;
  taskListId: string;
  mailbox: AgenticaMailboxAdapter;
}

interface AgenticaTeamMemberState {
  agentId: string;
  name: string;
  agentType: string;
  status: "running" | "idle" | "stopped" | "failed";
  model?: string;
  cwd?: string;
  subscriptions?: string[];
}
```

초기 도입 원칙:

- `Agentica` 전용 runtime wrapper에서만 실험한다.
- `MicroAgentica`에는 연결하지 않는다.
- team/task/mailbox artifact storage는 adapter interface로 둔다.
- public API는 바로 열지 말고 internal event로 먼저 검증한다.
