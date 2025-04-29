import type { AgenticaExecuteHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { Typography } from "@mui/material";
import React from "react";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatExecuteMessageMovie<
  Model extends ILlmSchema.Model,
>({
  execute,
}: AgenticaChatExecuteMessageMovie.IProps<Model>) {
  return (
    <React.Fragment>
      <Typography variant="h5">
        {" "}
        {getTitle(execute)}
        {" "}
      </Typography>
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
}
export namespace AgenticaChatExecuteMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    execute: AgenticaExecuteHistory<Model>;
  }
}

function getTitle<Model extends ILlmSchema.Model>(exec: AgenticaExecuteHistory<Model>) {
  return exec.operation.protocol === "http"
    ? `${exec.operation.function.method.toUpperCase()} ${exec.operation.function.path}`
    : exec.operation.function.name;
}
