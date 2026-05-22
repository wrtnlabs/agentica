# Agentica Benchmark/Test 현재 구조

## 근거 파일

- `packages/benchmark/src/AgenticaSelectBenchmark.ts`
- `packages/benchmark/src/AgenticaCallBenchmark.ts`
- `packages/benchmark/src/MicroAgenticaCallBenchmark.ts`
- `packages/benchmark/src/internal/AgenticaBenchmarkPredicator.ts`
- `packages/benchmark/src/internal/AgenticaBenchmarkUtil.ts`
- `packages/benchmark/src/internal/AgenticaSelectBenchmarkReporter.ts`
- `packages/benchmark/src/internal/AgenticaCallBenchmarkReporter.ts`
- `packages/benchmark/src/internal/AgenticaPromptReporter.ts`
- `packages/benchmark/src/structures/*`
- `benchmark/vector-selector-benchmark/src/*`
- `test/src/index.ts`
- `test/src/TestGlobal.ts`
- `test/src/features/*`
- `test/src/features/rpc/*`
- `test/src/features/bugs/*`
- `test/src/cli/*`
- `test/src/examples/*`
- `test/src/internal/*`
- `test/src/utils/ConsoleScanner.ts`

## `@agentica/benchmark`

`@agentica/benchmark`는 LLM function calling 품질을 반복 실험으로 측정하는 패키지다.

### AgenticaSelectBenchmark

`AgenticaSelectBenchmark`는 selector만 따로 실행한다.

핵심 흐름:

1. constructor에서 agent, scenarios, repeat/simultaneous config를 받는다.
2. agent의 현재 histories를 snapshot으로 저장한다.
3. scenario마다 repeat 수만큼 `step()`을 병렬 실행한다.
4. `step()`은 `agent.getContext()`로 임시 context를 만들고, `orchestrate.select` 또는 custom `context.config.executor.select`만 호출한다.
5. dispatch wrapper가 `toHistory()` 가능한 event만 모은다.
6. 생성된 `select` histories의 operation을 expected와 비교한다.
7. success/failure/error event와 token usage를 aggregate한다.

중요한 제약:

- custom executor가 함수형이면 `select function is not found` 에러를 낸다.
- full `conversate()`를 돌리지 않으므로 call/execute/describe 안정성은 보지 않는다.
- Agentica Next local/hybrid selector 품질을 가장 싸게 비교할 수 있는 기존 게이트다.

### AgenticaCallBenchmark

`AgenticaCallBenchmark`는 실제 `Agentica.conversate()`를 agent clone에서 반복 실행한다.

핵심 흐름:

1. scenario마다 agent를 clone한다.
2. `agent.conversate(scenario.text)`를 실행한다.
3. `execute` histories의 operation이 expected와 맞으면 success다.
4. 실패하면 `AgenticaBenchmarkPredicator.isNext()`로 마지막 assistant message가 사용자 동의를 요구하는지 LLM으로 판정한다.
5. 동의 reply가 나오면 `agent.conversate(next)`를 최대 `consent` 횟수만큼 추가 실행한다.
6. select 성공 여부는 `select` histories로, call 성공 여부는 `execute` histories로 따로 판정한다.

중요한 제약:

- 실제 backend/API side effect가 발생할 수 있다.
- clone을 쓰므로 각 trial은 독립 agent history로 진행된다.
- full runtime, selector, caller, executor, history commit, token usage를 함께 본다.
- Agentica Next stateful runtime 교체 후 반드시 유지해야 할 e2e 품질 게이트다.

### MicroAgenticaCallBenchmark

`MicroAgenticaCallBenchmark`는 MicroAgentica clone에서 full `conversate()`를 반복 실행한다. 구조는 `AgenticaCallBenchmark`와 거의 같지만 select history가 없으므로 select 판정도 execute operations를 기준으로 한다.

사용자 지시상 `MicroAgentica`는 변경 대상이 아니다. 이 benchmark는 Agentica Next 변경이 MicroAgentica를 깨뜨리지 않았는지 확인하는 regression gate로만 사용한다.

## Expected 판정 모델

`IAgenticaBenchmarkExpected`는 네 가지 조합을 지원한다.

- `standalone`: 특정 operation name이 선택/실행되면 통과
- `array`: 순서가 중요한 expected list
- `anyOf`: 후보 중 하나가 맞으면 통과
- `allOf`: 순서는 중요하지 않고 모두 포함되면 통과

`AgenticaBenchmarkPredicator.success()`는 operation `name`으로 standalone match를 한다. `strict`가 false면 array 내부에서 중간에 불필요한 operation이 있어도 다음 expected를 찾을 수 있다.

설계상 주의:

- operation name 충돌이 있으면 benchmark 판정이 약해질 수 있다.
- Agentica Next local index는 operation reference에 `controller`, `function`, `protocol`, HTTP method/path를 함께 보존해야 한다.
- benchmark expected JSON report는 operation name과 description만 내보낸다.

## Reporter

benchmark report는 markdown file dictionary로 생성된다.

Select report:

- `./README.md`
- `./{scenario}/README.md`
- `./{scenario}/{n}.{success|failure|error}.md`

Call report도 같은 구조이며 event별 prompt histories를 함께 출력한다. `AgenticaPromptReporter`는 user/assistant/system/select/cancel/describe/execute history를 markdown으로 바꾼다.

Agentica Next에 compact marker를 `systemMessage`로 넣으면 call benchmark report에도 나타난다. 따라서 compact marker text는 짧고 안정적이어야 한다.

## vector-selector benchmark

`benchmark/vector-selector-benchmark`는 같은 shopping scenario를 세 agent로 비교한다.

- plain Agentica
- Postgres/connector-hive vector selector
- SQLite/cohere vector selector

`runShoppingBenchmark()`는 100 repeat의 `AgenticaSelectBenchmark`를 실행한다. scenario는 shopping backend의 다음 흐름을 요구한다.

1. sales list 조회
2. Macbook 상세 조회
3. order 또는 direct order 생성
4. order publish

제약:

- `OPENAI_API_KEY`가 필요하다.
- SQLite 전략은 `COHERE_API_KEY`와 in-memory better-sqlite3 DB를 쓴다.
- Postgres 전략은 `CONNECTOR_HIVE_URL` health check가 필요하다.
- shopping swagger와 backend가 외부 네트워크에 의존한다.

이 benchmark는 local selector 품질 비교용으로 좋지만, CI 필수 deterministic gate로 쓰기에는 외부 의존성이 크다.

## test runner

`test/src/index.ts`는 `@nestia/e2e` `DynamicExecutor.validate()`로 `test/src/features` 아래 `test_` prefix 함수를 실행한다.

실행 특성:

- `--include`와 `--exclude` CLI argument로 test name substring filter를 적용한다.
- `extension: "ts"`를 쓴다.
- test 함수가 `false`를 반환하면 skip/pass처럼 처리된다.
- error가 하나라도 있으면 process exit code `-1`이다.

`TestGlobal.ts`는 `.env`를 읽고 typia로 env shape를 검증한다.

주요 env:

- `CHATGPT_API_KEY`
- `CHATGPT_BASE_URL`
- `CHATGPT_OPTIONS`
- `OPENROUTER_API_KEY`

대부분의 LLM e2e test는 API key가 없으면 `false`를 반환한다. 따라서 unit-level deterministic 검증은 별도로 필요하다.

## test CLI/examples/internal

`test/src/cli`와 `test/src/examples`는 `DynamicExecutor` 대상이 아니다. 사람이 직접 실행하는 manual harness와 RPC client example이다. 세부 구조는 [Agentica Test CLI/Examples 현재 구조](./test-cli-examples-current.md)에 분리했다.

핵심 분류:

- `cli/index.ts`: Agentica + shopping backend interactive CLI
- `cli/micro.ts`: MicroAgentica + BBS interactive CLI
- `examples/websearch.ts`: describe disabled MicroAgentica web-search style single function example
- `examples/websocket-client-main.ts`: RPC listener full-ish example
- `examples/websocket-client-hook.ts`: minimal RPC listener example
- `internal/BbsArticleService.ts`: class controller CRUD fixture
- `internal/IBbsArticle.ts`: UUID/date-time/image URI/partial DTO fixture
- `utils/ConsoleScanner.ts`: readline helper

Agentica Next에서는 자동 e2e gate와 manual reproduction harness를 섞지 않는다. CLI/examples는 외부 backend, local server, stdin, API key에 의존하므로 deterministic CI gate가 아니라 compatibility checklist로 둔다.

## 현재 feature test 범위

| 파일 | 검증 범위 |
| --- | --- |
| `test_base_event.ts` | initialize/assistantMessage listener on/off semantics |
| `test_base_work.ts` | no-controller basic conversate result가 userMessage history를 포함하는지 |
| `test_base_work_describe.ts` | class calculator controller select/call/execute, execute value |
| `test_base_mcp_work_describe.ts` | MCP calculator controller 실행과 MCP result shape |
| `test_base_streaming.ts` | request/response streaming event, assistant final history와 stream content 관계 |
| `test_base_streaming_describe.ts` | describe event stream, join, final describe history 일치 |
| `test_call_streaming_base.ts` | describe disabled 상태에서 select + assistantMessage streaming |
| `test_select_streaming_base.ts` | no selection path assistantMessage streaming |
| `test_validate_correction.ts` | call listener가 arguments를 오염시킨 뒤 validate event와 execute recovery가 발생하는지 |
| `test_micro_agentica.ts` | MicroAgentica class controller execute/describe 발생 |
| `rpc/test_rpc_websocket_call.ts` | Agentica RPC event ordering: initialize, assistantMessage, select, call, execute, describe |
| `rpc/test_rpc_micro_call.ts` | MicroAgentica RPC event ordering: assistantMessage, call, execute, describe |
| `rpc/test_rpc_websocket_initialize.ts` | initialize=true config에서 RPC initialize + assistantMessage |
| `bugs/test_bug_openrouter_streaming.ts` | OpenRouter streaming에서 assistant text가 비지 않는지 |
| `test_benchmark_predicator*.ts` | expected matcher의 standalone/array/anyOf/allOf 조합 |
| `test_benchmark_select*.ts` | shopping select benchmark와 optional Postgres vector selector |
| `test_benchmark_call*.ts` | shopping call benchmark와 optional Postgres vector selector |

## Agentica Next에 필요한 보강

현재 test는 LLM e2e 중심이다. Agentica Next에는 다음 deterministic test가 필요하다.

- local operation tokenizer/scorer ranking
- operation reference key uniqueness
- context projector가 tool call/result pair를 깨지 않는지
- large execute result preview/reference projection
- compact boundary 이후 projection
- compact summary prompt가 tool calling을 금지하는지
- reactive prompt-too-long retry transition
- runtime transition state machine
- `systemMessage` compact marker가 chat/report/RPC에 어떤 식으로 나타나는지

LLM e2e는 유지하되, local selector와 compaction의 핵심 invariant는 API key 없이 검증되어야 한다.

## 설계 결론

1. `AgenticaSelectBenchmark`는 local/hybrid selector의 1차 품질 게이트로 재사용한다.
2. `AgenticaCallBenchmark`는 stateful runtime 전체 교체 후 e2e 회귀 게이트로 유지한다.
3. vector-selector benchmark는 비교 실험으로 유지하되 core default gate로 삼지 않는다.
4. MicroAgentica benchmark/test는 비변경 보증용 regression gate로만 둔다.
5. Agentica Next 구현 전 deterministic unit test layer를 추가해야 한다.
6. CLI/examples는 manual compatibility harness로 유지하되, 같은 fixture 의미를 deterministic unit/e2e로 옮길 수 있는 항목은 별도 테스트로 승격한다.
