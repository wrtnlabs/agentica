import type { AgenticaEvent, IAgenticaController } from "@agentica/core";
import { Agentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { TestGlobal } from "../TestGlobal";

// 간단한 계산기 컨트롤러를 생성
class Calculator {
  /**
   * 두 숫자를 더합니다.
   *
   * @param params 더할 두 숫자
   * @returns 두 숫자의 합
   */
  public add(params: { a: number; b: number }): number {
    return params.a + params.b;
  }

  /**
   * 첫 번째 숫자에서 두 번째 숫자를 뺍니다.
   *
   * @param params 연산할 두 숫자
   * @returns 뺄셈 결과
   */
  public subtract(params: { a: number; b: number }): number {
    return params.a - params.b;
  }
}

export async function test_base_work_describe(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  // 이벤트 추적을 위한 변수들
  const events: AgenticaEvent<"chatgpt">[] = [];
  let functionCalled = false;

  // 계산기 컨트롤러 생성
  const calculatorController: IAgenticaController<"chatgpt"> = {
    protocol: "class",
    name: "calculator",
    application: typia.llm.applicationOfValidate<Calculator, "chatgpt">(),
    execute: new Calculator(),
  };

  // Agentica 인스턴스 생성
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
    },
    controllers: [calculatorController],
  });

  // 이벤트 리스너 등록
  agent.on("select", (event) => {
    events.push(event);
  });

  agent.on("call", (event) => {
    events.push(event);
    if (event.operation.name === "add" || event.operation.name === "subtract") {
      functionCalled = true;
    }
  });

  agent.on("execute", (event) => {
    events.push(event);
  });

  const a = 5123123123;
  const b = 3412342134;
  // 대화 시작 - 함수 호출을 유도하는 메시지
  await agent.conversate(
    `Could you add ${a} and ${b} for me?; You should use calculator`,
  );

  // 함수 호출 확인
  if (!functionCalled) {
    throw new Error("Function was not called during conversation");
  }

  // 결과 확인
  const executeEvent = events.find(e => e.type === "execute");

  if (executeEvent === undefined) {
    throw new Error("Execute event not found");
  }

  if (executeEvent.value !== a + b) {
    throw new Error(
      `Expected result to be ${a + b}, but got ${executeEvent.value as string}`,
    );
  }
}
