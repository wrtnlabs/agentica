import { AgenticaConstant } from "../constants/AgenticaConstant";

export class AgenticaJsonParseError extends Error {
  public readonly arguments: string;
  public readonly reason: string;

  public constructor(props: AgenticaJsonParseError.IProps) {
    super(`Invalid JSON format. The parsing failed after ${AgenticaConstant.RETRY} retries.`);

    const proto = new.target.prototype;

    // eslint-disable-next-line
    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, proto);
    }
    else {
      // eslint-disable-next-line
      (this as any).__proto__ = proto; 
    }

    this.arguments = props.arguments;
    this.reason = props.reason;
  }

  public get name(): "AgenticaValidationError" {
    return "AgenticaValidationError";
  }

  public toJSON(): AgenticaJsonParseError.IJson {
    return {
      name: "AgenticaValidationError",
      message: this.message,
      arguments: this.arguments,
      reason: this.reason,
    };
  }
}
export namespace AgenticaJsonParseError {
  export interface IProps {
    arguments: string;
    reason: string;
  }
  export interface IJson extends IProps {
    name: "AgenticaValidationError";
    message: string;
  }
}
