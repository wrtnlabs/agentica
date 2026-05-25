# 전수정독 총괄 리뷰

## 범위

이 문서는 세 가지를 서로 대조한 최종 리뷰다.

- Claude Code snapshot: `/home/samchon/github/samchon/claude-code`
- Agentica 현재 저장소: `/home/samchon/github/wrtnlabs/agentica`
- 이 위키의 설계 문서: `.wiki`
- 2026-05-24 후속 구현: `packages/core/src/selector/*`, `IAgenticaConfig.selector`, `orchestrate/select.ts`

2026-05-22 최초 리뷰의 조치 범위는 `.wiki` 개정뿐이었다. 2026-05-24 후속 작업에서는 사용자의 구현 지시에 따라 Agentica source package 변경을 시작했다. `MicroAgentica` 구현은 여전히 변경하지 않는다.

## 최종 결론

현재 위키의 큰 방향은 Claude Code와 Agentica 소스 양쪽에 의해 대체로 지지된다.

1. Agentica의 강점은 function-calling-first facade, typia 기반 검증, `call.ts`의 validation feedback loop다.
2. Agentica의 약점은 모델 컨텍스트를 history 전체에 거의 직접 의존하고, operation schema/result budget/progressive content read/compact state를 별도 runtime으로 관리하지 않는 점이다.
3. Claude Code에서 배울 핵심은 거대한 workflow graph가 아니라 stateful query loop, context projection, deferred tool schema loading, progressive read/result materialization, compact/recovery, task/control-plane 분리다.
4. `MicroAgentica`는 현재처럼 간단한 all-tools call path로 남겨야 한다. 무거운 selector, compact, task runtime은 `Agentica` 전용 opt-in 계층으로 둔다.
5. `@agentica/vector-selector`의 DBMS/embedding 의존 방식은 core 기본 경로가 될 수 없다. core에는 lexical/local operation index를 1차 발판으로 두고, vector selector는 선택형 backend로 격리한다.

## 세 축 대조표

| 축 | Claude Code에서 확인한 구조 | Agentica 현재 구조 | 위키 설계 판단 | 리뷰 결론 |
| --- | --- | --- | --- | --- |
| Runtime loop | `query.ts`가 context prep, compaction, tool execution, recovery, stop hook, continuation을 한 루프에서 관리 | `execute.ts`가 initialize/cancel/select/call/describe를 순차 실행 | `AgenticaRuntime`과 phase transition을 `Agentica` 내부에 도입 | 타당하다. 기존 executor 대체는 가능하되 public facade는 단계적으로 보존해야 한다. |
| Tool discovery | `ToolSearchTool`이 lexical search, direct `select:`, deferred schema loading, discovered tool state를 사용 | selector가 LLM prompt와 capacity에 의존하고, vector selector는 DBMS/embedding 의존 | DB 없는 local operation index와 optional vector backend | 2026-05-24에 1차 구현을 완료했다. 이제 이 index를 context projector와 compact restore state에 연결해야 한다. |
| Context projection | compact, microcompact, tool result budget, context collapse, attachment drain이 별도 계층 | `decodeHistory()`와 history projection이 full schema/value 노출에 가깝다 | `AgenticaContextProjector`, result reference, compact restore state | 필수다. history 저장과 model 입력을 분리해야 한다. |
| Progressive content read | `FileRead` line/page/range, `Grep`/`Glob` cap과 pagination, LSP semantic query가 큰 자료를 slice로 읽음 | class/http/mcp result는 대체로 한 번에 history/model context로 들어간다 | `AgenticaSegmentedContentReader`, line/page/item/jsonPath/byte range, digest/version unchanged stub | selector 다음 최우선 축이다. Agentica core는 파일 시스템이 아니라 controller result 전반에 이 패턴을 일반화해야 한다. |
| Read-state/freshness | `readFileState`, mtime/content check, edit-before-read prevention이 call 직전 precondition으로 작동 | function schema validation은 race/freshness를 보장하지 못한다 | digest/version guard, `requiresFreshRead`, operation precondition state | destructive/write operation의 안전성에 필요하다. selector나 prompt가 아니라 call 직전 gate에서 막아야 한다. |
| Result materialization | 큰 output은 preview/reference/output store/cursor로 나누고 task output은 offset/tail read를 쓴다 | execute result와 chat renderer가 raw JSON 전체에 가까운 값을 다룬다 | `AgenticaResultStore`, `AgenticaResultReference`, render projection | compact보다 먼저 필요하다. 큰 result를 먼저 reference화하지 않으면 compact request 자체가 커진다. |
| Context diagnostics | `/context`가 raw transcript가 아니라 API-view, deferred tools, compact state를 기준으로 계산 | history 총량과 실제 model request 비용이 달라질 수 있다 | projected request 기준 token/category breakdown | 운영 진단과 문서 예제는 raw history가 아니라 실제 projection 기준이어야 한다. |
| Tool call 검증 | tool execution이 permission, schema, synthetic result, pairing을 관리 | `call.ts`가 typia parse/validate 오류를 feedback으로 돌려준다 | `call.ts`의 검증 루프는 유지하고 runtime wrapper만 얹는다 | 반드시 유지한다. 이 부분은 Agentica의 차별점이다. |
| Public surface | UI, bridge, SDK, remote control이 runtime state를 그대로 노출하지 않고 adapter에서 투영 | event/history/RPC/chat이 현재 계약으로 굳어져 있다 | internal runtime state를 먼저 만들고 public event 확장은 후순위 | 타당하다. public union 확장은 호환성 비용이 크다. |
| Task/remote/control | task output, mailbox, permission, bridge, worker state가 core transcript와 분리 | core에는 background task/control-plane 개념이 없다 | task/runtime/remote는 후순위 internal capability로 설계 | 방향은 맞지만 blast radius가 크므로 phase 5 이후가 맞다. |
| UI adapter | Ink renderer는 model context와 render projection을 분리하고 large result를 접는다 | `@agentica/chat`은 final history와 raw JSON display에 가깝다 | render projection state를 adapter-local로 설계 | 타당하다. chat renderer는 core history의 직렬화 형식에 종속되면 안 된다. |
| MicroAgentica | 직접 대응 구조 없음 | 모든 operations를 곧바로 `call()`에 넘기는 얇은 facade | 변경 금지, shared `call.ts` 변화도 regression test 필요 | 불변 조건이다. Agentica 강화가 MicroAgentica 복잡화로 번지면 실패다. |

## 위키 설계의 보정점

위키의 핵심 설계는 유지하되, 다음처럼 읽히도록 정리했다.

- `Agentica Next`는 단일 대형 구현안이 아니라 phase별 migration guide다.
- Claude Code 분석 문서는 근거 저장소이고, 구현자는 `total-review -> roadmap -> architecture-blueprint -> verification-strategy` 순서로 먼저 읽는다.
- task, remote, plugin, team, UI adapter 설계는 core 1차 구현 범위가 아니라 후속 capability 후보로 본다.
- 작업 로그는 감사 이력만 남기고, 장기 지식은 각 주제 문서에서 찾는다.

## 구현 우선순위 판정

1. Local operation index: 완료된 1차 발판
   - `packages/core` 내부에 provider-neutral operation descriptor와 lexical index를 둔다.
   - DBMS, embedding, external service는 기본 경로에서 제외한다.
   - `@agentica/vector-selector`는 호환 backend나 별도 adapter로만 연결한다.
   - 2026-05-24에 opt-in local/hybrid/auto selector path가 들어갔다. 이후 우선순위에서는 "첫 구현"이 아니라 "다른 runtime state와 연결할 기반"으로 본다.

2. Context projector와 result budget: 다음 최우선
   - history storage, model input, chat render projection을 분리한다.
   - operation result는 full JSON을 항상 다시 넣지 말고 preview/reference/summary를 선택한다.
   - public history 호환성을 유지하면서 model-facing request만 먼저 바꾼다.

3. Progressive content read와 result materialization
   - Claude Code의 file splitting을 Agentica의 controller/API/resource result slicing으로 일반화한다.
   - line/page/item/jsonPath/byte range와 digest/version 기반 unchanged stub을 둔다.
   - read-state/freshness precondition은 destructive/write operation의 call 직전 gate로 둔다.
   - task output cursor와 remote output tail read도 같은 protocol을 재사용한다.

4. Compact runtime
   - 단순 summary가 아니라 operation discovery state, pending output reference, preserved segment를 복원해야 한다.
   - public event/history 확장은 늦춘다.

5. Stateful `Agentica` executor
   - 기존 `Agentica` facade는 유지하고 내부 executor만 phase transition 구조로 바꾼다.
   - `MicroAgentica`는 새 runtime을 통과하지 않는다.

6. Operation policy와 task/control plane
   - Claude Code의 task, plugin, remote, swarm 구조는 참고 가치가 크지만 core 1차 변경에 섞으면 위험하다.
   - 별도 capability registry와 adapter boundary를 둔 뒤 작은 PR로 나눈다.

## 남은 위험

- `call.ts`는 `Agentica`와 `MicroAgentica`가 공유한다. 이 파일을 수정하는 구현 PR은 MicroAgentica regression을 반드시 포함해야 한다.
- compact/result reference를 도입하면 `packages/rpc`, `packages/chat`, `test`, `website` 문서 예제가 동시에 영향을 받는다.
- local selector가 LLM selector를 완전히 대체한다고 가정하면 안 된다. 1차 목표는 schema/token 낭비를 줄이는 candidate narrowing이다.
- progressive read/result store 없이 compact만 먼저 넣으면 큰 result가 compact request와 chat renderer에 그대로 남아 실패한다.
- Claude Code source의 일부 feature-gated 흔적은 구현 파일이 snapshot에 없었다. 위키는 이를 "구현 미포함 seam"으로만 기록한다.

## 리뷰 결과

- 세 축 비교 결과, 위키의 핵심 방향은 유지한다.
- OpenAI `tool_search` 공식 문서가 추가되어 provider-native deferred schema loading 가능성은 보정했다. 그래도 Agentica 기본 경로는 provider-neutral local selector가 맞다.
- 2026-05-24에 local operation index와 opt-in selector mode를 구현했고, 위키 진입점/로드맵/구현 현황 문서를 최신화했다.
- 2026-05-24 후속 재리뷰에서 selector 중심 결론을 확장했다. 다음 판단 기준은 [Claude Code 최적화 패턴 적용 지도](../03-design/agentica-next/claude-code-optimization-map.md)이며, context projector/result budget/progressive read가 다음 우선순위다.
- 날짜별 작업 로그는 반복 설명을 줄이고, 세부 근거는 주제 문서로 남긴다.
