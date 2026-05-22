# Agentica 소스 인벤토리

## 전체 범위

현재 workspace 범위는 다음과 같다.

- `packages/*`
- `benchmark/*`
- `test`
- `website`

추가 문서/자료 영역:

- `README.md`
- `articles`
- `assets`
- `docs`
- `deploy`

## 패키지 목록

| 경로 | 패키지명 | 역할 |
| --- | --- | --- |
| `packages/core` | `@agentica/core` | Agentica/MicroAgentica facade, function calling orchestration, histories/events, controller validation |
| `packages/vector-selector` | `@agentica/vector-selector` | LLM query extraction + external vector retrieval 기반 selector extension |
| `packages/benchmark` | `@agentica/benchmark` | Agentica selector/call benchmark runner와 markdown reporter |
| `packages/rpc` | `@agentica/rpc` | WebSocket/RPC service/listener wrapper |
| `packages/chat` | `@agentica/chat` | React/MUI 기반 chat UI component와 playground examples |
| `packages/cli` | `agentica` | starter template wizard CLI |
| `packages/create-agentica` | `create-agentica` | `agentica` CLI alias package |
| `benchmark/vector-selector-benchmark` | `vector-selector-benchmark` | vector selector 성능/정확도 실험 workspace |
| `test` | `@agentica/test` | e2e/integration style dynamic test runner |
| `website` | `@agentica/website` | Next/Nextra documentation website |

## 강화 작업 영향도

| 영역 | 영향도 | 이유 |
| --- | --- | --- |
| `packages/core` | 매우 높음 | Agentica runtime, selector, history, event 계약이 위치 |
| `packages/vector-selector` | 높음 | local selector 도입 시 역할 재정의 필요 |
| `packages/benchmark` | 높음 | selector/call 품질 회귀 측정에 사용 가능 |
| `test` | 높음 | DynamicExecutor feature tests, benchmark e2e, RPC tests, manual CLI/examples/internal fixtures가 runtime 변경 검증의 authoritative/manual gate |
| `packages/rpc` | 중간 | 새 event/history type 추가 시 JSON/RPC listener 영향 |
| `packages/chat` | 중간 | React/MUI adapter. final-only event rendering, systemMessage compact marker, full execute JSON display, playground examples에 영향 |
| `packages/cli` | 중간 | starter template wizard. Agentica Next config, connector codegen, env/template/RPC chat scaffold 노출 경로 |
| `website` | 중간 | Next/Nextra docs, TypeDoc API build, chat playground static build, public article redirects. Agentica Next public contract와 stale snippet 정리 대상 |
| `articles`, `docs` | 낮음에서 중간 | 외부 게시 원고와 이미지 자료. function-calling-first positioning을 깨지 않도록 변경 설명과 맞춰야 함 |

## 주의할 점

- `packages/core/lib`는 빌드 산출물이다. 설계/구현 기준은 `packages/core/src`다.
- 여러 README가 루트/core README 복제본에 가깝다. 패키지별 실제 역할은 `package.json`과 `src`를 기준으로 판단한다.
- `test/.env`가 존재하지만 민감값을 문서에 복사하지 않는다.
