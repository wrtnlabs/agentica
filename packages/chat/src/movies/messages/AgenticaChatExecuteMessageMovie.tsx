import { AgenticaExecutePrompt } from "@agentica/core";
import { Typography } from "@mui/material";
import { ILlmSchema } from "@samchon/openapi";
import React from "react";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export const AgenticaChatExecuteMessageMovie = <
  Model extends ILlmSchema.Model,
>({
  execute,
}: AgenticaChatExecuteMessageMovie.IProps<Model>) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> {getTitle(execute)} </Typography>
      <hr />
      <Typography variant="h6"> Description </Typography>
      <MarkdownViewer>{execute.operation.function.description}</MarkdownViewer>
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
    execute: AgenticaExecutePrompt<Model>;
  }
}

const getTitle = <Model extends ILlmSchema.Model>(
  exec: AgenticaExecutePrompt<Model>,
) =>
  exec.operation.protocol === "http"
    ? `${exec.operation.function.method.toUpperCase()} ${exec.operation.function.path}`
    : exec.operation.function.name;
