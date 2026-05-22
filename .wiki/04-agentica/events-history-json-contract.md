# Agentica Event/History/JSON 계약

이 문서는 `packages/core/src/events/*`, `json/*`, `factory/*`, `transformers/transformHistory.ts`를 기준으로 현재 serialization 계약을 정리한다.

RPC/chat 공개 표면까지 포함한 영향 분석은 [Agentica RPC/Chat 공개 표면 분석](./rpc-chat-public-surface.md)에 분리했다.

## 세 계층

Agentica의 대화/실행 상태는 세 계층으로 노출된다.

| 계층 | 위치 | 용도 |
| --- | --- | --- |
| runtime event | `events/*` | `Agentica.on()` listener가 받는 실행 중 이벤트 |
| history | `histories/*`, `factory/histories.ts` | 다음 LLM request로 decode되는 대화/도구 기록 |
| JSON | `json/*` | public serialization, session resume input |

`Agentica.conversate()`는 event를 dispatch하고, `toHistory()`가 있는 event만 history getter에 넣는다. stream event는 `join()`이 있으면 join 후 history화한다. 따라서 streaming assistant/describe event의 JSON은 진행 중 상태를 담을 수 있지만 history는 최종 text만 남긴다.

## Event union

`AgenticaEvent` union:

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

`MicroAgenticaEvent`는 이 중 `initialize`, `select`, `cancel`을 제외한다. 이 차이는 MicroAgentica 변경 금지 조건과 직접 연결된다.

`AgenticaEventSource`는 현재 `initialize | select | cancel | call | describe`다. `request`/`response` 이벤트에는 source가 붙으므로 새 internal phase를 추가하면 source union도 같이 검토해야 한다.

현재 `systemMessage`는 event union에 없다. history에는 존재하지만 listener/RPC runtime event로 흐르지 않는다. compact marker를 `systemMessage`로 시작하는 것은 호환성이 높지만, runtime progress event를 의미하지 않는다.

## History union

`IAgenticaHistoryJson` union:

- `userMessage`
- `systemMessage`
- `assistantMessage`
- `select`
- `cancel`
- `execute`
- `describe`

`request`, `response`, `validate`, `jsonParseError`, `call`, `initialize`는 history가 아니다. 즉 runtime observability와 resumable memory는 다르다.

`factory.decodeHistory()` 동작:

- `describe`는 LLM message로 decode하지 않는다.
- `select`/`cancel`은 assistant tool call + empty tool result로 decode한다.
- `execute`는 assistant tool call + tool result로 decode한다. HTTP는 `{ status, data }`, class/MCP는 `{ value }` 형태가 된다.
- user content는 text/audio/file/image를 OpenAI chat content part로 변환한다.

## JSON 계약

`IAgenticaEventJson`과 `IAgenticaHistoryJson`은 type-level check 파일로 runtime event/history type과 discriminant를 맞춘다.

중요한 차이:

- `IAgenticaEventJson.IDescribe`에는 `done`이 있다.
- `IAgenticaHistoryJson.IDescribe`에는 `done`이 없다.
- `request` event JSON body는 streaming request type으로 문서화되어 있으나 runtime event는 streaming/non-streaming union이다.
- `jsonParseError` runtime event는 `failure`를 들고 있고, JSON interface는 `arguments`, `errorMessage`를 기대한다. 현재 factory의 `createJsonParseErrorEvent()`에는 `toJSON()`이 없다. 이 이벤트를 public JSON으로 안정화하려면 먼저 이 mismatch를 해소해야 한다.

## Transform 계약

`transformHistory()`는 resume 시 JSON history를 runtime history로 복원한다.

핵심 제약:

- `select`, `cancel`, `execute`, `describe.executes`는 `controller`와 `function` 이름으로 현재 operation map에서 원본 operation을 찾아야 한다.
- 이전 session의 controller/function 이름이 현재 controller set에 없으면 `No operation found` 에러가 난다.
- operation JSON의 `name`보다 `controller + function`이 복원 key로 쓰인다.

따라서 local RAG index나 compact history가 operation reference를 줄일 때도 `controller`, `function`, `protocol`, `name`을 모두 유지해야 한다.

## 새 event 추가 체크리스트

Agentica Next에서 compact/runtime/sub-agent event를 추가할 때 한 파일만 고치면 안 된다.

필수 검토:

1. `events/AgenticaEvent.ts`
2. `events/AgenticaEvent.type.ts`
3. `json/IAgenticaEventJson.ts`
4. `json/IAgenticaEventJson.type.ts`
5. 필요한 경우 `json/IAgenticaHistoryJson.ts`
6. `factory/events.ts`
7. history로 남길 경우 `factory/histories.ts`
8. resume 대상이면 `transformHistory.ts`
9. `packages/rpc` event forwarding
10. `packages/chat` renderer/side panel

## Compact 설계와의 연결

Claude Code식 compact boundary를 Agentica에 넣을 경우, history union에 바로 새 `compact` history를 추가하기보다 다음 형태가 안전하다.

- runtime event: 1차는 internal hook 또는 미공개 state, 장기적으로 `compactStart`, `compactEnd`, `compactError` 또는 단일 `compact`
- history JSON: 기존 `systemMessage`에 짧은 compact marker를 넣는 호환 모드부터 시작
- 내부 state: compact boundary metadata는 public history text와 분리한 `AgenticaRuntimeState`에 보관

public history에 새 discriminant를 바로 추가하면 resume, JSON type checks, UI, RPC, chat renderer가 동시에 깨질 수 있다.

## RPC/Chat 확인 결과

- `AgenticaRpcService`는 `assistantMessage`와 `describe`를 `join()` 후 final JSON으로 보낸다.
- RPC listener에는 `request`, `response`, `validate`, `jsonParseError`가 없다.
- `call` listener는 return value로 arguments를 override할 수 있으므로 runtime 변경 중 이 await 위치를 유지해야 한다.
- chat renderer는 `systemMessage`를 이미 보여주지만, compact 전용 UI는 없다.
- `cancel`과 `execute`는 chat 본문에서 직접 렌더링되지 않는다. execute는 describe 내부에서 간접 노출된다.
