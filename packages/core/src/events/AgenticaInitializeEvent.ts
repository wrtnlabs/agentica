import { IAgenticaEvent } from "../json/IAgenticaEvent";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaInitializeEvent extends AgenticaEventBase<"initialize"> {
  public constructor() {
    super("initialize");
  }

  public toJSON(): IAgenticaEvent.IInitialize {
    return {
      type: "initialize",
    };
  }
}
