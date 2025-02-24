import { Primitive } from "typia";

import { IAgenticaOperation } from "../structures/IAgenticaOperation";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { AgenticaPromptFactory } from "./AgenticaPromptFactory";

export namespace AgenticaPromptTransformer {
  export const transform = (props: {
    operations: Map<string, Map<string, IAgenticaOperation>>;
    input: Primitive<IAgenticaPrompt>;
  }): IAgenticaPrompt => {
    // TEXT
    if (props.input.type === "text") return props.input;
    // SELECT & CANCEL
    else if (props.input.type === "select" || props.input.type === "cancel")
      return {
        ...props.input,
        operations: props.input.operations.map((func) =>
          AgenticaPromptFactory.selection({
            ...findOperation({
              operations: props.operations,
              input: func,
            }),
            reason: func.reason,
          }),
        ),
      } satisfies IAgenticaPrompt.ISelect | IAgenticaPrompt.ICancel;
    // EXECUTE
    else if (props.input.type === "execute")
      return transformExecute({
        operations: props.operations,
        input: props.input,
      }) satisfies IAgenticaPrompt.IExecute;
    // DESCRIBE
    return {
      type: "describe",
      text: props.input.text,
      executions: props.input.executions.map((next) =>
        transformExecute({
          operations: props.operations,
          input: next,
        }),
      ),
    } satisfies IAgenticaPrompt.IDescribe;
  };

  const transformExecute = (props: {
    operations: Map<string, Map<string, IAgenticaOperation>>;
    input: Primitive<IAgenticaPrompt.IExecute>;
  }): IAgenticaPrompt.IExecute => {
    const operation = findOperation({
      operations: props.operations,
      input: props.input,
    });
    return AgenticaPromptFactory.execute({
      type: "execute",
      protocol: operation.protocol as "http",
      controller: operation.controller,
      function: operation.function,
      id: props.input.id,
      name: props.input.name,
      arguments: props.input.arguments,
      value: props.input.value,
    });
  };

  const findOperation = (props: {
    operations: Map<string, Map<string, IAgenticaOperation>>;
    input: {
      controller: string;
      function: string;
    };
  }): IAgenticaOperation.IHttp => {
    const found: IAgenticaOperation | undefined = props.operations
      .get(props.input.controller)
      ?.get(props.input.function);
    if (found === undefined)
      throw new Error(
        `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
      );
    return found as IAgenticaOperation.IHttp;
  };
}
