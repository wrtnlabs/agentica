import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaOperationSelection } from "../structures/IAgenticaOperationSelection";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";

export namespace AgenticaPromptFactory {
  export const execute = <Model extends ILlmSchema.Model>(
    props: Omit<IAgenticaPrompt.IExecute<Model>, "toJSON">,
  ): IAgenticaPrompt.IExecute<Model> =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IAgenticaPrompt.IExecute<Model>;

  export const selection = <Model extends ILlmSchema.Model>(
    props: Omit<IAgenticaOperationSelection<Model>, "toJSON">,
  ): IAgenticaOperationSelection<Model> =>
    ({
      ...props,
      toJSON: () =>
        ({
          ...props,
          controller: props.controller.name,
          function: props.function.name,
        }) as any,
    }) as IAgenticaOperationSelection<Model>;
}
