# Agentica 패키지 인벤토리

## `@agentica/core`

핵심 runtime 패키지다.

주요 파일:

- `src/Agentica.ts`: full Agentica facade. selector stack과 histories, event listener, semaphore, executor를 소유한다.
- `src/MicroAgentica.ts`: 경량 facade. 이 작업의 변경 대상이 아니다.
- `src/orchestrate/*`: initialize/select/cancel/call/describe/execute 기본 workflow.
- `src/selector/*`: dependency-free local operation index와 selector search result 타입.
- `src/context/*`: operation collection, context, token usage.
- `src/factory/*`: event/history/operation 생성과 OpenAI message decode.
- `src/functional/*`: HTTP/MCP controller 검증과 LLM application 생성.
- `src/structures/*`: public config/props/vendor/controller 타입.
- `src/utils/request.ts`: OpenAI chat completion request wrapper와 usage aggregation.

강화 작업의 중심이다. 2026-05-24 기준 `IAgenticaConfig.selector`가 추가되어 기본값은 기존 LLM selector를 유지하고, opt-in으로 `local`/`hybrid`/`auto` selector를 사용할 수 있다. 세부 구현은 [Local Selector 구현 현황](./local-selector-implementation.md)에 정리했다.

## `@agentica/vector-selector`

현재 selector 확장 패키지다.

구조:

- `src/index.ts`: boot function과 strategy interface.
- `src/extract_query.ts`: LLM으로 search query를 추출한다.
- `src/select.ts`: 검색된 tool list를 다시 LLM selector로 확정한다.
- `src/strategy/sqlite.strategy.ts`: sqlite-vec + Cohere embedding 기반 검색.
- `src/strategy/postgres.strategy.ts`: connector-hive API retrieval 기반 검색.

문제:

- core 기본 path로 쓰기에는 DBMS/embedding/provider 의존성이 무겁다.
- query 추출도 LLM 호출이므로 비용이 있다.
- local lexical index와 strategy interface 재정렬이 필요하다.

## `@agentica/benchmark`

selector/call 품질 측정 도구다.

- `AgenticaSelectBenchmark`: selector만 실행해 expected operations와 비교한다.
- `AgenticaCallBenchmark`: agent clone으로 전체 conversate를 반복 실행한다.
- `MicroAgenticaCallBenchmark`: MicroAgentica 경로 검증.

Agentica Next에서는 local/hybrid selector 품질 회귀 측정에 재사용해야 한다. 세부 구조는 [Agentica Benchmark/Test 현재 구조](./benchmark-test-current.md)에 정리했다.

## `@agentica/rpc`

Agentica/MicroAgentica를 RPC service로 노출한다.

- `AgenticaRpcService`는 agent event를 listener JSON event로 전달한다.
- `call` event에서 client listener가 arguments를 수정할 수 있다.
- 새 event/history type을 추가하면 RPC listener/service 인터페이스도 영향받는다.

## `@agentica/chat`

React/MUI chat UI다.

- `AgenticaChatMovie`가 Agentica/MicroAgentica event를 구독한다.
- Agentica인 경우 select event를 function stack side view에 반영한다.
- assistant/describe는 `join()` 후 최종 history만 append하므로 현재 UI는 final-only다.
- `systemMessage`는 큰 System card로 그대로 노출된다.
- `describe.executes`는 arguments/value 전체 JSON을 접힘 영역에 출력한다.
- BBS example은 MicroAgentica, Shopping/Uploader examples는 Agentica OpenAPI/HTTP controller regression surface다.

세부 구조는 [Agentica Chat Renderer 현재 구조](./chat-renderer-current.md)에 정리했다. compact/runtime event를 추가하면 UI에 표시할지, marker만 남길지, structured renderer를 둘지 별도로 결정해야 한다.

## `agentica` CLI와 `create-agentica`

starter project wizard다.

- `packages/cli/src/commands/start.ts`가 template, package manager, connectors, env, OpenAI key, port를 묻는다.
- connectors list는 `wrtnlabs/connectors` raw JSON을 fetch한다.
- `create-agentica`는 CLI alias package다.
- templates는 `wrtnlabs/agentica.template.${template}` GitHub repository에서 내려받고 `.github`을 제거한다.
- connector codegen은 `/// INSERT IMPORT HERE`, `/// INSERT CONTROLLER HERE` placeholder와 regex replacement에 의존한다.
- `.env`는 단순 append 방식이며 escaping/duplicate key 처리는 없다.

Agentica Next config가 안정화되면 template에 노출할 수 있다.
세부 구조는 [Agentica CLI/Create Scaffold 현재 구조](./cli-scaffold-current.md)에 정리했다.

## `test`

`@nestia/e2e`의 `DynamicExecutor`로 `test_` prefix 함수를 실행한다.

- `test/src/index.ts`: include/exclude CLI filter를 받아 features를 실행한다.
- `TestGlobal.ts`: env parsing과 root path.
- LLM API key가 필요한 테스트가 있다.

Agentica Next는 unit test와 e2e test를 분리해야 한다. local operation index 같은 deterministic 기능은 `packages/core` vitest로 먼저 검증한다.

현재 test runner와 feature test matrix는 [Agentica Benchmark/Test 현재 구조](./benchmark-test-current.md)를 기준으로 본다.
수동 CLI/examples/internal fixture는 [Agentica Test CLI/Examples 현재 구조](./test-cli-examples-current.md)에 분리했다.

## `@agentica/website`, `articles`, `docs`

사용자-facing 문서와 배포 표면이다.

- `website`는 Next/Nextra static export 사이트이며 `basePath`는 `/agentica`다.
- website build는 TypeDoc API 생성과 `packages/chat` playground static build에 의존한다.
- TypeDoc build 대상은 현재 `benchmark`, `core`, `rpc`뿐이다.
- setup/core/event/history/websocket docs 일부는 current source와 다른 과거 `text` event/history 표현을 사용한다.
- CLI docs는 current `agentica start` prompt/options/templates와 어긋난다.
- vector selector docs는 current `@agentica/vector-selector`와 과거 `@agentica/pg-vector-selector` reference가 섞여 있다.
- 루트 `articles`는 function-calling-first, OpenAPI/compiler/validation feedback, selector/caller/describer positioning 원고다.
- `website/public/articles`는 Dev.to redirect wrapper다.

세부 구조와 Agentica Next 문서 영향은 [Agentica Website/Docs/Articles 현재 구조](./website-docs-current.md)에 정리했다.
