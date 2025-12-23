import type {
  AgenticaOperationSelection,
  AgenticaTokenUsage,
  IAgenticaConfig,
  IAgenticaVendor,
  IMicroAgenticaConfig,
} from "@agentica/core";

import { Typography } from "@mui/material";

import { AgenticaChatFunctionStackSideMovie } from "./AgenticaChatFunctionStackSideMovie";
import { AgenticaChatTokenUsageSideMovie } from "./AgenticaChatTokenUsageSideMovie";

export function AgenticaChatSideMovie(props: AgenticaChatSideMovie.IProps) {
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
          Vendor Model:
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
  export interface IProps {
    vendor: IAgenticaVendor;
    config: IAgenticaConfig | IMicroAgenticaConfig | undefined;
    usage: AgenticaTokenUsage;
    selections: AgenticaOperationSelection[];
    error: Error | null;
  }
}
