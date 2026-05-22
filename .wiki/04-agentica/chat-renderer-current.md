# Agentica Chat Renderer 현재 구조

## 근거 파일

- `packages/chat/package.json`
- `packages/chat/src/index.ts`
- `packages/chat/src/AgenticaChatApplication.tsx`
- `packages/chat/src/movies/AgenticaChatMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatAssistantMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatDescribeMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatExecuteMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatSelectMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatSystemMessageMovie.tsx`
- `packages/chat/src/movies/messages/AgenticaChatUserMessageMovie.tsx`
- `packages/chat/src/movies/sides/AgenticaChatSideMovie.tsx`
- `packages/chat/src/movies/sides/AgenticaChatFunctionStackSideMovie.tsx`
- `packages/chat/src/movies/sides/AgenticaChatTokenUsageSideMovie.tsx`
- `packages/chat/src/components/MarkdownViewer.tsx`
- `packages/chat/src/examples/**/*`
- `packages/chat/vite.config.ts`
- `packages/chat/rollup.config.cjs`

## Package Surface

`@agentica/chat`는 `src/index.ts`에서 `AgenticaChatApplication`만 export한다. `AgenticaChatApplication`은 `AgenticaChatMovie`에 props를 그대로 넘긴다.

```typescript
interface IProps {
  agent: Agentica | MicroAgentica;
  title?: string;
}
```

즉 chat package는 core runtime을 소유하지 않는다. 이미 만들어진 `Agentica` 또는 `MicroAgentica` instance를 받아 event/history를 렌더링하는 adapter다.

## Event Subscription

`AgenticaChatMovie`는 초기 history와 token usage를 agent에서 읽고, event listener로 UI state를 보강한다.

Agentica 경로:

- `select`
- `assistantMessage`
- `userMessage`
- `describe`
- `validate`
- `jsonParseError`

MicroAgentica 경로:

- `assistantMessage`
- `userMessage`
- `describe`
- `validate`
- `jsonParseError`

차이:

- `MicroAgentica`에는 `select` listener를 붙이지 않는다.
- `initialize`, `call`, `cancel`, `execute`, `request`, `response` event는 chat UI에 직접 연결되지 않는다.
- `validate`, `jsonParseError`는 `console.error`만 하고 사용자 화면에 렌더링하지 않는다.
- `assistantMessage`와 `describe`는 `await event.join()` 후 최종 history만 append한다. 코드 주석상 streaming renderer가 아직 구현되지 않았으므로 현재 chat은 final-only UI다.

## Conversate Flow

`conversate()`는 다음 순서다.

1. input text를 빈 문자열로 지운다.
2. `enabled`를 false로 바꿔 send를 막는다.
3. `agent.conversate(text)`를 await한다.
4. 완료 후 `agent.getHistories()`로 history state를 다시 맞춘다.
5. `agent.getTokenUsage()`로 token usage side panel을 갱신한다.
6. history에서 `select`를 모으고 `cancel`을 반영해 function stack을 재계산한다.

현재 주의점:

- 에러 catch path에서 `setEnabled(true)` 없이 return한다. 한 번 에러가 나면 UI send button이 계속 disabled될 수 있다.
- event listener로 append한 history와 완료 후 `agent.getHistories()` refresh가 섞인다.
- 완료 refresh에서 기존 `histories` 배열을 `splice/push`로 mutation한 뒤 같은 reference를 `setHistories(histories)`에 넘긴다. 주변 event append가 없으면 React render 갱신을 확실히 보장하기 어렵다.
- empty input guard가 없다.

이들은 지금 바로 코드 수정 대상은 아니지만, compact/runtime event를 추가할 때 chat adapter 안정화가 필요하다는 근거다.

## Message Renderer

`AgenticaChatMessageMovie`는 history type별 renderer를 hard-coded dispatch한다.

| history type | renderer | 현재 동작 |
| --- | --- | --- |
| `assistantMessage` | `AgenticaChatAssistantMessageMovie` | Markdown card |
| `select` | `AgenticaChatSelectMessageMovie` | selected operation과 reason, collapsed description |
| `describe` | `AgenticaChatDescribeMessageMovie` | describe text와 collapsed function call list |
| `cancel` | none | 렌더링하지 않음 |
| `execute` | none | top-level execute는 렌더링하지 않음 |
| `userMessage` | `AgenticaChatUserMessageMovie` | text content만 렌더링 |
| `systemMessage` | `AgenticaChatSystemMessageMovie` | Markdown system card |

새 history discriminant를 추가하면 `prompt satisfies never` 때문에 chat package compile 단계에서 renderer 갱신이 필요하다. compact를 structured history type으로 열 때 chat renderer는 필수 변경 파일이다.

## System Message 노출

`AgenticaChatSystemMessageMovie`는 `systemMessage.text` 전체를 assistant와 비슷한 큰 카드로 보여준다.

따라서 compact marker를 `systemMessage`로 임시 구현할 경우 다음을 지켜야 한다.

- summary 전문을 넣지 않는다.
- selected operation snapshot, result refs, compact metadata를 text에 넣지 않는다.
- 사람이 볼 짧은 marker만 넣는다.
- 상세 metadata는 internal runtime state 또는 future structured history sidecar로 둔다.

## Execute Result 렌더링

`AgenticaChatDescribeMessageMovie`는 describe text 아래에 function call list를 collapse로 제공하고, 각 execute는 `AgenticaChatExecuteMessageMovie`가 렌더링한다.

`AgenticaChatExecuteMessageMovie`는 다음을 모두 Markdown code block으로 출력한다.

- operation description
- `JSON.stringify(execute.arguments, null, 2)`
- `JSON.stringify(execute.value, null, 2)`

즉 큰 HTTP/MCP/class function result가 있으면 UI도 그대로 커진다. 현재 top-level `execute` history는 숨기지만, describe history 안의 `executes`는 사용자가 펼치면 전체 값이 노출된다.

Agentica Next의 result budget/compact 설계는 model-facing context뿐 아니라 chat renderer도 고려해야 한다.

- large result는 `preview`와 `reference`를 분리한다.
- chat execute renderer는 기본 preview만 보여주고 full value는 explicit action 또는 adapter callback으로 열어야 한다.
- compact 후 preserved result refs가 chat에 "빈 JSON"처럼 보이지 않도록 display contract가 필요하다.

## User Content와 Markdown

`AgenticaChatUserMessageMovie`는 `prompt.contents` 중 `type === "text"`만 렌더링하고, 다른 content type은 아직 구현되지 않은 경로로 무시한다. multimodal/file attachment를 public history에 넣어도 현재 chat에서는 보이지 않는다.

`MarkdownViewer`는 `react-markdown`에 `remark-mermaid-plugin`, `rehypeRaw`, `rehypeStringify`를 연결한다. raw HTML이 허용되는 구성이다. assistant/system/describe/select/execute description 모두 MarkdownViewer를 거치므로, runtime marker나 external result preview를 넣을 때 HTML/Markdown 안전성을 별도 검토해야 한다.

## Side Panel

`AgenticaChatSideMovie`는 다음을 표시한다.

- error message
- vendor model
- locale/timezone
- token usage
- function stack

`AgenticaChatTokenUsageSideMovie`는 고정 단가로 price를 계산한다.

- uncached input: `$2.5 / 1M`
- cached input: `$1.25 / 1M`
- output: `$10.0 / 1M`

vendor/model에 따라 실제 단가가 다르므로, context diagnostics나 compact 비용을 여기에 직접 연결하면 오해가 생긴다. Agentica Next에서는 token count와 price estimate를 분리하거나 vendor pricing table을 명시해야 한다.

Function stack은 `select` history에서 active selection을 재구성하고 `cancel` history로 제거한다. compact 후 selected candidate set을 내부 state로 보존하더라도 chat side panel이 이를 자동으로 보여주지는 않는다. public history 또는 adapter state로 별도 projection이 필요하다.

## Claude Code UI 비교 보강

Claude Code `Messages.tsx`와 `REPL.tsx`를 보면 UI는 `messages` 원본을 바로 map하지 않는다. normalize, compact boundary policy, brief/transcript filter, synthetic streaming tool-use injection, reorder, grouping, collapse, lookup build, cap/virtualize 단계를 거친다.

Agentica chat의 현재 구조는 `agent.getHistories()`와 event listener가 만든 history를 그대로 renderer dispatch에 넣는다. 이는 단순할 때는 좋지만 Agentica Next의 compact/result budget/task/remote marker가 들어오면 다음 위험이 생긴다.

- model context에서 제거된 pre-compact history를 transcript UI에 보존할지 정책이 없다.
- large execute result를 render preview와 full reference로 분리할 위치가 없다.
- search text, collapsed text, visible text drift를 검증할 계층이 없다.
- static row와 streaming/dynamic row를 구분하지 않아 long session virtualization을 넣기 어렵다.
- input paste/image/editor state를 history text로 흡수할 유혹이 생긴다.

따라서 chat package는 future phase에서 `AgenticaHistory[] -> AgenticaRenderMessageRow[]` projection helper를 가져야 한다. 이 helper는 core public history type을 대체하지 않고 adapter display contract로만 시작한다.

## Example Apps

### BBS

`BbsChatApplication`은 `MicroAgentica`를 사용한다.

- TypeScript class controller
- `typia.llm.application<BbsArticleService>()`
- in-memory article service

이 example은 `MicroAgentica` 경로의 regression surface다. Agentica Next runtime 확장 후에도 BBS chat은 selector/compact/task command 영향을 받지 않아야 한다.

### Shopping

`ShoppingChatApplication`은 `Agentica`를 사용한다.

- GitHub raw Swagger document fetch
- `OpenApiConverter.upgradeDocument`
- `HttpLlm.application`
- shopping backend authentication
- browser-side OpenAI client with `dangerouslyAllowBrowser: true`

이 example은 OpenAPI/HTTP controller와 real backend integration surface다. compact/result budget 변경 시 large shopping API responses와 describe execute renderer 영향이 직접 드러난다.

### Uploader

`AgenticaChatUploaderApplication`은 uploaded JSON/YAML Swagger/OpenAPI document로 `Agentica`를 만든다.

- YAML/JSON parse
- `OpenApiConverter.upgradeDocument`를 lenient하게 사용
- strict `typia.validate()`는 의도적으로 쓰지 않음
- user-provided host/headers를 `IHttpConnection`에 연결
- `config.eliticism = false`

이 example은 임의 OpenAPI document와 header JSON을 받는 public playground surface다. operation selector, local RAG, result budget이 가장 다양한 schema를 만나게 되는 경로다.

## Agentica Next 적용 결론

1. chat package는 runtime owner가 아니라 adapter다.
2. 새 compact/task/remote event를 바로 chat에 흘리지 말고 짧은 marker 또는 opt-in renderer부터 둔다.
3. structured compact history를 추가하면 `AgenticaChatMessageMovie`와 관련 renderer를 반드시 갱신해야 한다.
4. `systemMessage`는 이미 크게 노출되므로 compact summary 전문을 담으면 안 된다.
5. execute result UI는 full JSON 출력이라 result budget과 display reference 설계가 필요하다.
6. chat은 현재 final-only다. streaming/progress event 추가는 별도 설계 없이 끼워 넣으면 UX와 RPC surface가 어긋난다.
7. BBS example은 `MicroAgentica` 비변경 회귀 확인에 사용한다.
8. Shopping/Uploader example은 Agentica OpenAPI/HTTP controller, large result, arbitrary schema regression 확인에 사용한다.
9. Claude Code식 message pipeline을 참고해 model context projection과 render projection을 분리한다.
