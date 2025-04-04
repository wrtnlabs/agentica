import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";

import type { IAgenticaController } from "./IAgenticaController";
import type { IAgenticaVendor } from "./IAgenticaVendor";
import type { IMicroAgenticaConfig } from "./IMicroAgenticaConfig";

export interface IMicroAgenticaProps<Model extends ILlmSchema.Model> {
  model: Model;

  vendor: IAgenticaVendor;

  controllers: IAgenticaController<Model>[];

  config?: IMicroAgenticaConfig<Model>;

  histories?: IAgenticaPromptJson[];
}
