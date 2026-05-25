# Agentica Core Utils/Request/Streaming 구조

이 문서는 `packages/core/src/utils/*`, `context/AgenticaTokenUsage.ts`, `utils/request.ts`를 기준으로 Agentica의 LLM request 보조 계층을 정리한다.

## Request wrapper

`getChatCompletionFunction()`은 `AgenticaContext.request()`의 실제 구현을 만든다.

입력:

- `vendor`: OpenAI-compatible client, model, request options, optional semaphore는 `Agentica.getContext()`에서 감싼다.
- `config`: stream/backoffStrategy 등
- `dispatch`: request/response event 발행
- `abortSignal`
- `usage`: token usage accumulator

흐름:

1. config 기준으로 stream 여부를 결정한다. 기본은 stream true이며 `stream_options.include_usage = true`를 붙인다.
2. `createRequestEvent()`로 request event를 만들고 dispatch한다.
3. vendor API를 호출한다.
4. 실패 시 `config.backoffStrategy`를 호출하고 대기 후 재시도한다. 기본 strategy는 바로 throw다.
5. non-stream 응답이면 usage를 집계하고 response event를 dispatch한 뒤 `{ type: "none-stream" }`을 반환한다.
6. stream 응답이면 readable stream을 transform/tee 해서 event용, usage aggregation용, caller 반환용으로 나눈다.

중요:

- request/response event는 LLM API observability의 핵심이다.
- 새 phase를 추가하려면 `AgenticaEventSource`와 token usage source가 맞아야 한다.
- streaming response는 event listener가 `join()`으로 최종 completion을 얻을 수 있게 설계되어 있다.

## Streaming merge

`ChatGptCompletionStreamingUtil.reduceStreamingWithDispatch()`는 streaming chunk를 읽으면서 assistant text stream event를 dispatch하고 최종 `ChatCompletion`으로 merge한다.

구조:

- choice index별 `streamContext`를 둔다.
- content delta가 처음 나오면 `MPSC<string>`를 만들고 eventProcessor를 호출한다.
- 이후 delta는 같은 MPSC에 produce한다.
- finish_reason이 오면 해당 MPSC를 close한다.
- 최종 completion은 `ChatGptCompletionMessageUtil`로 merge한다.

주의점:

- streaming 중간에는 empty tool arguments fixup을 하지 않는다. mid-stream에 `"{}"`를 넣으면 뒤 chunk와 붙어 `{}{...}`가 될 수 있기 때문이다.
- final completion에서만 `fixEmptyToolArguments()`를 적용한다.

## Completion merge

`ChatGptCompletionMessageUtil` 역할:

- raw stream bytes/string을 `ChatCompletionChunk`로 parse
- chunk를 `ChatCompletion` 형태로 accumulate
- tool call id/name/arguments chunk를 index 기준으로 merge
- reasoning 계열 payload를 보존
- usage가 여러 chunk에 있으면 `ChatGptTokenUsageAggregator.sum()`으로 합산

Agentica는 provider-agnostic처럼 보이지만 내부 completion shape는 OpenAI-compatible streaming chunk에 강하게 맞춰져 있다. Claude/Gemini/OpenRouter도 OpenAI-compatible endpoint를 통과해야 안정적이다.

## Assistant reasoning payload

`ChatGptAssistantMessageUtil`은 assistant message에서 key가 `reasoning`으로 시작하는 payload를 collect/assign한다.

이 payload는 select/call/cancel event history의 `assistant` 필드로 보존된다. Selector나 call repair가 reasoning-supporting provider에서 더 풍부한 trace를 남길 수 있는 통로다.

## Token usage

`AgenticaTokenUsage`는 다음 component를 가진다.

- `aggregate`
- `initialize`
- `select`
- `cancel`
- `call`
- `describe`

`AgenticaTokenUsageAggregator.aggregate()`는 OpenAI `CompletionUsage`를 source별 component에 더하고 aggregate를 다시 계산한다.

세부 집계:

- input total
- input cached
- output total
- output reasoning
- output accepted prediction
- output rejected prediction

확장 이슈:

- compact/policy/local-rag/sub-agent phase를 새 request source로 추가하면 token usage JSON도 확장해야 한다.
- public `IAgenticaTokenUsageJson`가 source list를 고정하고 있으므로 source 추가는 breaking 가능성이 있다.
- 초기에는 새 phase가 기존 source를 재사용하거나 internal metric으로 따로 보관하는 쪽이 안전하다.

## Stream primitive

`StreamUtil`:

- `readAll`
- `reduce`
- `from`
- `transform`
- `toAsyncGenerator`
- `streamDefaultReaderToAsyncGenerator`

`AsyncQueue`와 `MPSC`:

- `AsyncQueue`는 producer가 enqueue하고 consumer가 async dequeue하는 단순 queue다.
- close/waitClosed/waitUntilEmpty를 지원한다.
- `MPSC`는 AsyncQueue를 ReadableStream consumer로 노출한다.

이 구조는 streaming assistant/describe event를 runtime event로 흘리기 위한 최소 primitive다. 새 runtime phase도 장기 출력이 있으면 같은 primitive를 재사용할 수 있다.

## Retry와 empty assistant

`__get_retry(limit)`는 이전 error를 다음 attempt에 넘길 수 있는 재귀 retry helper다.

`AssistantMessageEmptyError`와 `AssistantMessageEmptyWithReasoningError`는 select/call에서 empty assistant message를 다룰 때 사용된다. reasoning만 있는 empty response는 다음 request에 assistant reasoning을 넣어 재시도한다.

## Agentica Next 적용 메모

1. 새 phase가 LLM request를 만들면 반드시 request/response event와 usage 집계를 고려한다.
2. public token usage schema를 바로 확장하지 말고 internal `runtimeUsage`를 먼저 둔다.
3. stream completion merge는 섬세하므로 provider adapter 도입 시 regression test가 필요하다.
4. compact/policy phase는 `AgenticaEventSource` 확장 대신 wrapper source로 시작하는 것이 안전하다.
5. `backoffStrategy`는 vendor call 전체에 적용되며, validation retry와는 별도다. 두 retry 계층을 문서에서 구분해야 한다.
