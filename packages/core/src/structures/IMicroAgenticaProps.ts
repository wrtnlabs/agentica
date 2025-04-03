import type { ILlmSchema } from "@samchon/openapi";
import type { IAgenticaVendor } from "./IAgenticaVendor";
import type { IAgenticaController } from "./IAgenticaController";
import type { IMicroAgenticaConfig } from "./IMicroAgenticaConfig";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";

export interface IMicroAgenticaProps<Model extends ILlmSchema.Model> {
  model: Model;

  vendor: IAgenticaVendor;

  controllers: IAgenticaController<Model>[];

  config?: IMicroAgenticaConfig<Model>;

  histories?: IAgenticaPromptJson[];
}
