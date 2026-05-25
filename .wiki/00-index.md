# Agentica Wiki Index

이 폴더는 저장소를 이해하고 변경하는 과정에서 확인한 지식을 누적하는 작업용 위키입니다.

## 운영 원칙

- 작업 중 새로 확인한 구조, 규칙, 설계 의도, 반복 절차는 관련 문서에 반영한다.
- 단순 작업 로그와 장기 지식은 분리한다.
- 코드 변경과 직접 관련 없는 추측은 기록하지 않고, 확인된 사실과 합리적 추론을 구분한다.
- 문서는 작게 유지하되, 같은 주제가 커지면 하위 문서로 분리한다.

## 권장 독서 순서

구현자는 전체 세부 문서를 순서대로 읽기 전에 아래 경로를 먼저 읽는다.

1. [전수정독 총괄 리뷰](./00-governance/total-review.md)
2. [Claude Code 최적화 패턴 적용 지도](./03-design/agentica-next/claude-code-optimization-map.md)
3. [Agentica 적용 로드맵](./03-design/agentica-next/roadmap.md)
4. [Agentica Next 아키텍처 청사진](./03-design/agentica-next/architecture-blueprint.md)
5. [Agentica Next 검증 전략](./03-design/agentica-next/verification-strategy.md)
6. 구현 대상별 `02-research`, `03-design`, `04-agentica` 세부 문서

## 문서 지도

- [프로젝트 개요](./01-project/overview.md)
- [워크스페이스 구조](./01-project/workspace.md)
- [위키 운영 매뉴얼](./00-governance/wiki-operating-manual.md)
- [전수정독 진행판](./00-governance/reading-ledger.md)
- [완성 조건과 검증 기준](./00-governance/completion-criteria.md)
- [전수정독 총괄 리뷰](./00-governance/total-review.md)
- [Agentica 소스 인벤토리](./01-project/source-inventory.md)
- [Claude Code 아키텍처 관찰](./02-research/claude-code/architecture.md)
- [Claude Code 소스 인벤토리](./02-research/claude-code/source-inventory.md)
- [외부 Reference 조사](./02-research/external-references.md)
- [Claude Code Query Loop 정밀 분석](./02-research/claude-code/query-loop.md)
- [Claude Code Tool System 정밀 분석](./02-research/claude-code/tool-system.md)
- [Claude Code Context/RAG/Memory 분석](./02-research/claude-code/context-rag-memory.md)
- [AutoBe 인메모리 RAG 참고](./02-research/autobe/in-memory-rag.md)
- [Claude Code Compact System 정밀 분석](./02-research/claude-code/compact-system.md)
- [Claude Code AgentTool 분석](./02-research/claude-code/agent-tool.md)
- [Claude Code BashTool/Policy 분석](./02-research/claude-code/bash-tool-policy.md)
- [Claude Code PowerShell/REPL/Platform Tools 분석](./02-research/claude-code/powershell-repl-platform-tools.md)
- [Claude Code Tool Permission Control Flow 분석](./02-research/claude-code/tool-permission-control-flow.md)
- [Claude Code Slash Command Runtime 분석](./02-research/claude-code/slash-command-runtime.md)
- [Claude Code Slash Command Catalog 분석](./02-research/claude-code/slash-command-catalog.md)
- [Claude Code File/Search/Edit 도구 분석](./02-research/claude-code/file-search-edit-tools.md)
- [Claude Code Write/Glob/Notebook/Todo/Task 도구 분석](./02-research/claude-code/write-glob-notebook-task-tools.md)
- [Claude Code LSP/Task Control 도구 분석](./02-research/claude-code/lsp-task-control-tools.md)
- [Claude Code Session Control 도구 분석](./02-research/claude-code/session-control-tools.md)
- [Claude Code External Connector 도구 분석](./02-research/claude-code/external-connector-tools.md)
- [Claude Code Team Communication 도구 분석](./02-research/claude-code/team-communication-tools.md)
- [Claude Code MCP Service Runtime 분석](./02-research/claude-code/mcp-service-runtime.md)
- [Claude Code Skill/Plugin Loading 분석](./02-research/claude-code/skill-plugin-loading.md)
- [Claude Code Plugin Marketplace/Install Runtime 분석](./02-research/claude-code/plugin-marketplace-runtime.md)
- [Claude Code Plugin UI/Validation/MCPB/Cache 분석](./02-research/claude-code/plugin-ui-validation-cache.md)
- [Claude Code Task/Coordinator Runtime 분석](./02-research/claude-code/task-coordinator-runtime.md)
- [Claude Code Remote/Bridge/Server Runtime 분석](./02-research/claude-code/remote-bridge-server-runtime.md)
- [Claude Code State/Swarm Runtime 분석](./02-research/claude-code/state-swarm-runtime.md)
- [Claude Code UI Adapter/Ink Runtime 분석](./02-research/claude-code/ui-adapter-ink-runtime.md)
- [Agentica 패키지 인벤토리](./04-agentica/package-inventory.md)
- [Agentica Core 구조 지도](./04-agentica/core-map.md)
- [Agentica Functional/Controller 계약](./04-agentica/core-functional-and-controllers.md)
- [Agentica Event/History/JSON 계약](./04-agentica/events-history-json-contract.md)
- [Agentica RPC/Chat 공개 표면 분석](./04-agentica/rpc-chat-public-surface.md)
- [Agentica Chat Renderer 현재 구조](./04-agentica/chat-renderer-current.md)
- [Agentica 현재 Orchestration/Prompt 구조](./04-agentica/orchestration-current.md)
- [Agentica Core Utils/Request/Streaming 구조](./04-agentica/core-utils-request-streaming.md)
- [Vector Selector 현재 구조](./04-agentica/vector-selector-current.md)
- [Local Selector 구현 현황](./04-agentica/local-selector-implementation.md)
- [Context Projection 구현 현황](./04-agentica/context-projection-implementation.md)
- [Agentica Benchmark/Test 현재 구조](./04-agentica/benchmark-test-current.md)
- [Agentica Test CLI/Examples 현재 구조](./04-agentica/test-cli-examples-current.md)
- [Agentica CLI/Create Scaffold 현재 구조](./04-agentica/cli-scaffold-current.md)
- [Agentica Website/Docs/Articles 현재 구조](./04-agentica/website-docs-current.md)
- [Agentica 영향면 분석](./04-agentica/impact-surfaces.md)
- [Claude Code 최적화 패턴 적용 지도](./03-design/agentica-next/claude-code-optimization-map.md)
- [Agentica 적용 로드맵](./03-design/agentica-next/roadmap.md)
- [Agentica Next 아키텍처 청사진](./03-design/agentica-next/architecture-blueprint.md)
- [Agentica Orchestration 재설계](./03-design/agentica-next/orchestration-design.md)
- [Agentica Sub-agent/Runtime 설계](./03-design/agentica-next/subagent-runtime-design.md)
- [Agentica Operation Policy/State 설계](./03-design/agentica-next/operation-policy-state-design.md)
- [Agentica Runtime Public Surface 설계](./03-design/agentica-next/runtime-public-surface-design.md)
- [Agentica Next 검증 전략](./03-design/agentica-next/verification-strategy.md)
- [로컬 RAG와 함수 선택 설계](./03-design/agentica-next/local-rag-selector.md)
- [컨텍스트 압축 설계](./03-design/agentica-next/context-compaction.md)
- [2026-05-22 작업 로그](./99-worklog/2026-05-22.md)
- [2026-05-24 작업 로그](./99-worklog/2026-05-24.md)
- [2026-05-25 작업 로그](./99-worklog/2026-05-25.md)
