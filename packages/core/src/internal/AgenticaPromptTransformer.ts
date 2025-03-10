import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { IAgenticaPrompt } from "../json/IAgenticaPrompt";
import { AgenticaCancelPrompt } from "../prompts/AgenticaCancelPrompt";
import { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import { AgenticaSelectPrompt } from "../prompts/AgenticaSelectPrompt";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";

export namespace AgenticaPromptTransformer {
  export const transform = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    input: IAgenticaPrompt;
  }): AgenticaPrompt<Model> => {
    // TEXT
    if (props.input.type === "text") return new AgenticaTextPrompt(props.input);
    // SELECT & CANCEL
    else if (props.input.type === "select")
      return new AgenticaSelectPrompt({
        id: props.input.id,
        selections: props.input.selections.map(
          (select) =>
            new AgenticaOperationSelection({
              operation: findOperation({
                operations: props.operations,
                input: select.operation,
              }),
              reason: select.reason,
            }),
        ),
      });
    else if (props.input.type === "cancel")
      return new AgenticaCancelPrompt({
        id: props.input.id,
        selections: props.input.selections.map(
          (select) =>
            new AgenticaOperationSelection({
              operation: findOperation({
                operations: props.operations,
                input: select.operation,
              }),
              reason: select.reason,
            }),
        ),
      });
    // EXECUTE
    else if (props.input.type === "execute")
      return transformExecute({
        operations: props.operations,
        input: props.input,
      });
    // DESCRIBE
    return new AgenticaDescribePrompt({
      text: props.input.text,
      executions: props.input.executions.map((next) =>
        transformExecute({
          operations: props.operations,
          input: next,
        }),
      ),
    });
  };

  const transformExecute = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    input: IAgenticaPrompt.IExecute;
  }): AgenticaExecutePrompt<Model> => {
    const operation: AgenticaOperation<Model> = findOperation({
      operations: props.operations,
      input: props.input.operation,
    });
    return new AgenticaExecutePrompt({
      id: props.input.id,
      operation,
      arguments: props.input.arguments,
      value: props.input.value,
    });
  };

  const findOperation = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    input: {
      controller: string;
      function: string;
    };
  }): AgenticaOperation<Model> => {
    const found: AgenticaOperation<Model> | undefined = props.operations
      .get(props.input.controller)
      ?.get(props.input.function);
    if (found === undefined)
      throw new Error(
        `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
      );
    return found;
  };
}
