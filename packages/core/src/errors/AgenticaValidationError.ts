import type { IValidation } from "@samchon/openapi";

import { AgenticaConstant } from "../constants/AgenticaConstant";

export class AgenticaValidationError extends Error {
  public readonly arguments: unknown;
  public readonly errors: IValidation.IError[];

  public constructor(props: AgenticaValidationError.IProps) {
    super(`Invalid arguments. The validation failed after ${AgenticaConstant.RETRY} retries.`);

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
    this.errors = props.errors;
  }

  public get name(): "AgenticaValidationError" {
    return "AgenticaValidationError";
  }

  public toJSON(): AgenticaValidationError.IJson {
    return {
      name: "AgenticaValidationError",
      message: this.message,
      arguments: this.arguments,
      errors: this.errors,
    };
  }
}
export namespace AgenticaValidationError {
  export interface IProps {
    arguments: unknown;
    errors: IValidation.IError[];
  }
  export interface IJson extends IProps {
    name: "AgenticaValidationError";
    message: string;
  }
}
