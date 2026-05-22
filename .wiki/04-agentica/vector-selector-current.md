# Vector Selector 현재 구조

이 문서는 `packages/vector-selector`의 현재 구현을 정리한다. 목표는 DBMS 의존 제거 설계의 근거를 남기는 것이다.

## Public shape

`BootAgenticaVectorSelector({ strategy })`는 `AgenticaContext`를 받는 selector executor를 반환한다.

`IAgenticaVectorSelectorStrategy`:

- `embedContext({ ctx, setEmbedded })`
- `searchTool(ctx, query)`

runtime 흐름:

1. 현재 `ctx.operations.array`가 embed 되었는지 확인한다.
2. 안 되어 있으면 strategy의 `embedContext()`를 호출한다.
3. `extractQuery(ctx)`가 사용자 메시지와 history에서 검색 query를 추출한다.
4. query별로 `searchTool()`을 호출한다.
5. 결과 function name을 `ctx.operations.flat`에서 찾아 HTTP metadata를 보강한다.
6. `selectFunction()`으로 최종 selection을 LLM에게 다시 맡긴다.
7. selection마다 `ctx.stack.push()`와 `select` event dispatch를 수행한다.

## Query extraction

`extractQuery()`는 별도 LLM request를 사용한다.

특징:

- source는 `select`다.
- system prompt는 "function searcher" 역할을 직접 지시한다.
- `Tools.extract_query` function tool을 required로 사용한다.
- output은 `query_list[].query`만 뽑는다.

문제:

- 검색 query extraction도 LLM call이므로 selector 개선이 token/latency를 줄인다는 보장이 없다.
- query schema validation 실패 처리가 약하다. JSON parse 실패와 field type mismatch가 core call feedback 루프만큼 엄격하지 않다.

## selectFunction

`selectFunction()`은 retrieved `toolList`를 tool result로 주입한 뒤 `select_functions`를 강제 호출하게 한다.

장점:

- core selector prompt 흐름과 비슷한 event/history 구조를 유지한다.
- 선택 결과를 `AgenticaOperationSelection`으로 만들기 때문에 core stack과 호환된다.

위험:

- `JSON.parse(tc.function.arguments)` 실패 처리가 없다.
- validation schema가 실제 `function_list` wrapper와 내부 array 형태를 혼동한 흔적이 있다.
- retry count는 selector-local이며 core `config.retry`와 통합되어 있지 않다.
- operation이 `ctx.operations.flat`에 없으면 조용히 무시한다.

## SQLite strategy

`configureSqliteStrategy()`는 `better-sqlite3`, `sqlite-vec`, Cohere embedding에 의존한다.

저장 table:

- `_agentica_vector_selector_embeddings`
- `hash`
- `name`
- `description`
- `vector`

hash는 `JSON.stringify(ctx.operations.array)`의 sha256 base64다. context object별 memoization도 한다.

검색:

- operation description 또는 name을 `search_document`로 embed
- query를 `search_query`로 embed
- `vec_distance_L2` 기준 상위 10개 반환

문제:

- local이라고 하지만 external Cohere API가 필수다.
- SQLite native extension이 필요하다.
- operation stringify가 controller/connection/executor 같은 runtime object 영향을 받을 수 있다.
- model, distance metric, limit이 고정되어 있다.

## Postgres strategy

`configurePostgresStrategy()`는 `@wrtnlabs/connector-hive-api`의 retrieval backend에 의존한다.

흐름:

1. controller group별 application 생성 또는 기존 application 조회
2. version 생성
3. operation을 connector로 등록
4. retrieval request에 application/version filter를 사용

문제:

- 외부 서비스/API가 필수다.
- `filterMap` key가 `JSON.stringify(ctx.operations.array)`라 동일한 stringify 안정성 문제가 있다.
- Agentica core에 넣기에는 ownership과 deployment cost가 크다.

## Agentica Next 결론

`@agentica/vector-selector`의 좋은 부분은 shape다. strategy interface와 core stack/event 호환 방식은 살릴 수 있다.

바꿔야 할 부분:

- core에는 DBMS/API 없는 local operation index를 둔다.
- embedding은 optional plugin strategy로 분리한다.
- default selector는 lexical/hybrid score로 시작한다.
- operation index key는 stringify가 아니라 deterministic operation signature를 쓴다.
- query extraction LLM call은 optional로 낮춘다. 기본값은 user prompt/history에서 lexical query를 직접 구성한다.
- 최종 `selectFunction()` 같은 LLM 재랭킹은 operation 수가 threshold 이상일 때만 사용한다.
