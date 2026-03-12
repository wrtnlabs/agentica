import type { IJsonParseResult } from "typia";

import { dedent } from "@typia/utils";

import { AgenticaConstant } from "../constants/AgenticaConstant";

export class AgenticaJsonParseError extends Error {
  public readonly failure: IJsonParseResult.IFailure;

  public constructor(failure: IJsonParseResult.IFailure) {
    super(
      dedent`
        Invalid JSON format. The parsing failed after ${AgenticaConstant.RETRY} retries.

        \`\`\`json
        ${JSON.stringify(failure, null, 2)}
        \`\`\`
      `,
    );

    const proto = new.target.prototype;

    // eslint-disable-next-line
    if (Object.setPrototypeOf) { 
      Object.setPrototypeOf(this, proto);
    }
    else {
      // eslint-disable-next-line
      (this as any).__proto__ = proto; 
    }
    this.failure = failure;
  }

  public get name(): "AgenticaJsonParseError" {
    return "AgenticaJsonParseError";
  }

  public toJSON(): AgenticaJsonParseError.IJson {
    return {
      name: "AgenticaJsonParseError",
      failure: this.failure,
      message: this.message,
    };
  }
}
export namespace AgenticaJsonParseError {
  export interface IJson {
    name: "AgenticaJsonParseError";
    failure: IJsonParseResult.IFailure;
    message: string;
  }
}
