import type { IAgenticaPromptJson } from "./IAgenticaPromptJson";

export type IMicroAgenticaPromptJson =
  | IAgenticaPromptJson.IText
  | IAgenticaPromptJson.IExecute
  | IAgenticaPromptJson.IDescribe;
