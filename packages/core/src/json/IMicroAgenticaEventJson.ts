import type { IAgenticaEventJson } from "./IAgenticaEventJson";

export type IMicroAgenticaEventJson =
  | IAgenticaEventJson.ICall
  | IAgenticaEventJson.IDescribe
  | IAgenticaEventJson.IExecute
  | IAgenticaEventJson.IInitialize
  | IAgenticaEventJson.IRequest
  | IAgenticaEventJson.IText
  | IAgenticaEventJson.IValidate;
