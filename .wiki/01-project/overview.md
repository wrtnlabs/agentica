# 프로젝트 개요

## 정체성

Agentica는 LLM Function Calling에 특화된 Agentic AI 프레임워크다. TypeScript 클래스, Swagger/OpenAPI 문서, MCP 서버에서 함수 목록을 가져와 AI 에이전트가 호출할 수 있는 도구로 구성하는 것을 핵심 흐름으로 삼는다.

## 핵심 가치

- 컴파일러 기반 개발: TypeScript 타입과 컴파일러 정보를 활용해 function-calling schema 작성을 자동화한다.
- JSON Schema 변환: OpenAI, Google, Anthropic 등 LLM vendor별 schema 차이를 흡수한다.
- 검증 피드백: AI가 구성한 인자의 오류를 탐지하고 재시도를 유도한다.
- Selector Agent: 후보 함수를 필터링해 컨텍스트 사용량과 비용을 줄인다.

## 공개 패키지 관점

루트 패키지는 `@agentica/station`이며 private workspace다. 실제 배포/개발 단위는 `packages/*`, `benchmark/*`, `test`, `website` 워크스페이스 아래에 있다.

## 주요 외부 진입점

- 공식 사이트: `https://wrtnlabs.io/agentica`
- 문서: `https://wrtnlabs.io/agentica/docs`
- Playground: `https://wrtnlabs.io/agentica/playground`
- GitHub: `https://github.com/wrtnlabs/agentica`

