# Context Projection 구현 현황

## 구현 파일

- `packages/core/src/structures/IAgenticaContextConfig.ts`
- `packages/core/src/structures/IAgenticaConfig.ts`
- `packages/core/src/factory/histories.ts`
- `packages/core/src/factory/histories.spec.ts`
- `packages/core/src/orchestrate/initialize.ts`
- `packages/core/src/orchestrate/select.ts`
- `packages/core/src/orchestrate/cancel.ts`
- `packages/core/src/orchestrate/call.ts`
- `packages/core/src/orchestrate/describe.ts`

## Public surface

`IAgenticaConfig.context`를 추가했다.

```typescript
interface IAgenticaContextConfig {
  resultBudget?: IAgenticaResultBudgetConfig;
}

interface IAgenticaResultBudgetConfig {
  maxResultCharacters?: number;
  preserveRecentResults?: number;
}
```

기본값은 미설정이다. 설정하지 않으면 기존처럼 execute result를 full value로 model-facing tool message에 넣는다.

## 동작

- `decodeHistory()`는 기존 단일 history decode 경로를 유지하되 optional `resultBudget`을 받을 수 있게 했다.
- `decodeHistories()`는 여러 history를 한 번에 projection하면서 `preserveRecentResults`를 적용한다.
- `Agentica`의 initialize/select/cancel/call/describe request는 `config.context.resultBudget`을 반영해 history를 projection한다.
- `MicroAgentica` 경로는 기존 `decodeHistory()` direct path를 유지한다.
- public history와 `toJSON()` 결과는 바꾸지 않는다.

큰 execute result는 다음 shape로 model-facing context에만 축약된다.

```typescript
{
  "__agentica_result__": "truncated",
  "reference": "execute:{historyId}:value",
  "operation": "{operationName}",
  "originalCharacters": 12345,
  "preview": "{serialized-prefix}"
}
```

HTTP operation의 response body는 `execute:{historyId}:data`, class/MCP style value는 `execute:{historyId}:value` reference를 쓴다.

## 검증

추가한 deterministic test:

- 기본 설정에서는 execute result value가 그대로 projection되는지
- `maxResultCharacters` 초과 시 preview/reference로 projection되는지
- 축약 projection이 원본 tail을 model-facing content에 누출하지 않는지
- `preserveRecentResults`가 가장 최근 execute result를 full inline으로 보존하는지
- assistant reasoning payload 보존 회귀

실행한 명령:

```bash
pnpm --filter @agentica/core exec vitest run src/factory/histories.spec.ts
pnpm --filter @agentica/core exec tsc --noEmit
pnpm --filter @agentica/core test -- --run
pnpm --filter @agentica/core lint
pnpm --filter @agentica/core build
```

`lint`는 exit 0이며, 기존 `functional/*` JSDoc warning 20개가 남아 있다.
`build`는 exit 0이며, 기존 external dependency rollup warning이 출력된다.

## 남은 일

- 실제 persistence가 있는 `AgenticaResultStore`는 아직 없다. 현재 reference는 model-facing stable marker다.
- line/page/item/jsonPath/byte 기반 segmented read는 아직 시작하지 않았다.
- digest/version 기반 unchanged stub은 아직 없다.
- prompt-too-long reactive compact와 compact restore attachment는 후속 phase다.
- chat renderer는 아직 large result preview/reference UI를 별도로 갖지 않는다.
