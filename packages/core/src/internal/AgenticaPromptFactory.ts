import { IAgenticaOperationSelection } from "../structures/IAgenticaOperationSelection";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";

export namespace AgenticaPromptFactory {
  export const execute = (
    props: Omit<IAgenticaPrompt.IExecute, "toJSON">,
  ): IAgenticaPrompt.IExecute =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IAgenticaPrompt.IExecute;

  export const selection = (
    props: Omit<IAgenticaOperationSelection, "toJSON">,
  ): IAgenticaOperationSelection =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IAgenticaOperationSelection;
}
