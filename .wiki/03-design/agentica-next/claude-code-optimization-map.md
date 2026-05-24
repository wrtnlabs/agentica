# Claude Code 최적화 패턴 적용 지도

## 목적

Local selector는 Agentica가 큰 operation catalog를 다룰 때 필요한 첫 최적화였지만, Claude Code에서 배울 최적화는 selector에 그치지 않는다. Agentica는 특정 IDE helper가 아니라 general purpose function-calling agent이므로, 긴 세션과 큰 결과물, 다양한 controller, UI/RPC adapter, background work를 모두 견디는 runtime 최적화 지도가 필요하다.

이 문서는 `.wiki/02-research/claude-code/*`에서 확인한 패턴을 Agentica 구현 축으로 재분류한다. 구현 순서는 [Agentica 강화 로드맵](./roadmap.md)이 따르고, 세부 타입/모듈은 [Agentica Next 아키텍처 청사진](./architecture-blueprint.md)이 따른다.

## 핵심 판단

- Selector 최적화는 schema loading 최적화다. context window 전체를 지키려면 result projection, progressive read, compact, render projection이 별도 계층으로 필요하다.
- Claude Code의 파일 분할 읽기는 filesystem 전용 기술이 아니라 큰 content source를 line/page/offset/item/jsonPath 단위로 materialize하는 일반 패턴이다.
- LLM-facing context, public history, audit 원본, UI render projection, resume sidecar는 같은 데이터가 아니다.
- 큰 function result를 history에 그대로 넣는 구조는 compact 이전에 이미 실패한다. 먼저 preview/reference/result store를 둬야 한다.
- Stateful loop는 기능 추가가 아니라 복구 가능성을 위한 구조다. prompt-too-long, stop, permission, registry reload, task completion을 transition으로 다뤄야 한다.

## Claude Code 패턴과 Agentica 대응

| 패턴 | Claude Code에서 확인한 구조 | Agentica 대응 |
| --- | --- | --- |
| Deferred schema loading | `ToolSearchTool`, direct `select:`, discovered tool state, tool description lazy loading | `AgenticaOperationIndex`, `AgenticaSelector`, selected candidate projection |
| Context lifecycle | microcompact, auto/full compact, prompt-too-long retry, compact boundary restore | `AgenticaContextProjector`, `AgenticaCompactor`, compact boundary sidecar |
| Progressive content read | `FileRead` line/page/range, `Grep` mode/cap, `Glob` cap/pagination, LSP semantic query | `AgenticaSegmentedContentReader`, range-based result refs, controller result pagination |
| Read-state/freshness | `readFileState`, mtime/content check, edit-before-read prevention, unchanged stub | digest/version guard, `requiresFreshRead`, operation precondition state |
| Result materialization | large output preview, output refs, task output store, offset/tail reads | `AgenticaResultStore`, `AgenticaResultReference`, task output cursor |
| Runtime loop | context prep, tool execution, recovery, continuation, stop hook in one loop | `AgenticaRuntime` phase transition and retry policy |
| Attachment drain | file/plan/skill/tool/MCP attachment를 next context에 재주입 | operation schema, selected candidates, validation retry facts, result refs restore |
| Operation policy | read-only/destructive/concurrency/permission/freshness/maxResult metadata | `AgenticaOperationRuntime` and pre-call policy gate |
| Task/control plane | Todo/Task output, notification queue, stop, remote sidecar | `AgenticaTaskRuntime`, notification queue, stop transition |
| Render projection | Ink renderer가 model context와 UI transcript를 분리하고 large result를 접음 | chat/RPC adapter-local render projection and stable row ids |
| Context diagnostics | `/context`가 raw transcript가 아니라 API-view와 deferred/compact state를 계산 | projected request diagnostics, category/token budget report |
| Capability/memory | frontmatter discovery, registry version, reload/cache invalidation | capability registry, connector registry version, selector cache invalidation |

## Progressive Read의 일반화

Claude Code의 `FileRead`는 `path`를 읽는 도구처럼 보이지만, 실제 최적화의 본질은 "큰 자료를 한 번에 model context에 넣지 않고 안정적인 slice로 요청한다"는 점이다. Agentica는 filesystem을 core 전제로 둘 수 없으므로, 다음 content source를 같은 protocol로 본다.

- HTTP/OpenAPI 응답의 item page 또는 JSONPath slice
- class controller가 반환한 큰 JSON array/object
- MCP resource 또는 remote connector output
- document/search/list operation 결과
- task/background output log
- binary/blob metadata와 text preview

`FileEdit`의 read-before-write 조건도 같은 계층으로 번역한다. destructive/write operation은 단순 schema validation만 통과하면 안 되고, 직전 read/search 결과의 digest/version, backend state, approval state가 여전히 fresh한지 pre-call gate에서 확인해야 한다.

권장 segment shape:

```typescript
interface AgenticaContentSegment {
  sourceId: string;
  contentType: string;
  range?: {
    kind: "line" | "page" | "byte" | "jsonPath" | "item";
    start: number | string;
    end?: number | string;
  };
  digest?: string;
  version?: string;
  preview: string;
  fullRef?: string;
  tokenEstimate?: number;
  truncated: boolean;
}
```

이 protocol은 Agentica core에서 파일을 직접 읽자는 뜻이 아니다. controller/adapter가 큰 결과를 반환하면 runtime이 preview와 `fullRef`를 만들고, 후속 turn에서 필요한 range만 재투영할 수 있어야 한다는 뜻이다.

## Result Store와 Projection

`AgenticaHistory`는 사용자의 대화와 function call 감사 이력이다. 모델에 넣는 메시지는 `AgenticaContextProjector`가 별도로 만든다.

1. Small result는 기존처럼 inline projection할 수 있다.
2. Large result는 `preview + reference + digest + range metadata`만 model-facing context에 넣는다.
3. Public history는 호환성을 위해 원본 shape를 유지하되, 새 structured history type은 별도 phase에서 연다.
4. UI/chat render는 full JSON을 무제한 출력하지 않고 adapter-local preview/reference row를 쓴다.
5. Resume/compact sidecar는 result ref, segment ref, task output cursor를 보존한다.

반복 read/list/search가 같은 digest/version을 반환하면 전체 내용을 다시 넣지 않고 "unchanged" stub을 투영한다. 이 하나만으로도 긴 조사형 세션의 context 낭비가 크게 줄어든다.

## Runtime Loop 최적화

Claude Code의 query loop는 단순 while loop가 아니라 transition-aware runtime이다. Agentica의 다음 executor는 최소한 다음 상태를 관찰 가능하게 가져야 한다.

- `prepare_context`: selector cache, compact state, pending refs, output budget을 모아 projection한다.
- `select_operations`: local/hybrid selector로 candidate catalog를 좁힌다.
- `call_model`: provider별 request와 prompt-too-long detection을 분리한다.
- `execute_operations`: call validation, permission, policy, concurrency, freshness를 적용한다.
- `append_results`: result store와 public history를 분리해 기록한다.
- `compact_retry`: reactive compact 후 같은 turn을 재시도한다.
- `describe_or_finish`: user-facing summary와 model-facing state를 분리한다.
- `abort`: stop, permission denial, unrecoverable validation failure를 기록한다.

이 구조가 있어야 prompt-too-long recovery, max-output-token retry, token budget continuation, stop hook, registry reload, background task notification, connector auth recovery가 function call 실패처럼 섞이지 않는다.

## 구현 Phase

### Phase A: Local Selector

상태: 2026-05-24 1차 구현 완료.

- `AgenticaOperationIndex`
- `IAgenticaConfig.selector`
- `llm`, `standard`, `local`, `hybrid`, `auto`
- LLM selector validation의 candidate catalog 보정

### Phase B: Context Projector와 Result Budget

다음 최우선 구현이다.

- `factory.decodeHistory()` 직접 의존을 감싸는 projector를 둔다.
- model-facing context와 public history를 분리한다.
- 큰 execute result는 preview/reference로 바꾼다.
- tool call/result pairing invariant를 unit test로 고정한다.

### Phase C: Segmented Content Reader

Claude Code의 파일 분할 읽기를 Agentica식 general content slice로 번역한다.

- line/page/item/jsonPath/byte range descriptor를 정의한다.
- search/list/read operation은 caps, offset, truncated flag를 갖는다.
- digest/version 기반 unchanged stub을 지원한다.
- task output과 remote output도 같은 cursor/read protocol을 재사용한다.

### Phase D: Compact Lifecycle

compact는 Phase B/C 위에서 동작해야 한다.

- microcompact: 오래된 large result를 stub/reference로 축소한다.
- auto compact: threshold/circuit breaker를 둔다.
- reactive compact: prompt-too-long 후 같은 turn을 재시도한다.
- full compact: summary, preserved tail, restore attachments를 transaction으로 만든다.

### Phase E: Stateful Runtime Loop

legacy executor를 보존한 채 internal runtime loop를 병행 도입한다.

- phase transition 로그와 metrics를 남긴다.
- prompt-too-long, stop, permission, validation retry를 runtime transition으로 분리한다.
- custom executor hook과 public facade를 유지한다.

### Phase F: Operation Policy와 Task Runtime

policy와 task는 core public surface로 바로 열지 않는다.

- readOnly/destructive/concurrencySafe/permission/maxResult metadata
- freshness precondition과 digest/version guard
- `requiresFreshRead`, idempotency, side-effect facet
- long-running output reference, offset/tail read, terminal notification
- stop transition과 notification dedup

### Phase G: Render Projection과 Diagnostics

model-facing projection이 안정된 뒤 UI/RPC/documentation 표면을 맞춘다.

- chat renderer large result preview/reference
- compact marker short row
- task terminal summary row
- projected context diagnostics
- raw history가 아니라 실제 model-facing request 기준의 token/category breakdown
- website/docs의 public contract 정리

## 당장 바꿔야 할 우선순위

Selector 구현은 끝난 첫 발판이다. 이제 가장 큰 risk는 함수 선택이 아니라 "선택 후 나온 큰 결과와 긴 세션을 어떻게 계속 다룰 것인가"다.

따라서 다음 PR 후보는 다음 순서가 맞다.

1. `AgenticaContextProjector`의 internal 도입
2. execute result preview/reference와 deterministic result budget
3. `AgenticaResultStore` 및 segment/ref metadata
4. reactive compact의 실패 복구 skeleton
5. runtime transition 로그와 최소 state store

이 순서를 따르면 Claude Code식 compact, file splitting, task output, render projection을 서로 분리된 작은 변경으로 흡수할 수 있다.
