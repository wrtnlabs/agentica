import { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaInitializeEvent extends AgenticaEventBase<"initialize"> {
  public constructor() {
    super("initialize");
  }

  public toJSON(): IAgenticaEventJson.IInitialize {
    return {
      type: "initialize",
    };
  }
}
