# Agentica RPC/Chat 공개 표면 분석

## 근거 파일

- `packages/rpc/src/AgenticaRpcService.ts`
- `packages/rpc/src/IAgenticaRpcService.ts`
- `packages/rpc/src/IAgenticaRpcListener.ts`
- `packages/rpc/src/structures/*`
- `packages/core/src/Agentica.ts`
- `packages/core/src/events/AgenticaEvent.ts`
- `packages/core/src/json/IAgenticaEventJson.ts`
- `packages/core/src/json/IAgenticaHistoryJson.ts`
- `packages/core/src/factory/events.ts`
- `packages/core/src/factory/histories.ts`
- `packages/core/src/transformers/transformHistory.ts`
- `packages/chat/src/movies/AgenticaChatMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatSystemMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatDescribeMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatExecuteMessageMovie.tsx`
- `packages/chat/src/movies/sides/AgenticaChatSideMovie.tsx`
- `packages/chat/src/examples/**/*`

## Core Event와 History의 차이

`AgenticaEvent` union에는 다음이 있다.

- `userMessage`
- `assistantMessage`
- `initialize`
- `select`
- `call`
- `cancel`
- `execute`
- `describe`
- `validate`
- `jsonParseError`
- `request`
- `response`

`AgenticaHistory`/`IAgenticaHistoryJson`에는 다음이 있다.

- `userMessage`
- `systemMessage`
- `assistantMessage`
- `select`
- `cancel`
- `execute`
- `describe`

중요한 차이는 `systemMessage`가 history에는 있지만 event에는 없다는 점이다. `Agentica.conversate()`는 dispatch된 event 중 `toHistory()`가 있는 것만 모아 turn 종료 시 `histories_`에 push한다. streaming event는 `join()` 뒤 history가 된다.

따라서 compact summary를 기존 `systemMessage` history로 넣는 것은 resume/chat render 호환성이 높지만, 현재 event dispatch 모델로는 runtime listener/RPC에 자연스럽게 흘러가지 않는다.

## Agentica.conversate() History Commit

`Agentica.conversate()`의 commit 구조:

1. `historyGetters` 배열을 만든다.
2. `dispatch(event)` wrapper가 listener dispatch 후 `toHistory()`가 있으면 getter를 등록한다.
3. user prompt event를 dispatch한다.
4. executor를 실행한다.
5. 모든 getter를 resolve해서 `histories_`에 push한다.

streaming assistant/describe는 event 시점에는 진행 중 text를 볼 수 있지만, history에는 최종 text만 남는다.

Compact runtime이 clean하게 들어가려면 다음 중 하나가 필요하다.

- `AgenticaSystemMessageEvent`를 도입해 `systemMessage`도 event/history commit 경로를 타게 한다.
- 새 `compact` event는 runtime notification만 담당하고, history commit은 runtime internal commit에서 수행한다.
- 1차 호환 모드에서는 runtime이 `ctx.histories`에 직접 `systemMessage`를 append하되, ordering과 duplicate commit을 별도 테스트한다.

장기적으로는 첫 번째나 두 번째가 낫다. 단, 새 event는 RPC/chat/JSON/type-check 영향이 크므로 단계적으로 열어야 한다.

## RPC Service

`AgenticaRpcService`는 Agentica event를 client listener로 forwarding한다.

항상 연결되는 listener:

- `userMessage`
- `assistantMessage`
- `describe`

optional listener:

- `initialize`
- `select`
- `cancel`
- `call`
- `execute`

주의점:

- `assistantMessage`와 `describe`는 `await evt.join()` 후 최종 JSON만 보낸다. 현재 RPC는 token streaming을 client로 전달하지 않는다.
- `call` listener는 return value로 arguments를 변경할 수 있다. 이 public behavior는 유지해야 한다.
- `request`, `response`, `validate`, `jsonParseError`는 `IAgenticaRpcListener`에 없다. core event union에 있어도 RPC 공개 표면에는 없다.
- `AgenticaRpcListener.ts`는 stub 상태다.
- `structures/IAgenticaAssistantMessageEventStart.ts`는 빈 파일이고, progress structures는 현재 service에서 사용되지 않는다.

Compact event를 RPC에 바로 추가하면 기존 client interface가 넓어진다. 1차에서는 `systemMessage` history로 resume/chat만 보강하고, RPC runtime progress는 별도 opt-in listener로 설계하는 편이 안전하다.

## Remote/Task Runtime 도입 시 영향

Claude Code `remote`/`bridge` 분석 결과 remote runtime event는 core event와 1:1로 대응하지 않는다.

remote adapter가 받을 수 있는 event 축:

- SDK assistant/user/result/system/stream event
- control request/response/cancel request
- permission prompt
- reconnect/disconnect/heartbeat
- compact boundary/status
- auth refresh/worker credential refresh
- session archive/stop/interrupt

이를 곧바로 `IAgenticaRpcListener`에 노출하면 client가 transport 세부에 묶인다. 특히 현재 Agentica RPC는 assistant/describe도 final-only로 forwarding하므로, remote progress만 streaming으로 열면 일관성이 깨진다.

1차 정책:

- remote session state는 `Agentica` internal runtime state로 둔다.
- remote SDK event는 adapter projection을 거쳐 필요한 경우 짧은 `systemMessage` marker만 남긴다.
- permission request는 `call` listener의 argument override와 섞지 않는다. 별도 interaction listener가 필요하다.
- stop/interrupt는 operation failure가 아니라 task/remote control transition이다.
- `task` listener와 `remoteSession` listener는 compact 안정화 이후 opt-in으로 연다.

## Chat UI

`AgenticaChatMovie`는 다음 event를 구독한다.

- `select`
- `assistantMessage`
- `userMessage`
- `describe`
- `validate`
- `jsonParseError`

`MicroAgentica` 경로에서는 `select`를 구독하지 않는다.

message renderer는 다음을 보여준다.

- `assistantMessage`
- `select`
- `describe`
- `userMessage`
- `systemMessage`

`cancel`과 `execute`는 직접 렌더링하지 않는다. execute 결과는 describe message 내부에서 표시된다.

`AgenticaChatSystemMessageMovie`는 `systemMessage.text`를 System 카드로 보여준다. 따라서 compact summary를 그대로 `systemMessage`에 넣으면 UI에 크게 노출된다. 사람이 읽을 필요가 낮은 내부 metadata까지 text에 넣으면 UX가 나빠진다.

세부 renderer 독해 결과는 [Agentica Chat Renderer 현재 구조](./chat-renderer-current.md)에 분리했다. 추가 제약은 다음과 같다.

- 현재 chat UI는 `assistantMessage`와 `describe`를 `join()`한 뒤 최종 history만 append한다. streaming/progress UI가 아니다.
- `execute` top-level history는 렌더링하지 않지만, `describe.executes`는 collapsed section 안에서 전체 arguments/value JSON을 출력한다.
- `userMessage`는 text content만 렌더링하고 multimodal/file content는 무시한다.
- `validate`와 `jsonParseError`는 `console.error`만 하며 user-facing diagnostic이 없다.
- side panel의 price 계산은 vendor/model과 무관한 고정 단가다.
- `MarkdownViewer`는 raw HTML을 허용하는 구성이라 runtime marker/result preview의 HTML 안전성 검토가 필요하다.

## Compact 도입 시 영향

### History-only 호환 모드

장점:

- `IAgenticaHistoryJson.ISystemMessage`와 `transformHistory()`가 이미 있다.
- chat renderer가 이미 `systemMessage`를 처리한다.
- resume input으로도 이미 들어갈 수 있다.

한계:

- `systemMessage`에는 `text`만 있어 compact metadata를 구조적으로 담을 수 없다.
- runtime listener/RPC는 system message event를 받지 못한다.
- large result refs, preserved segment, selected operation snapshot을 public JSON에 넣으려면 새 type이 필요하다.

### 새 History Type 추가

새 `compact` 또는 `contextBoundary` history type을 추가하면 metadata를 구조화할 수 있다. 대신 다음을 동시에 수정해야 한다.

- `histories/AgenticaHistory.ts`
- `json/IAgenticaHistoryJson.ts`
- `factory/histories.ts`
- `transformers/transformHistory.ts`
- `factory.decodeHistory()`
- `packages/chat` renderer
- `packages/rpc` JSON forwarding 정책
- docs와 tests

### 새 Event 추가

새 runtime event 후보:

- `compactStart`
- `compactProgress`
- `compactEnd`
- `compactError`
- 단일 `compact`

하지만 현재 RPC도 assistant/describe streaming을 final-only로 보내므로, compact progress까지 즉시 공개하면 surface가 과하게 커진다. 먼저 internal event나 config hook으로 운영하고, user-facing event는 compact 안정화 후 추가하는 편이 낫다.

## MicroAgentica 경계

사용자 지시에 따라 `MicroAgentica`는 변경하지 않는다.

구체적으로 금지:

- MicroAgentica event union 변경
- MicroAgentica `conversate()` flow 변경
- MicroAgentica RPC service 변경
- MicroAgentica chat behavior 변경
- selector/context compaction 자동 도입

공유 type export 추가가 불가피한 경우에도 MicroAgentica runtime path에 연결하지 않는다.

## 설계 결론

1. Compact 1차 구현은 Agentica-only runtime 내부 기능으로 둔다.
2. Public history는 기존 `systemMessage`를 호환 모드로 활용하되, 구조 metadata는 internal runtime state에 둔다.
3. 새 event/history discriminant는 compact invariants와 tests가 안정된 뒤 별도 phase로 연다.
4. RPC는 final-only 특성을 유지한다. compact progress streaming은 별도 opt-in listener가 생기기 전까지 노출하지 않는다.
5. Chat UI에는 compact summary를 그대로 크게 노출하지 말고, 짧은 system text와 상세 metadata 분리를 고려한다.
6. `call` listener의 arguments override behavior는 compact/runtime 변경 중 절대 깨면 안 된다.
7. remote/task runtime event는 internal adapter에서 projection한 뒤, public RPC에는 terminal/control 수준의 의미 있는 event부터 opt-in으로 연다.
8. large execute result는 chat에서도 full JSON으로 노출되므로 result budget은 model-facing context와 UI display contract를 함께 바꿔야 한다.
