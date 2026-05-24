# Local Selector 구현 현황

## 구현 파일

- `packages/core/src/selector/AgenticaOperationIndex.ts`
- `packages/core/src/selector/index.ts`
- `packages/core/src/structures/IAgenticaSelectorConfig.ts`
- `packages/core/src/orchestrate/select.ts`
- `packages/core/src/selector/AgenticaOperationIndex.spec.ts`

## Public surface

`@agentica/core`는 이제 `selector` namespace를 export한다.

`IAgenticaConfig.selector`:

```typescript
interface IAgenticaSelectorConfig {
  type?: "llm" | "standard" | "local" | "hybrid" | "auto";
  topK?: number;
  minScore?: number;
  fallback?: "llm" | "none";
  autoThresholdCharacters?: number;
}
```

기본값은 기존 동작과 같은 `llm`이다. 따라서 설정하지 않으면 기존 LLM selector, `capacity`, `eliticism` 경로가 유지된다.

## 동작

- `local`: local index top-K를 바로 `AgenticaOperationSelection`으로 stack에 넣는다. 이후 `call` agent가 top-K full schema만 보고 실제 tool call 여부와 arguments를 판단한다.
- `hybrid`: local index top-K를 후보 catalog로 만들고 기존 LLM selector가 그 안에서 다시 고른다.
- `auto`: full operation schema 문자 수 추정치가 `autoThresholdCharacters` 이상이면 `hybrid`, 미만이면 기존 LLM selector를 쓴다.
- `standard`: 현재 `llm`과 같은 alias다.
- `fallback`: local search 결과가 없을 때 기본값은 `llm` fallback이다. `none`이면 selector가 조용히 종료한다.

## Index field

각 operation에서 아래 field를 색인한다.

- operation key/name
- controller name
- original function name
- function description
- parameter property name과 description
- schema key/title/description/enum/const/example literal
- HTTP method/path/tags
- protocol
- optional `searchHint`

`searchHint`는 `operation.metadata`, `operation["x-agentica"]`, `function.metadata`, `function["x-agentica"]`, `function.searchHint`, `function["x-agentica-search-hint"]`에서 읽는다.

## Scoring

1차 scoring은 dependency-free lexical scoring이다.

- exact operation/function name match는 최상위로 보정한다.
- `select:<key>`는 direct selection으로 LLM selector를 건너뛴다.
- `+required` term은 모든 candidate에 대한 pre-filter다.
- field별 가중치는 name/function/http/searchHint를 높게, schema literal을 낮게 둔다.
- camelCase, snake_case, kebab/path segment, Unicode letter/number를 tokenizer에서 처리한다.

## 검증

현재 deterministic test:

- tokenizer split
- exact name ranking
- comma-separated direct select
- required term filtering
- searchHint 가중치
- HTTP method/path/tag match
- parameter description match
- registry version 변화
- `local` selector가 LLM request 없이 stack을 채우는지

실행한 명령:

```bash
pnpm --filter @agentica/core exec vitest run src/selector/AgenticaOperationIndex.spec.ts
pnpm --filter @agentica/core exec tsc --noEmit
pnpm --filter @agentica/core test -- --run
pnpm --filter @agentica/core lint
```

`lint`는 exit 0이며, 기존 `functional/*` JSDoc warning 20개가 남아 있다.

## 남은 일

- `AgenticaSelectBenchmark`에 plain/local/hybrid 비교 runner를 추가한다.
- `auto` threshold는 문자 heuristic이므로 provider/model context window 기반 추정으로 바꿀 수 있다.
- selected/discovered operation state를 compact/resume boundary에 저장하는 작업은 아직 시작하지 않았다.
- hidden/deferred projection policy는 index entry에 타입만 반영했고, full context projector 도입 전까지는 `hidden` 제외 외의 세밀한 projection은 후속 작업이다.
