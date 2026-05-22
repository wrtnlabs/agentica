# Claude Code LSP/Task Control 도구 분석

## 근거 파일

- `/home/samchon/github/samchon/claude-code/src/tools/LSPTool/LSPTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/LSPTool/schemas.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/LSPTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/LSPTool/formatters.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/LSPTool/symbolContext.ts`
- `/home/samchon/github/samchon/claude-code/src/services/lsp/manager.ts`
- `/home/samchon/github/samchon/claude-code/src/services/lsp/LSPServerManager.ts`
- `/home/samchon/github/samchon/claude-code/src/services/lsp/LSPDiagnosticRegistry.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskStopTool/TaskStopTool.ts`
- `/home/samchon/github/samchon/claude-code/src/tools/TaskStopTool/prompt.ts`
- `/home/samchon/github/samchon/claude-code/src/tasks/stopTask.ts`

## LSPTool

`LSPTool`은 code intelligence 전용 read-only tool이다. 단순 파일 검색이 아니라 Language Server Protocol server와 연결된 symbol graph query 계층이다.

Tool contract:

- name: `LSP`
- search hint: code intelligence
- `isLsp: true`
- `shouldDefer: true`
- enabled 조건: LSP server가 connected/healthy
- read-only
- concurrency safe
- read permission gate
- max result size: 100,000 chars

지원 operation:

- `goToDefinition`
- `findReferences`
- `hover`
- `documentSymbol`
- `workspaceSymbol`
- `goToImplementation`
- `prepareCallHierarchy`
- `incomingCalls`
- `outgoingCalls`

모든 operation은 `filePath`, 1-based `line`, 1-based `character`를 받는다. 내부 LSP request에서는 0-based position으로 변환한다.

## LSPTool validation

validation은 두 단계다.

1. `schemas.ts`의 discriminated union으로 operation별 입력을 검증한다.
2. file path에 대한 filesystem validation을 수행한다.

파일 validation:

- `expandPath()`로 absolute path를 만든다.
- UNC path는 permission 전 filesystem I/O를 피한다.
- path가 존재하지 않으면 실패한다.
- path가 regular file이 아니면 실패한다.

이후 `checkReadPermissionForTool()`로 read permission을 확인한다.

## LSPTool call lifecycle

call 흐름:

1. LSP manager initialization이 pending이면 기다린다.
2. manager가 없으면 user-facing error result를 반환한다.
3. operation을 LSP method/params로 변환한다.
4. file이 LSP server에 열려 있지 않으면 file content를 읽고 `didOpen`을 보낸다.
5. file size가 10MB를 넘으면 LSP analysis를 중단하고 안내 result를 반환한다.
6. `manager.sendRequest()`로 LSP request를 보낸다.
7. incoming/outgoing call은 먼저 `prepareCallHierarchy`를 호출하고, 첫 item으로 실제 call hierarchy request를 다시 보낸다.
8. definition/reference/implementation/workspaceSymbol 결과에서는 gitignored file location을 제거한다.
9. operation별 formatter로 model-facing string과 count metadata를 만든다.

method mapping:

- `goToDefinition` -> `textDocument/definition`
- `findReferences` -> `textDocument/references`
- `hover` -> `textDocument/hover`
- `documentSymbol` -> `textDocument/documentSymbol`
- `workspaceSymbol` -> `workspace/symbol` with empty query
- `goToImplementation` -> `textDocument/implementation`
- call hierarchy -> `textDocument/prepareCallHierarchy`, then `callHierarchy/incomingCalls` 또는 `callHierarchy/outgoingCalls`

## LSP result formatting

`formatters.ts`는 LSP raw result를 model-facing text로 줄인다.

핵심:

- URI는 가능하면 cwd-relative path로 줄인다.
- relative path가 더 길거나 `../../` 밖으로 나가면 absolute-like path를 유지한다.
- `LocationLink`는 `Location`으로 통일한다.
- malformed URI/result는 logging하고 가능한 결과만 남긴다.
- reference/workspace/call result는 file 단위로 group한다.
- symbol kind numeric enum을 readable string으로 바꾼다.
- document symbol은 hierarchical outline을 보존한다.
- call hierarchy는 call site line/character를 포함한다.

`symbolContext.ts`는 UI용 symbol extraction을 위해 파일 앞 64KB만 sync read한다. 이 값은 model result가 아니라 tool use display 개선용이다.

## LSP manager와 server lifecycle

`manager.ts`는 LSP server manager singleton을 관리한다.

상태:

- `not-started`
- `pending`
- `success`
- `failed`

특징:

- bare/simple mode에서는 LSP를 시작하지 않는다.
- startup을 막지 않기 위해 async initialization을 background로 시작한다.
- generation counter로 stale initialization promise가 state를 덮어쓰지 못하게 한다.
- plugin refresh 후 reinitialize를 지원한다.
- shutdown 실패는 logging하되 state는 정리한다.

`LSPServerManager.ts`는 extension별 server routing과 file sync를 맡는다.

핵심:

- config의 `extensionToLanguage`로 extension -> server map을 만든다.
- server instance는 config load 시 만들지만 실제 server start는 first use 시 lazy하게 한다.
- `workspace/configuration` request에는 null config를 돌려 protocol을 만족시킨다.
- `openFile()`은 `textDocument/didOpen`을 보내고 file URI -> server name을 기록한다.
- `changeFile()`은 file이 열려 있지 않으면 먼저 open한다.
- `saveFile()`은 `textDocument/didSave`를 보내 diagnostics를 트리거한다.
- `closeFile()`은 구현돼 있지만 compact flow와 아직 연결되지 않았다.

`FileWriteTool`/`FileEditTool`이 write 후 LSP `changeFile()`/`saveFile()`을 호출하는 구조와 연결해서 봐야 한다.

## LSP diagnostics

`LSPDiagnosticRegistry.ts`는 LSP server가 비동기로 보내는 `publishDiagnostics`를 conversation attachment로 넘기기 위한 registry다.

핵심:

- pending diagnostics는 UUID key로 저장된다.
- delivered diagnostics는 file URI별 LRU cache로 cross-turn dedup한다.
- dedup key는 message, severity, range, source, code다.
- file당 최대 10개, 전체 최대 30개 diagnostic으로 제한한다.
- severity는 Error, Warning, Info, Hint 순서로 정렬한다.
- file edit 후에는 해당 file의 delivered diagnostics를 clear해 새 diagnostic이 다시 보이게 한다.

Agentica 적용:

- tool call 결과만이 아니라 외부 subsystem이 뒤늦게 보내는 diagnostic/feedback channel이 필요할 수 있다.
- validation error와 runtime diagnostic은 구분해야 한다.
- diagnostics는 dedup/cap/sort 없이 history에 계속 넣으면 context를 오염시킨다.

## TaskStopTool

`TaskStopTool`은 running background task를 중단하는 control tool이다.

Tool contract:

- name: `TaskStop`
- alias: `KillShell`
- `shouldDefer: true`
- concurrency safe
- max result size: 100,000 chars
- input: optional `task_id`, deprecated `shell_id`
- output: `message`, `task_id`, `task_type`, optional `command`

validation:

- `task_id` 또는 `shell_id` 중 하나가 필요하다.
- app state에 task가 있어야 한다.
- task status가 `running`이어야 한다.

call 실행:

- deprecated `shell_id`를 `task_id` fallback으로 받는다.
- `stopTask()` 공통 로직을 호출한다.
- result는 JSON string으로 tool result block에 들어간다.

`tasks/stopTask.ts`의 공통 로직:

1. app state에서 task를 찾는다.
2. running이 아니면 `StopTaskError`를 던진다.
3. task type별 implementation을 찾아 `kill()`을 호출한다.
4. local shell task는 exit code 137 같은 noisy notification을 suppress하고, SDK terminated event는 직접 emit한다.
5. agent task는 partial result notification이 중요하므로 suppress하지 않는다.

Agentica 적용:

- async operation runtime에는 start/output/read/stop이 모두 별도 transition이어야 한다.
- cancellation은 단순 failure가 아니라 user/control action이다.
- local shell과 sub-agent처럼 task type별 stop semantics가 다를 수 있다.
- stop 결과는 UI notification, SDK event, LLM-facing result가 다를 수 있다.

## 독립 LS tool 여부

`src/tools` 목록에서 독립 `LS`/directory listing tool은 확인되지 않았다. directory listing이나 `ls` command path safety는 주로 `BashTool/pathValidation.ts`의 read command handling에 포함된다. 따라서 향후 "LS" 분석은 standalone tool 분석이 아니라 BashTool path command/read-only validation 보강으로 다루는 것이 맞다.

## 종합 결론

1. Claude Code의 LSP는 optional semantic retrieval layer다. core search/RAG의 필수 경로가 아니라, 있으면 더 좋은 code intelligence channel로 보는 편이 맞다.
2. LSP result는 raw protocol object가 아니라 relative path, file grouping, count, gitignore filtering을 거친 model-facing text로 projection된다.
3. diagnostics는 asynchronous attachment이며 dedup/cap/sort가 필수다.
4. task stop은 operation cancellation state machine의 근거다. 실패/abort/stop/timeout을 한 가지 error로 뭉개면 안 된다.
5. Agentica Next에 적용할 때도 public event/history를 먼저 늘리기보다 internal runtime transition과 result projection부터 둔다.
