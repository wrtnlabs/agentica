# AutoBe 인메모리 RAG 참고

## 읽은 범위

- `/home/samchon/github/wrtnlabs/autobe-public/packages/agent/src/utils/RAGRetrieval.ts`
- `/home/samchon/github/wrtnlabs/autobe-public/packages/agent/src/orchestrate/common/orchestratePreliminary.ts`
- `/home/samchon/github/wrtnlabs/autobe-public/packages/agent/src/orchestrate/common/internal/fixPrelminaryApplication.ts`
- `/home/samchon/github/wrtnlabs/autobe-public/packages/agent/src/orchestrate/common/structures/*Preliminary*`

## 구조

AutoBe의 RAG는 Agentica의 operation selector와 목적이 다르다. AutoBe는 이전 산출물의 일부를 후속 phase prompt에 다시 넣기 위한 preliminary data retrieval이고, Agentica local selector는 user request에서 호출 후보 operation을 좁히는 runtime selector다.

그래도 가져올 수 있는 구조가 있다.

1. Retrieval unit을 작게 나눈다.
   - `IAnalysisSectionEntry`를 section 단위로 평탄화하고, section title/unit title/content를 검색 단위로 쓴다.
   - Agentica에서는 operation 하나가 기본 단위지만, field는 name/controller/description/parameter/http/schema/searchHint로 나누는 편이 맞다.

2. Index cache key를 deterministic content hash로 만든다.
   - AutoBe는 section payload를 SHA256으로 해시하고 build promise도 cache한다.
   - Agentica 1차 구현은 Node crypto 의존을 피하기 위해 operation signature 기반 FNV-1a registry version을 쓴다. 외부 저장소가 없는 in-memory cache key라는 목적은 같다.

3. BM25를 lexical baseline으로 둔다.
   - AutoBe `RAGRetrieval.ts`는 vector score와 BM25 score를 min-max normalize한 뒤 가중 합산한다.
   - Agentica core에는 embedding provider가 들어오면 안 되므로 BM25에 가까운 field-weighted lexical scoring만 넣는다. embedding/vector는 후속 optional strategy로 남긴다.

4. Dynamic K와 fallback 정책을 분리한다.
   - AutoBe는 p90/p50 score gap으로 K를 조정한다.
   - Agentica 1차 구현은 deterministic `topK` config로 시작한다. 자동 K는 benchmark가 생긴 뒤 넣는 편이 안전하다.

5. Schema projection으로 “선택 가능한 목록”과 “실제 본문”을 분리한다.
   - `fixPreliminaryApplication.ts`는 retrieval request schema description에 사용 가능한 database schema/interface operation/interface schema 이름 목록을 주입한다.
   - Agentica local selector도 full tool schema를 처음부터 모두 보내지 않고, local index 결과만 LLM selector 또는 caller에 투영하는 방향이 맞다.

## Agentica에 바로 적용하지 않은 점

- AutoBe hybrid retrieval은 embedding provider가 필요하다. Agentica core 기본 경로에는 network/API/DBMS 의존성을 넣지 않는다.
- AutoBe preliminary loop는 domain-specific collection complementation이다. Agentica selector에 그대로 가져오면 operation call loop와 책임이 섞인다.
- AutoBe RAG result는 phase artifact context이고, Agentica selector result는 `AgenticaOperationSelection`과 select event/history 계약을 유지해야 한다.

## 이번 구현에 반영한 점

- operation field를 나누어 색인한다.
- parameter/property/description/schema literal을 구조 순회로 수집한다.
- `searchHint`를 description보다 높은 signal로 취급한다.
- `select:<operationKey>` direct selection을 지원한다.
- local selector 결과가 없으면 기본값으로 기존 LLM selector에 fallback한다.
- `MicroAgentica` 경로는 변경하지 않는다.
