# Claude Code File/Search/Edit 도구 분석

이 문서는 Claude Code의 `FileReadTool`, `GrepTool`, `FileEditTool` 구조를 읽고 Agentica에 적용할 수 있는 원칙을 정리한다. `FileWriteTool`, `GlobTool`, `NotebookEditTool`, `TodoWriteTool`, task tools는 [Write/Glob/Notebook/Todo/Task 도구 분석](./write-glob-notebook-task-tools.md)에 분리했다.

## 공통 원칙

세 도구는 단순 파일 I/O 함수가 아니다. Tool contract 안에 다음 정보를 넣는다.

- `searchHint`
- model-facing schema
- max result size
- read-only 여부
- concurrency safety
- permission matcher
- path resolver
- observable input backfill
- UI renderer
- search text extractor
- tool result serializer

Agentica operation도 function schema만으로는 부족하다. selector와 policy가 쓰는 metadata, permission matcher, result summary, side-effect classification이 필요하다.

## FileReadTool

역할:

- text, image, PDF, notebook을 읽는다.
- line range offset/limit을 지원한다.
- PDF page range를 지원한다.
- read 결과를 `readFileState`에 기록한다.
- 동일 range를 다시 읽고 파일 mtime이 그대로면 full content 대신 `file_unchanged` stub을 반환한다.

주요 안전장치:

- binary extension 차단. 단 PDF/image/SVG 등 native 처리 대상은 예외다.
- `/dev/zero`, `/dev/random`, stdio fd 등 blocking/infinite device path 차단.
- UNC path는 permission 전 filesystem I/O를 피한다.
- text read는 file size cap과 token cap을 모두 확인한다.
- image는 token budget에 맞게 resize/compress한다.
- PDF는 큰 파일/많은 page를 page extraction 경로로 유도한다.

중요한 설계:

- read는 read-only이면서 concurrency safe다.
- read listener로 다른 service가 file read를 감지할 수 있다.
- path 기반 skill discovery/conditional skill activation이 있다.
- read result UI에는 content를 직접 표시하지 않고 model-facing tool result에만 content를 보낸다.

Agentica 적용:

- operation result가 클 때 full payload를 그대로 history에 넣지 말고 stub/reference/digest를 둘 수 있다.
- operation 호출도 "동일 입력/동일 backend state면 중복 payload를 줄이는" dedup layer가 가능하다.
- selector용 local RAG는 read/search result를 index할 때 UI summary가 아니라 model-facing content와 source path를 구분해야 한다.

## GrepTool

역할:

- ripgrep 기반 content search.
- output mode: `content`, `files_with_matches`, `count`.
- glob/type/context/line number/case-insensitive/multiline/head_limit/offset 지원.

주요 안전장치:

- read permission check를 사용한다.
- VCS metadata directory를 기본 제외한다.
- line length를 `--max-columns 500`으로 제한한다.
- permission ignore pattern을 ripgrep glob exclusion으로 변환한다.
- plugin cache orphan directory를 제외한다.
- default head limit 250을 둔다. `head_limit=0`일 때만 unlimited다.

결과 처리:

- content/count/files mode별 serializer가 다르다.
- absolute path를 relative path로 줄여 token을 아낀다.
- files mode는 mtime desc, filename tie-breaker로 정렬한다.
- `extractSearchText()`가 search index에 넣을 텍스트를 제공한다.

Agentica 적용:

- local RAG selector의 retrieval output도 mode별로 달라야 한다.
- default result cap과 pagination은 필수다.
- 검색 결과 정렬은 relevance만이 아니라 recency/mtime 같은 operational signal을 쓸 수 있다.

## FileEditTool

역할:

- exact string replacement.
- `replace_all` 지원.
- 새 파일 생성은 file missing + empty `old_string`일 때만 허용한다.

핵심 precondition:

- 편집 전 같은 파일을 `Read`로 읽어야 한다.
- partial read 상태면 edit 불가다.
- read 이후 파일 mtime이 바뀌면 edit 불가다.
- 단 Windows/cloud sync 등 timestamp만 바뀐 경우 full read content가 동일하면 허용한다.

주요 validation:

- denied path면 ask/fail.
- team memory file secret guard.
- notebook은 NotebookEditTool 사용 요구.
- too large file edit 차단.
- `old_string === new_string` 차단.
- `old_string`이 없으면 fail.
- match가 여러 개이고 `replace_all` false면 더 많은 context 요구.
- settings file edit은 별도 validator를 통과해야 한다.

실행:

- parent directory mkdir.
- file history backup.
- atomic에 가까운 read-modify-write 구간에서 async gap을 최소화한다.
- quote normalization/curly quote preservation을 적용한다.
- structured patch를 만든다.
- encoding/line ending을 보존해 write한다.
- LSP/VSCode/file history/git diff/analytics를 후속 처리한다.
- `readFileState`를 edited content로 갱신한다.

Agentica 적용:

- write/destructive operation은 "선행 read/lookup freshness" 같은 precondition을 가질 수 있다.
- function schema validation만으로는 race condition을 막지 못한다.
- operation metadata에 `requiresFreshRead`, `idempotent`, `replaceAll`, `sideEffect` 같은 facet이 필요하다.
- execute event의 `success`만으로는 user-modified approval, patch, diff, freshness failure를 표현하기 부족하다.

## Tool result와 index의 분리

Claude Code는 UI에 보여주는 내용, model에게 주는 tool result, search index에 들어가는 text를 분리한다.

Agentica도 다음을 분리해야 한다.

- user-visible event payload
- LLM history payload
- JSON resume payload
- local RAG indexing payload
- audit/policy payload

현재 Agentica의 execute history는 tool result를 history에 직접 넣는 성격이 강하다. compact와 local RAG를 넣으려면 result payload projection 계층이 필요하다.
