# Agentica Functional/Controller 계약

이 문서는 `packages/core/src/functional/*`와 `packages/core/src/structures/*`를 읽고 정리한 현재 controller 계약이다.

## Controller 종류

`IAgenticaController`는 세 protocol의 union이다.

| protocol | controller | application | executor |
| --- | --- | --- | --- |
| `http` | `IAgenticaController.IHttp` | `IHttpLlmApplication` | optional `execute({ connection, application, function, arguments })` |
| `class` | `IAgenticaController.IClass` | `ILlmApplication` | object instance 또는 callback |
| `mcp` | `IAgenticaController.IMcp` | `ILlmApplication` | MCP client request |

`AgenticaOperationComposer.compose()`는 controller의 application functions를 operation으로 평탄화한다. 동일 function name이 여러 controller에 있으면 operation name은 `_${controllerIndex}_${functionName}` 형태로 바뀐다. 따라서 selector/RAG는 `operation.name`만 보지 말고 `controller.name`, 원본 `function.name`, protocol을 함께 보관해야 한다.

## HTTP functional

`assertHttpController()`와 `validateHttpController()`는 Swagger/OpenAPI v2/v3/v3.1/v3.2 또는 typia `OpenApi.IDocument`를 받아 `OpenApiConverter.upgradeDocument()`로 정규화한 뒤 `HttpLlm.application()`을 만든다.

중요 계약:

- HTTP controller는 `connection`을 반드시 가진다.
- `execute`가 없으면 기본 HTTP 실행 경로가 orchestrate execution에서 처리된다.
- `config`는 `IHttpLlmApplication.IConfig` 일부이며 function calling schema 생성에 영향을 준다.
- deprecated HTTP LLM application 함수도 남아 있다. public export 주석과 JSDoc의 deprecated 표시가 일부 어긋나므로 문서/정리 대상이다.

## MCP functional

`assertMcpController()`와 `validateMcpController()`는 MCP client에 `tools/list`를 요청하고 `IMcpTool[]`로 assert/validate한다. 그 뒤 `createMcpLlmApplication()`이 MCP JSON schema를 typia LLM application으로 변환한다.

`createMcpLlmApplication()` 핵심 단계:

1. `LlmSchemaConverter.getConfig()`로 LLM schema config를 정규화한다.
2. MCP `inputSchema.$defs`를 OpenAPI components로 업그레이드한다.
3. 실제 input schema를 OpenAPI schema로 업그레이드한다.
4. reference visit 결과로 사용된 component schema만 남긴다.
5. `LlmSchemaConverter.parameters()`로 function parameters를 만든다.
6. 각 function에 `validate`, `parse`, `coerce`를 붙인다.

주의점:

- 변환 실패한 MCP tool은 현재 `return`으로 skip된다. 실패가 controller validation failure로 표면화되지 않는다.
- MCP tool name은 `@maxLength 64`로 문서화되어 있다.
- MCP SDK는 peer dependency 방식이라 SDK가 없으면 type-check가 약해진다는 경고가 있다.

## Agentica props/config

`IAgenticaProps`는 `vendor`, `controllers`, optional `config`, `histories`, `tokenUsage`를 받는다.

`IAgenticaConfigBase`:

- `locale`
- `timezone`
- `retry`
- `backoffStrategy`
- `stream`

`IAgenticaConfig` 추가:

- `executor`: 전체 executor 함수 또는 partial internal agents
- `systemPrompt`
- `capacity`: operation selection divide and conquer 단위
- `eliticism`: divide 결과 후보를 다시 정제할지 결정

`IAgenticaVendor`는 OpenAI SDK-compatible client를 전제로 한다. `baseURL`을 통해 Claude/Gemini/OpenRouter류를 붙일 수 있으나, schema model과 provider option 차이는 별도 adapter 없이 그대로 노출되어 있다.

## MicroAgentica 경계

`IMicroAgenticaProps`와 `IMicroAgenticaConfig`는 Agentica와 많은 구조를 공유하지만 executor는 `call`, `describe`만 가진다. 사용자가 명시한 현 방침은 MicroAgentica 변경 금지다.

허용:

- 공용 type을 읽고 영향 범위를 파악한다.
- Agentica용 새 runtime 설계를 할 때 MicroAgentica public event/history union을 깨지 않는지 확인한다.

금지:

- MicroAgentica orchestration 단순성을 Agentica Next로 끌어오려는 명목으로 변경하지 않는다.
- 새 selector/compact/runtime 상태를 MicroAgentica constructor/config에 얹지 않는다.

## Agentica Next 적용 메모

새 runtime은 controller contract를 갈아엎으면 안 된다. 도입 순서는 다음이 안전하다.

1. `AgenticaOperation` 위에 별도 metadata index를 추가한다.
2. `operation.name` 충돌 보정 규칙을 보존한다.
3. HTTP/class/MCP operation을 모두 같은 local index에 넣되 protocol-specific facets를 가진다.
4. selector는 operation 원본을 수정하지 않고 `AgenticaOperationSelection`만 만든다.
5. MCP conversion failure 정책은 별도 이슈로 분리한다. selector 개편과 동시에 처리하면 원인 추적이 어려워진다.
