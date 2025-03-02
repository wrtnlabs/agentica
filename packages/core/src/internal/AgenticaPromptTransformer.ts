import { ILlmSchema } from "@samchon/openapi";
import { Primitive } from "typia";

import { IAgenticaOperation } from "../structures/IAgenticaOperation";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { AgenticaPromptFactory } from "./AgenticaPromptFactory";

export namespace AgenticaPromptTransformer {
  export const transform = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, IAgenticaOperation<Model>>>;
    input: Primitive<IAgenticaPrompt<Model>>;
  }): IAgenticaPrompt<Model> => {
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
      } satisfies
        | IAgenticaPrompt.ISelect<Model>
        | IAgenticaPrompt.ICancel<Model>;
    // EXECUTE
    else if (props.input.type === "execute")
      return transformExecute({
        operations: props.operations,
        input: props.input,
      }) satisfies IAgenticaPrompt.IExecute<Model>;
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
    } satisfies IAgenticaPrompt.IDescribe<Model>;
  };

  const transformExecute = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, IAgenticaOperation<Model>>>;
    input: Primitive<IAgenticaPrompt.IExecute<Model>>;
  }): IAgenticaPrompt.IExecute<Model> => {
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

  const findOperation = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, IAgenticaOperation<Model>>>;
    input: {
      controller: string;
      function: string;
    };
  }): IAgenticaOperation.IHttp<Model> => {
    const found: IAgenticaOperation<Model> | undefined = props.operations
      .get(props.input.controller)
      ?.get(props.input.function);
    if (found === undefined)
      throw new Error(
        `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
      );
    return found as IAgenticaOperation.IHttp<Model>;
  };
}
