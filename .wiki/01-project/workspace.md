# 워크스페이스 구조

## 패키지 매니저와 런타임

- 패키지 매니저: `pnpm@10.6.4`
- Node.js: `22.15.0`
- 루트 `package.json`은 `pnpm >= 10`을 요구한다.
- `pnpm-workspace.yaml`은 `engineStrict: true`를 사용한다.

## 워크스페이스 범위

- `packages/*`
- `benchmark/*`
- `test`
- `website`

## 현재 확인된 패키지

- `packages/benchmark`
- `packages/chat`
- `packages/cli`
- `packages/core`
- `packages/create-agentica`
- `packages/rpc`
- `packages/vector-selector`

## 루트 스크립트

- `pnpm build`: 전체 재귀 빌드
- `pnpm build:packages`: `packages/**`만 빌드
- `pnpm lint`: lint 계열 스크립트 집계 실행
- `pnpm format`: format 계열 스크립트 집계 실행
- `pnpm test`: test 계열 스크립트 집계 실행
- `pnpm test:e2e`: `test` workspace의 e2e 시작
- `pnpm sync-readme`: 배포용 README 동기화

