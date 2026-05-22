# 완성 조건과 검증 기준

## 최종 목표

사용자 목표는 Claude Code snapshot과 Agentica 저장소의 모든 관련 코드를 전수정독하고, reference 조사와 사고실험을 거쳐, 향후 새 세션이 `.wiki`만 읽고도 작업을 완수할 수 있을 정도의 계획서와 지식저장소를 만드는 것이다.

## 완료로 인정할 수 있는 조건

아래가 모두 충족되어야 완료다.

1. Agentica 저장소의 모든 workspace/package가 문서화되어 있다.
2. `packages/core`의 public facade, context, operation, orchestrate, history/event/json, request, functional controller 경로가 세부 문서화되어 있다.
3. `MicroAgentica` 비변경 원칙과 그 이유가 반복 가능하게 문서화되어 있다.
4. `@agentica/vector-selector`의 현 구조, DBMS/embedding 의존성, 대체/격리 전략이 문서화되어 있다.
5. Claude Code의 query loop, tool contract, context compaction, deferred tool search, memory/skill, sub-agent, permission/security 관련 구조가 Agentica 적용 관점으로 정리되어 있다.
6. Agentica Next 구현 계획이 phase별 파일 단위 변경 계획, API 초안, migration 전략, compatibility 전략, test 전략을 포함한다.
7. 각 설계 주장에는 근거 파일 또는 reference가 연결되어 있다.
8. 미독해 영역이 남아 있으면 완료가 아니다.
9. Claude Code source, Agentica source, `.wiki` 설계를 세 축으로 대조한 총괄 리뷰가 있어야 한다.

## 현재 완료 상태

- Agentica의 `packages/chat` renderer와 package-local examples, `packages/cli`, `packages/create-agentica`, `website`, `articles`, `docs`는 1차 문서화했다.
- Agentica `test`는 runner, feature tests, CLI/examples/internal fixture까지 1차 문서화했다.
- Claude Code의 query loop, deferred ToolSearch/schema loading, Plan/Config/Skill/Web/MCP/Team/Schedule/RemoteTrigger 도구군, MCP service/Skill/Plugin loading, MCP auth/UI/approval/control-plane, MCP SDK/in-process transport, plugin marketplace/install/update runtime, plugin UI/validation/MCPB/cache/reload/startup runtime, task/coordinator runtime, remote/bridge/server/CLI transport/runtime, state/swarm runtime, UI adapter/Ink renderer 세부, PowerShell/REPL/platform shell runtime, BashTool execution/sandbox/output runtime, BashTool legacy security/parser-trust runtime, tool permission control flow, compact/context/memory slash command runtime, slash command catalog와 heavy UI/internal command 예외는 문서화했다. plugin validate 전용 fixture/test bundle은 전체 snapshot 검색 결과 확인되지 않아 Agentica 자체 fixture pack 필요로 정리했다.
- 외부 reference 조사는 `02-research/external-references.md`에 1차 정리했다.
- 구현 단계별 세부 test matrix는 `03-design/agentica-next/verification-strategy.md`에 문서화했고, source-specific 검증 항목은 각 연구 문서와 연결했다.
- 세 축 대조와 최종 우선순위는 `00-governance/total-review.md`에 정리했다.

## 잔여 주의

- 공개 snapshot에 구현 파일이 없는 feature-gated seam은 "미독해"가 아니라 "구현 미포함"으로 기록한다. 예: `services/skillSearch/*`, `skills/mcpSkills.ts`, 독립 `LocalWorkflowTask`/`MonitorMcpTask`.
- plugin validate 전용 fixture/test bundle은 snapshot 전체 검색 결과 확인되지 않았다. Agentica는 자체 validator fixture pack을 만들어야 한다.
- 실제 구현 PR에서는 `.wiki` 설계를 그대로 대량 구현하지 말고 phase별 작은 PR로 쪼갠다.

## 완료 감사 방법

완료 선언 전 다음 명령과 문서 검사를 수행한다.

```bash
find .wiki -type f | sort
git status --short
find packages benchmark test website docs articles -type f | sort
rg "\| .* \| 부분 \||\| .* \| 대기 \||추가 독해 필요|현재 미완료 사유" .wiki | rg -v "00-governance/(completion-criteria|reading-ledger)"
```

`reading-ledger.md`에 `대기` 또는 핵심 영역의 `부분`이 남아 있으면 목표는 완료가 아니다.
