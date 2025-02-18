import { IWrtnAgentOperationSelection } from "../structures/IWrtnAgentOperationSelection";
import { IWrtnAgentPrompt } from "../structures/IWrtnAgentPrompt";

export namespace WrtnAgentPromptFactory {
  export const execute = (
    props: Omit<IWrtnAgentPrompt.IExecute, "toJSON">,
  ): IWrtnAgentPrompt.IExecute =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IWrtnAgentPrompt.IExecute;

  export const selection = (
    props: Omit<IWrtnAgentOperationSelection, "toJSON">,
  ): IWrtnAgentOperationSelection =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IWrtnAgentOperationSelection;
}
