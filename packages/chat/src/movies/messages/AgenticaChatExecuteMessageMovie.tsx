import { IAgenticaPrompt } from "@agentica/core";
import { Typography } from "@mui/material";
import { ILlmSchema } from "@samchon/openapi";
import React from "react";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export const AgenticaChatExecuteMessageMovie = <Model extends ILlmSchema.Model>({
  execute,
}: AgenticaChatExecuteMessageMovie.IProps<Model>) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> {getTitle(execute)} </Typography>
      <hr />
      <Typography variant="h6"> Description </Typography>
      <MarkdownViewer>{execute.function.description}</MarkdownViewer>
      <br />
      <Typography variant="h6"> Arguments </Typography>
      <MarkdownViewer>
        {["```json", JSON.stringify(execute.arguments, null, 2), "```"].join(
          "\n",
        )}
      </MarkdownViewer>
      <br />
      <Typography variant="h6"> Return Value </Typography>
      <MarkdownViewer>
        {["```json", JSON.stringify(execute.value, null, 2), "```"].join("\n")}
      </MarkdownViewer>
    </React.Fragment>
  );
};
export namespace AgenticaChatExecuteMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    execute: IAgenticaPrompt.IExecute<Model>;
  }
}

const getTitle = <Model extends ILlmSchema.Model>(
  exec: IAgenticaPrompt.IExecute<Model>,
) =>
  exec.protocol === "http"
    ? `${exec.function.method.toUpperCase()} ${exec.function.path}`
    : exec.function.name;
