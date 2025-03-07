import {
  Agentica,
  IAgenticaController,
  IAgenticaEvent,
  IAgenticaPrompt,
} from "@agentica/core";
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

export async function test_base_streaming_describe(): Promise<void | false> {
  if (!TestGlobal.env.CHATGPT_API_KEY) return false;

  // 이벤트 추적을 위한 변수들
  const events: IAgenticaEvent<"chatgpt">[] = [];
  let functionCalled = false;
  const streamContentPieces: string[] = [];
  let describeEventReceived = false;
  let describeStreamProcessed = false;

  // 계산기 컨트롤러 생성
  const calculatorController: IAgenticaController<"chatgpt"> = {
    protocol: "class",
    name: "calculator",
    application: typia.llm.application<Calculator, "chatgpt">(),
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

  // 이벤트 리스너 등록 - 도구 호출 관련 이벤트
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

  // describe 이벤트 리스너 추가
  agent.on("describe", async (event) => {
    events.push(event);
    describeEventReceived = true;
    console.log(4);
    // describe 이벤트의 스트림 처리
    if (event.stream) {
      describeStreamProcessed = true;
      const reader = event.stream.getReader();
      console.log(2);
      while (true) {
        const { done, value } = await reader.read().catch((e) => {
          console.error(e);
          return { done: true, value: undefined };
        });
        console.log(done, value);
        if (done) break;

        // 스트림 청크에서 텍스트 콘텐츠 추출
        try {
          console.log(value);
          if (typeof value === "string") {
            // 문자열인 경우 직접 저장
            streamContentPieces.push(value);
          } else {
            console.error(value);
            throw new Error(
              "describe 스트림 처리 중 오류: value가 String이 아님, 즉 스트림이 String stream이 아님",
            );
          }
        } catch (err) {
          console.error("describe 스트림 처리 중 오류:", err);
        }
      }

      // 스트림에서 콘텐츠를 받았는지 확인
      if (streamContentPieces.length === 0) {
        throw new Error("describe 스트림에서 콘텐츠가 수신되지 않았습니다");
      }
    }
  });

  // 테스트를 위한 숫자 설정
  const a = 5123123123;
  const b = 3412342134;
  console.log(1);
  // 대화 시작 - 함수 호출을 유도하면서 추가 설명 요청
  const result: IAgenticaPrompt<"chatgpt">[] = await agent.conversate(
    `${a}와 ${b}를 더해주세요. 그리고 덧셈이 무엇인지 간단히 설명해주세요. calculator를 사용하세요.`,
  );

  // describe 이벤트 발생 확인
  if (!describeEventReceived) {
    throw new Error("describe 이벤트가 발생하지 않았습니다");
  }

  // describe 스트림 처리 확인
  if (!describeStreamProcessed) {
    throw new Error("describe 이벤트의 스트림이 처리되지 않았습니다");
  }

  // 함수 호출 확인
  if (!functionCalled) {
    throw new Error("대화 중 함수가 호출되지 않았습니다");
  }

  // 실행 결과 확인
  const executeEvent = events.find((e) => e.type === "execute");
  if (!executeEvent) {
    throw new Error("실행 이벤트를 찾을 수 없습니다");
  }

  if (executeEvent.value !== a + b) {
    throw new Error(
      `결과가 ${a + b}이어야 하는데, ${executeEvent.value}를 받았습니다`,
    );
  }

  // AI 응답 확인
  const aiResponse = result.find((prompt) => prompt.type === "describe");

  // 스트림 콘텐츠와 최종 응답 콘텐츠 비교
  const combinedStreamContent = streamContentPieces.join("");
  if (
    combinedStreamContent.length === 0 ||
    !aiResponse?.text.includes(combinedStreamContent.substring(0, 10))
  ) {
    console.log("text:", aiResponse?.text, "combined:", combinedStreamContent);
    throw new Error(
      "describe 스트림 콘텐츠가 최종 응답 콘텐츠와 일치하지 않습니다",
    );
  }

  // describe 이벤트 내용 확인
  const describeEvent = events.find((e) => e.type === "describe");
  if (!describeEvent) {
    throw new Error("describe 이벤트를 찾을 수 없습니다");
  }

  // describe 이벤트에 executions 배열이 포함되어 있는지 확인
  if (!describeEvent.executions || describeEvent.executions.length === 0) {
    throw new Error("describe 이벤트에 executions 정보가 없습니다");
  }

  // calculator 도구 호출이 포함되어 있는지 확인
  const hasCalculatorExecution = describeEvent.executions.some(
    (execution) => execution.name === "calculator",
  );
  if (!hasCalculatorExecution) {
    throw new Error(
      "describe 이벤트에 calculator 도구 호출 정보가 포함되어 있지 않습니다",
    );
  }

  // 스트림과 join 함수가 존재하는지 확인
  if (!describeEvent.stream || typeof describeEvent.join !== "function") {
    throw new Error("describe 이벤트에 stream이나 join 함수가 없습니다");
  }

  // join 함수를 통해 텍스트 콘텐츠 확인
  const describeText = await describeEvent.join();
  if (!describeText || describeText.length < 5) {
    throw new Error(
      "describe 이벤트의 텍스트 내용이 너무 짧거나 비어 있습니다",
    );
  }
}
