# 로컬 RAG와 함수 선택 설계

## 목표

Agentica의 기본 함수 선택은 DBMS, embedding provider, external vector store 없이 로컬에서 동작해야 한다. `@agentica/vector-selector`는 advanced plugin으로 남길 수 있지만, core의 기본 경로는 dependency-free여야 한다.

이 설계는 `Agentica` 전용이다. `MicroAgentica`는 적은 수의 operation을 그대로 모델에 제공하는 현재 역할을 유지한다.

## Claude Code에서 배울 점

Claude Code의 ToolSearch는 모든 tool schema를 처음부터 model context에 넣지 않는다. deferred tool은 이름만 알려주고, model이 필요할 때 검색 도구를 호출해 schema reference를 얻는다.

Anthropic의 `tool_reference`를 OpenAI Chat Completions에 그대로 이식할 수는 없다. 대신 Agentica에서는 다음 방식으로 유사 효과를 낼 수 있다.

1. local operation index가 user request에서 top-K 후보를 찾는다.
2. LLM에는 top-K operation의 요약만 보낸다.
3. LLM selector가 필요한 operation만 고른다.
4. caller request에는 선택된 operation의 full JSON schema만 보낸다.

즉 "deferred schema loading"을 provider-native feature가 아니라 Agentica runtime 단계로 구현한다.

정밀 분석 결과, Agentica가 가져와야 하는 것은 `ToolSearch`라는 이름의 도구가 아니라 다음 구조다.

- selector availability와 actual projection decision을 분리한다.
- operation registry의 전체 schema는 runtime에 보관하고, model-facing request에는 요약과 선택된 full schema만 넣는다.
- selected/discovered operation set은 retry, compact, resume 이후에도 복원 가능한 state로 저장한다.
- search 자체는 DBMS 없이 exact/direct/prefix/required-term/lexical scoring으로 충분히 시작한다.
- provider가 native deferred schema를 지원하지 않으면 pre-call top-K projection으로 같은 token 절감 효과를 낸다.

## Projection Modes

각 operation은 selector projection policy를 가진다.

| mode | 의미 | 예시 |
| --- | --- | --- |
| `always` | 첫 요청부터 full schema를 항상 제공 | core finalizer, 필수 control operation |
| `summary` | selector에는 summary/frontmatter만 제공하고 caller에는 선택 후 full schema 제공 | 대부분의 API/function/MCP operation |
| `deferred` | 모델이 명시적으로 로드 요청하거나 local selector가 선택하기 전까지 full schema 비노출 | 큰 MCP/API catalog |
| `hidden` | model selector에는 보이지 않고 runtime 내부에서만 사용 | adapter primitive, diagnostics, internal reference resolver |

`MicroAgentica`는 이 projection mode를 적용하지 않는다. 작은 함수 집합을 그대로 전달하는 단순 path가 MicroAgentica의 장점이다.

## Runtime Modes

Claude Code의 `tst`, `tst-auto`, `standard`를 Agentica에서는 provider-neutral selector mode로 번역한다.

```typescript
type AgenticaSelectorMode =
  | "standard" // 기존처럼 모든 operation schema를 inline projection
  | "local" // local lexical selector가 top-K 후보를 고름
  | "hybrid" // local recall + LLM precision/rerank
  | "auto"; // schema token estimate가 threshold 이상이면 local/hybrid 사용
```

`auto` mode는 전체 operation schema estimate가 model context window의 일정 비율을 넘으면 켜진다. Claude Code의 기본값은 10%다. Agentica도 초기값을 10%로 두되, provider/model context window를 알 수 없으면 character heuristic으로 fallback한다.

이 gate는 두 단계로 나뉜다.

- optimistic gate: selector feature와 history/reference 보존 여부를 결정한다.
- definitive gate: 실제 model/provider/context/token estimate를 보고 이번 request projection을 결정한다.

이 분리를 하지 않으면 model switch, provider switch, compact/resume 시 stale selector reference가 API error나 hallucinated call로 번진다.

## Operation Index 입력

각 operation에서 다음 field를 색인한다.

- `operation.name`
- controller name
- original function name
- function description
- parameter names
- parameter descriptions
- JSON schema enum/const literal
- HTTP method/path/tags
- protocol: `class`, `http`, `mcp`
- runtime metadata: read-only/destructive/concurrency hint, search hint, always-load
- capability frontmatter: `description`, `whenToUse`, `paths`, `allowedOperations`, `model`, `execution`

parameter schema는 임의 문자열 파싱보다 구조 순회가 낫다. OpenAPI/typia schema가 이미 object로 있으므로 recursive visitor를 둔다.

색인 cache key는 operation registry version과 operation key set으로 만든다. controller hot-swap, MCP reconnect, plugin reload, OpenAPI document reload가 일어나면 description/schema cache를 invalidate한다.

## Scoring

초기 구현은 BM25에 가까운 lexical ranking으로 충분하다.

- exact operation name match: 매우 높음
- `select:<operationKey>` direct selection: validation만 거쳐 즉시 선택
- controller/API prefix match: 높음
- controller/function token match: 높음
- HTTP path segment/tag match: 높음
- `+required` term: name/description/searchHint/schema 중 하나에 모두 매칭되어야 candidate 유지
- curated `searchHint`: description보다 높은 signal
- description term match: 중간
- parameter name/description match: 중간
- fuzzy/camelCase partial match: 낮음

한국어/영어 혼합 query를 고려해 tokenizer는 최소한 다음을 처리한다.

- whitespace split
- camelCase/PascalCase split
- snake/kebab/path segment split
- lower-case normalization
- 짧은 stopword 제거

Embedding은 후속 phase에서 optional scorer로 추가한다.

검색 결과가 0개여도 곧바로 실패시키지 않는다.

- pending connector가 있으면 다음 turn/retry에서 다시 검색할 수 있음을 state에 남긴다.
- local selector 0개는 `standard` fallback 또는 LLM selector fallback으로 보낸다.
- hallucinated operation key는 validation retry로 돌리되, retry prompt에는 "available operation summary"와 direct key hint만 제공한다.

## Optional Semantic Layer

Claude Code `LSPTool`은 language server가 있을 때 symbol/reference/call hierarchy를 검색하는 optional semantic retrieval layer다. Agentica core 기본 selector는 DBMS, embedding provider, language server 없이 동작해야 하므로 LSP를 필수 dependency로 삼지 않는다.

다만 장기적으로는 operation/controller source를 분석할 때 다음 signal을 optional plugin으로 사용할 수 있다.

- function/class symbol name
- definition/reference 위치
- call hierarchy
- diagnostics severity

이 signal은 local lexical index의 보조 feature로만 둔다. LSP server가 없거나 초기화 실패해도 selector는 기존 lexical path로 동작해야 한다.

## Lazy Capability Loading

Claude Code SkillTool은 skill listing에 전체 본문을 넣지 않고, 이름과 설명/when-to-use 중심으로 discovery한다. 본문 markdown과 reference files는 skill이 실제 invoke될 때만 들어간다.

Agentica도 같은 구조가 필요하다.

1. local index에는 operation schema summary와 capability frontmatter만 넣는다.
2. selector가 후보를 좁힌다.
3. 필요한 operation의 full schema와 필요한 procedure 본문만 projection한다.
4. 큰 reference file은 prompt에 붙이지 않고 readable local reference로 둔다.

이 구조는 `@agentica/vector-selector` 없이도 context 사용량을 줄이는 1차 전략이다.

## Discovered Operation State

Claude Code는 `tool_reference`가 들어 있는 transcript를 스캔해 이미 발견된 tool set을 재구성한다. Agentica는 provider-native `tool_reference`가 없으므로 별도 internal state가 필요하다.

```typescript
interface AgenticaDiscoveredOperationState {
  registryVersion: string;
  selectedOperationKeys: string[];
  candidateOperationKeys: string[];
  pendingConnectorNames: string[];
  source: "local-selector" | "llm-selector" | "manual-select" | "resume" | "compact-boundary";
}
```

이 state는 public chat history와 분리한다.

- model context projection에는 필요한 operation summary/full schema만 반영한다.
- render projection에는 "operation catalog refreshed" 같은 짧은 marker만 보여준다.
- compact boundary metadata에는 selected operation key와 registry version을 저장한다.
- resume 시 registry에서 사라진 operation key는 unavailable reference로 표시하고 projection에서 제외한다.
- schema가 바뀐 operation은 registry version mismatch로 재선택 또는 full schema refresh를 요구한다.

## Provider Capability

Anthropic `tool_reference` 같은 native feature가 있는 provider에서는 native deferred schema loading을 optional adapter로 쓸 수 있다. 그러나 Agentica core는 provider-neutral이어야 하므로 기본 path는 다음처럼 동작한다.

1. runtime이 local index로 top-K operation을 고른다.
2. selector prompt에는 후보 summary만 넣는다.
3. caller request에는 선택된 operation full schema만 넣는다.
4. selected set은 internal state에 남긴다.
5. compact/resume/retry는 internal state와 registry를 다시 projection한다.

provider native path를 추가하더라도 같은 `AgenticaDiscoveredOperationState`를 갱신해야 한다. 그래야 OpenAI, Anthropic, local model 간 model switch가 가능하다.

## API 초안

```typescript
interface IAgenticaSelectorConfig {
  type?: "llm" | "local" | "hybrid" | "standard" | "auto";
  topK?: number;
  minScore?: number;
  rerank?: boolean;
  autoThresholdPercent?: number;
  alwaysLoad?: string[];
  neverExpose?: string[];
  providerNativeDeferred?: boolean;
}

interface AgenticaOperationSearchResult {
  operation: AgenticaOperation;
  score: number;
  matchedFields: string[];
  reason?: string;
}

interface AgenticaCapabilitySearchResult {
  key: string;
  source: "operation" | "procedure" | "connector";
  score: number;
  matchedFields: string[];
  loadPolicy: "always" | "on-select" | "on-invoke";
}

interface AgenticaOperationIndexEntry {
  key: string;
  nameParts: string[];
  pathParts: string[];
  descriptionTerms: string[];
  schemaTerms: string[];
  searchHint?: string;
  loadPolicy: "always" | "summary" | "deferred" | "hidden";
  schemaTokenEstimate: number;
  registryVersion: string;
}
```

`hybrid` 모드에서는 local search가 recall을 책임지고, LLM은 precision과 ordering만 담당한다.

## `@agentica/vector-selector` 처리

단기적으로는 다음 중 하나가 좋다.

- 패키지는 유지하되 strategy 패키지로 격하하고 README에서 advanced selector로 설명한다.
- core의 local selector와 같은 `IAgenticaSelectorStrategy` 인터페이스를 구현하도록 바꾼다.
- DBMS 의존 strategy는 subpath export로 격리한다.

장기적으로는 `@agentica/vector-selector`라는 이름보다 `@agentica/selector` 아래 `local`, `embedding`, `sqlite`, `cohere` 식 subpath가 더 낫다.

## 테스트 기준

- operation name exact match가 항상 최상위에 와야 한다.
- `select:<operationKey>`는 direct selection으로 동작해야 한다.
- `+required` term이 하나라도 빠지면 candidate에서 제외되어야 한다.
- curated `searchHint` match가 description match보다 높은 점수를 가져야 한다.
- HTTP path/tag만으로도 관련 operation이 검색되어야 한다.
- parameter description에만 query term이 있어도 후보에 들어와야 한다.
- registry version/key set 변경 시 index/description cache가 invalidate되어야 한다.
- `auto` mode는 schema token/char estimate가 threshold 미만이면 기존 inline path로 fallback해야 한다.
- provider가 native deferred schema를 지원하지 않아도 pre-call top-K/full-schema projection path가 동작해야 한다.
- compact/resume 후 selected operation state가 복원되어야 한다.
- registry에서 사라진 operation reference는 caller projection에서 제외되고 validation retry로 연결되어야 한다.
- hallucinated function name은 selector 단계에서 validation failure로 재시도되어야 한다.
- local selector 결과가 0개일 때 기존 LLM selector fallback이 가능해야 한다.
- `MicroAgentica` path는 selector state/projection 없이 기존처럼 full schema direct path를 유지해야 한다.
