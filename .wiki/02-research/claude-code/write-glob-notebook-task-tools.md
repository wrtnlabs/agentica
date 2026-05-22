# Claude Code Write/Glob/Notebook/Todo/Task 도구 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/tools/FileWriteTool/FileWriteTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/FileWriteTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/GlobTool/GlobTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/GlobTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/NotebookEditTool/NotebookEditTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/NotebookEditTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TodoWriteTool/TodoWriteTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TodoWriteTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskOutputTool/TaskOutputTool.tsx`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskCreateTool/TaskCreateTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskUpdateTool/TaskUpdateTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskGetTool/TaskGetTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskListTool/TaskListTool.ts`
- `/home/samchon/github/samchon/claude-code/src/Task.ts`
- `/home/samchon/github/samchon/claude-code/src/tasks/types.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/tasks.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/todo/types.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/task/diskOutput.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/task/framework.ts`
- `/home/samchon/github/samchon/claude-code/src/utils/task/outputFormatting.ts`

## FileWriteTool

`FileWriteTool`은 create/overwrite 도구지만, 실제로는 safety gate와 후속 runtime integration이 강하다.

Tool contract:

- name: `Write`
- search hint: create or overwrite files
- strict schema
- max result size: 100,000 chars
- path extractor: `file_path`
- write permission gate
- wildcard permission matcher
- result serializer: create/update 성공 문장
- search text extractor: empty string

모델-facing prompt의 핵심:

- 기존 파일이면 반드시 먼저 `Read` 해야 한다.
- 기존 파일 수정에는 가능하면 `Edit`를 선호해야 한다.
- documentation/README는 user가 명시적으로 요청하지 않으면 만들지 않는다.
- emoji도 user가 명시적으로 요청하지 않으면 쓰지 않는다.

validation:

- `file_path`는 `expandPath()`로 정규화된다.
- team memory secret guard가 content를 검사한다.
- permission deny rule이면 실패한다.
- UNC path는 permission 전 filesystem I/O를 피한다.
- 기존 파일은 `readFileState`가 있어야 하며 partial read는 허용하지 않는다.
- 마지막 read 이후 mtime이 바뀌면 실패한다.

call 실행:

1. path 기반 skill directory를 discover하고 conditional skill을 activate한다.
2. LSP diagnostic tracker에 edit 시작을 알린다.
3. parent directory를 만든다.
4. file history가 켜져 있으면 pre-edit backup을 남긴다.
5. atomic에 가까운 구간에서 현재 파일을 다시 읽고 stale 여부를 재검사한다.
6. Windows/cloud sync처럼 timestamp만 바뀐 경우 full-read content가 동일하면 허용한다.
7. 기존 encoding을 유지하고, 새 content의 line ending 의도를 그대로 쓴다.
8. LSP didChange/didSave, VSCode diff notification, `readFileState` 갱신을 수행한다.
9. 기존 파일이면 structured patch를 만들고 update 결과를 낸다.
10. 새 파일이면 create 결과와 addition count를 낸다.

중요한 관찰:

- `validateInput()`만 믿지 않고 `call()` 직전에도 stale check를 반복한다.
- create는 선행 read가 필요 없지만 update는 full fresh read가 필요하다.
- UI/render, model result, search index text가 분리되어 있다.
- write 후 runtime read state가 새 content로 갱신되어 다음 read dedup/stale check와 이어진다.
- source상 `oldContent` truthiness로 create/update result branch를 가르므로, 기존 empty file overwrite는 result classification이 create처럼 보일 수 있다. Agentica 설계에서는 존재 여부와 content emptiness를 분리해야 한다.

Agentica 적용:

- side-effect operation은 validation과 execution 사이에 state가 바뀔 수 있음을 전제로 해야 한다.
- API operation에도 `read-before-write`, `version-match`, `etag-match`, `resource-digest-match` 같은 precondition facet이 필요하다.
- operation result는 user-visible diff, LLM-facing compact result, audit 원본을 분리해야 한다.

## GlobTool

`GlobTool`은 filename pattern search 전용 read-only 도구다.

Tool contract:

- name: `Glob`
- search hint: find files by name pattern or wildcard
- read-only
- concurrency safe
- search/read classification: search yes, read no
- default result limit: 100
- result serializer: filenames newline list, truncated 안내

validation:

- `path`가 없으면 cwd를 쓴다.
- `path`가 있으면 directory 존재 여부를 확인한다.
- UNC path는 permission 전 filesystem I/O를 피한다.
- path가 존재하지 않거나 file이면 명확한 error를 낸다.

call 실행:

- `glob(pattern, path, { limit, offset: 0 }, abortSignal, permissionContext)`를 호출한다.
- 결과 path는 cwd 기준 relative path로 줄인다.
- `durationMs`, `numFiles`, `filenames`, `truncated`를 반환한다.

모델-facing prompt의 핵심:

- codebase size와 무관하게 빠른 pattern matching 도구다.
- `**/*.js`, `src/**/*.ts` 같은 glob pattern을 지원한다.
- open-ended multi-round search는 Agent tool 사용을 권한다.

Agentica 적용:

- local operation index도 "검색 도구"와 "실제 read 도구"를 분리해야 한다.
- local RAG candidate lookup에는 hard cap, pagination/offset, truncated flag가 필요하다.
- search result는 짧은 relative identifier를 LLM에 주고, runtime state에는 canonical key를 보존해야 한다.

## NotebookEditTool

`NotebookEditTool`은 `.ipynb` 전용 cell editor다. 일반 file edit보다 domain-specific validation이 강하다.

Tool contract:

- name: `NotebookEdit`
- search hint: edit Jupyter notebook cells
- `shouldDefer: true`
- write permission gate
- max result size: 100,000 chars
- output에 `original_file`과 `updated_file`을 포함한다.

입력:

- `notebook_path`
- optional `cell_id`
- `new_source`
- optional `cell_type`: `code` 또는 `markdown`
- optional `edit_mode`: `replace`, `insert`, `delete`

validation:

- path는 absolute가 아니면 cwd 기준 resolve한다.
- UNC path는 permission 전 filesystem I/O를 피한다.
- extension은 `.ipynb`만 허용한다.
- insert에는 `cell_type`이 필요하다.
- read-before-edit가 필수다.
- 마지막 read 이후 mtime이 바뀌면 실패한다.
- notebook file이 없거나 JSON parsing이 실패하면 실패한다.
- replace/delete에는 cell id가 필요하다.
- cell id는 실제 id를 먼저 찾고, 없으면 `cell-N` numeric index로 fallback한다.

call 실행:

- file history backup을 남긴다.
- notebook JSON은 non-memoized parser로 읽는다. memoized object를 mutate하면 cache가 오염되기 때문이다.
- cell id가 없고 insert면 beginning에 삽입한다.
- insert는 지정 cell 뒤에 삽입한다.
- replace가 notebook 끝 바로 다음 index를 가리키면 insert로 전환한다.
- code cell 수정 시 `execution_count`와 `outputs`를 초기화한다.
- nbformat 4.5 이상에서는 새 cell id를 생성한다.
- 기존 encoding과 line ending을 유지해 JSON을 다시 쓴다.
- `readFileState`를 updated content와 새 mtime으로 갱신한다.

Agentica 적용:

- operation은 endpoint/function 단위만이 아니라 resource format별 specialist가 필요할 수 있다.
- JSON/document mutation은 generic string edit보다 구조화 parser를 우선해야 한다.
- domain-specific edit는 output/result에 original과 updated artifact reference를 남겨 audit/rollback/compact에 쓸 수 있어야 한다.

## TodoWriteTool

`TodoWriteTool`은 legacy session todo list다.

Tool contract:

- name: `TodoWrite`
- `shouldDefer: true`
- strict schema
- permission check 없음
- `isEnabled()`는 Todo V2가 꺼져 있을 때만 true
- user-facing name과 render message는 비워 UI noise를 줄인다.

schema:

- todo item은 `content`, `status`, `activeForm`을 가진다.
- status는 `pending`, `in_progress`, `completed`다.
- `activeForm`은 진행 중 UI에 쓰이는 현재진행형 문구다.

call 실행:

- todo key는 `context.agentId` 또는 session id다.
- 모든 todo가 completed면 app state의 해당 todo list는 빈 배열로 저장한다.
- 반환 data에는 oldTodos, newTodos, optional verification nudge가 들어간다.
- verification feature flag가 켜져 있고, main thread가 3개 이상 todo를 모두 닫았는데 verification 항목이 없으면 tool result에 verifier reminder를 붙인다.

모델-facing prompt의 핵심:

- 복잡한 multi-step task에는 proactive하게 todo를 써라.
- 한 번에 하나만 `in_progress`여야 한다.
- 완료 즉시 completed로 바꾸고 batch completion을 하지 말라.
- 부분 구현, failing test, unresolved error가 있으면 completed로 표시하지 말라.

Agentica 적용:

- Agentica runtime에도 planning state는 user-visible history와 분리된 internal state로 둘 수 있다.
- long-running workflow에서는 "현재 단계", "검증 단계", "완료 조건"이 model prompt만이 아니라 runtime invariant로 남아야 한다.
- MicroAgentica에는 이 workflow state를 넣지 않는다.

## Task V2 도구군

Claude Code에는 Todo V2가 켜졌을 때 쓰는 file-backed task 도구군이 따로 있다.

### TaskCreate

`TaskCreateTool`은 `subject`, `description`, optional `activeForm`, optional `metadata`로 task를 만든다.

특징:

- `shouldDefer: true`
- Todo V2 enabled일 때만 활성화
- concurrency safe
- task created hook을 실행하고 blocking error가 있으면 생성한 task를 삭제한다.
- 생성 후 task panel을 auto-expand한다.

### TaskUpdate

`TaskUpdateTool`은 task field, status, owner, dependency, metadata를 갱신한다.

특징:

- `shouldDefer: true`
- Todo V2 enabled일 때만 활성화
- concurrency safe
- status `deleted`를 special action으로 지원한다.
- status를 completed로 바꿀 때 task completed hook을 실행하고 blocking error가 있으면 실패한다.
- swarms가 켜져 있고 teammate가 task를 in_progress로 바꾸면 owner를 자동 설정한다.
- dependency는 `blocks`와 `blockedBy` 양방향으로 갱신한다.
- verification nudge는 TodoWrite와 같은 구조로 V2에도 존재한다.
- task not found는 streaming sibling cancellation을 피하려고 non-error tool result로 반환한다.

### TaskGet과 TaskList

`TaskGetTool`과 `TaskListTool`은 read-only/concurrency-safe task 조회 도구다.

`TaskListTool`은 internal metadata task를 제외하고, completed blocker는 표시에서 제거한다.

### task storage

`utils/tasks.ts`의 task list는 filesystem JSON 기반이다.

핵심:

- task list id 우선순위: env explicit id, teammate context, team name, leader team name, session id.
- path component는 alphanumeric/hyphen/underscore만 허용하도록 sanitize한다.
- create는 task-list-level lock과 high-water mark로 id reuse/race를 막는다.
- update는 task file lock을 잡는다.
- delete는 high-water mark를 갱신하고 다른 task의 dependency reference를 제거한다.
- claim은 task lock 또는 task-list-level lock으로 already claimed, completed, blocked, agent busy를 atomically 판정한다.

Agentica 적용:

- sub-agent/workflow runtime을 넣는다면 task state는 in-memory history만으로 부족하다.
- resume 가능한 task/workflow에는 stable id, owner, dependency, status, metadata, output reference가 필요하다.
- task mutation은 LLM이 보기에는 단순 function call이어도 runtime에서는 lock/transaction 성격을 가진다.

## TaskOutputTool과 background output

`TaskOutputTool`은 background task output reader다. 코드상 description/prompt는 deprecated이며, task output file path를 `Read`로 직접 읽는 것을 권한다.

Tool contract:

- name: `TaskOutput`
- aliases: `AgentOutputTool`, `BashOutputTool`
- `shouldDefer: true`
- read-only
- concurrency safe
- input: `task_id`, `block`, `timeout`
- `block` default true
- `timeout` max 600,000ms, default 30,000ms

call 실행:

- task id가 없거나 app state에 없으면 validation 실패다.
- non-blocking이면 현재 상태를 즉시 반환한다.
- 완료된 task는 `notified: true`로 표시한다.
- blocking이면 100ms polling으로 terminal state를 기다린다.
- abort signal이 오면 `AbortError`를 던진다.
- timeout이면 현재 task snapshot 또는 null을 반환한다.

output model:

- local bash는 stdout/stderr와 exitCode를 합친다.
- local agent는 disk JSONL transcript보다 in-memory final assistant text를 우선한다.
- remote agent는 command/prompt를 보존한다.
- model-facing result는 XML-like tags로 `retrieval_status`, `task_id`, `task_type`, `status`, `exit_code`, `output`, `error`를 만든다.
- output은 `formatTaskOutput()`으로 truncation된다. default 32,000 chars, upper limit 160,000 chars다.

disk output:

- task output dir는 project temp dir + first session id + `tasks`다.
- output path는 task id별 `.output` file이다.
- Unix에서는 `O_NOFOLLOW`로 symlink-following attack을 줄인다.
- new output file은 `O_EXCL`로 이미 존재하는 path를 거부한다.
- background output cap은 5GB다.
- in-memory write queue는 flat array와 drain loop로 chunk GC를 빠르게 한다.
- delta read는 byte offset 기반이며 default 8MB만 읽는다.
- full output read도 tail 방식으로 읽고, 앞부분이 잘리면 omitted marker를 붙인다.

task notification:

- task framework는 task status/output 변화에 대해 attachment/notification을 만든다.
- notification에는 task id, tool use id, task type, output file path, status, summary가 들어간다.
- completed task notification은 각 task type이 직접 처리해 double delivery race를 피한다.
- terminal task는 notified 이후 evict될 수 있다.

Agentica 적용:

- sub-agent나 async workflow를 도입하면 execute result에 raw output을 계속 inline하지 말고 output reference를 기본으로 삼아야 한다.
- `execute` history에는 short summary와 reference id/path를 넣고, LLM projection은 tail/truncated view를 주는 방식이 적합하다.
- background 작업은 app/runtime state, disk/reference output, user notification, LLM-visible result를 분리해야 한다.
- polling과 timeout은 model prompt가 아니라 runtime transition으로 표현해야 한다.

## 종합 결론

Claude Code remaining tools에서 반복되는 핵심은 다음이다.

1. tool schema는 최소 입력만 표현하고, safety/runtime state는 별도 context에서 판단한다.
2. write 계열은 validate-time check와 call-time check를 모두 가진다.
3. search/read/write/result-output은 각각 concurrency, permission, projection 정책이 다르다.
4. long-running task는 history가 아니라 stable runtime artifact로 관리한다.
5. LLM에게 주는 payload, UI 표시, resume/audit 원본, local search index text는 분리해야 한다.

Agentica Next에서는 이 원칙을 `AgenticaOperationRuntime`, `AgenticaRuntimeState`, `AgenticaResultReference`, `AgenticaTaskRuntimeState` 같은 내부 구조로 옮긴다. 기존 `AgenticaOperation`과 public history/event contract는 바로 무겁게 만들지 않는다.
