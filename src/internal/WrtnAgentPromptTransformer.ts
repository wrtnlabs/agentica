import { Primitive } from "typia";

import { IWrtnAgentOperation } from "../structures/IWrtnAgentOperation";
import { IWrtnAgentPrompt } from "../structures/IWrtnAgentPrompt";
import { WrtnAgentPromptFactory } from "./WrtnAgentPromptFactory";

export namespace WrtnAgentPromptTransformer {
  export const transform = (props: {
    operations: Map<string, Map<string, IWrtnAgentOperation>>;
    input: Primitive<IWrtnAgentPrompt>;
  }): IWrtnAgentPrompt => {
    // TEXT
    if (props.input.type === "text") return props.input;
    // SELECT & CANCEL
    else if (props.input.type === "select" || props.input.type === "cancel")
      return {
        ...props.input,
        operations: props.input.operations.map((func) =>
          WrtnAgentPromptFactory.selection({
            ...findOperation({
              operations: props.operations,
              input: func,
            }),
            reason: func.reason,
          }),
        ),
      } satisfies IWrtnAgentPrompt.ISelect | IWrtnAgentPrompt.ICancel;
    // EXECUTE
    else if (props.input.type === "execute")
      return transformExecute({
        operations: props.operations,
        input: props.input,
      }) satisfies IWrtnAgentPrompt.IExecute;
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
    } satisfies IWrtnAgentPrompt.IDescribe;
  };

  const transformExecute = (props: {
    operations: Map<string, Map<string, IWrtnAgentOperation>>;
    input: Primitive<IWrtnAgentPrompt.IExecute>;
  }): IWrtnAgentPrompt.IExecute => {
    const operation = findOperation({
      operations: props.operations,
      input: props.input,
    });
    return WrtnAgentPromptFactory.execute({
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
    operations: Map<string, Map<string, IWrtnAgentOperation>>;
    input: {
      controller: string;
      function: string;
    };
  }): IWrtnAgentOperation.IHttp => {
    const found: IWrtnAgentOperation | undefined = props.operations
      .get(props.input.controller)
      ?.get(props.input.function);
    if (found === undefined)
      throw new Error(
        `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
      );
    return found as IWrtnAgentOperation.IHttp;
  };
}
