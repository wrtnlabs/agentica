import type {
  AgenticaOperationSelection,
  AgenticaTokenUsage,
  IAgenticaConfig,
  IAgenticaVendor,
} from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { Typography } from "@mui/material";

import { AgenticaChatFunctionStackSideMovie } from "./AgenticaChatFunctionStackSideMovie";
import { AgenticaChatTokenUsageSideMovie } from "./AgenticaChatTokenUsageSideMovie";

export function AgenticaChatSideMovie<Model extends ILlmSchema.Model>(props: AgenticaChatSideMovie.IProps<Model>) {
  return (
    <div
      style={{
        padding: 25,
      }}
    >
      {props.error !== null
        ? (
            <>
              <Typography variant="h5" color="error">
                OpenAI Error
              </Typography>
              <hr />
              {props.error.message}
              <br />
              <br />
              Your OpenAI API key may not valid.
              <br />
              <br />
              <br />
            </>
          )
        : null}
      <Typography variant="h5">Agent Information</Typography>
      <hr />
      <ul>
        <li>
          Model:
          {" "}
          {props.vendor.model}
        </li>
        <li>
          Locale:
          {" "}
          {props.config?.locale ?? navigator.language}
        </li>
        <li>
          Timezone:
          {" "}
          {props.config?.timezone
            ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
        </li>
      </ul>
      <br />
      <br />
      <AgenticaChatTokenUsageSideMovie usage={props.usage} />
      <br />
      <br />
      <AgenticaChatFunctionStackSideMovie selections={props.selections} />
    </div>
  );
}
export namespace AgenticaChatSideMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    vendor: IAgenticaVendor;
    config: IAgenticaConfig<Model> | undefined;
    usage: AgenticaTokenUsage;
    selections: AgenticaOperationSelection<Model>[];
    error: Error | null;
  }
}
