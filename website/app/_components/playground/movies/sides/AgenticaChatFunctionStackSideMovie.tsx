import { AgenticaOperationSelection } from "@agentica/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ILlmSchema } from "@samchon/openapi";
import React from "react";

import { MarkdownViewer } from "../../markdown/MarkdownViewer";

interface IProps<Model extends ILlmSchema.Model> {
  selections: AgenticaOperationSelection<Model>[];
}

export const AgenticaChatFunctionStackSideMovie = <
  Model extends ILlmSchema.Model,
>(
  props: IProps<Model>,
) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> Function Stack </Typography>
      <hr />
      {props.selections.map((select, idx) => (
        <Accordion key={`idx-${idx}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="h6">
              {select.operation.protocol === "http"
                ? `${select.operation.function.method.toUpperCase()} ${select.operation.function.path}`
                : select.operation.function.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <hr />
            {select.reason}
            <br />
            <br />
            <MarkdownViewer>
              {select.operation.function.description}
            </MarkdownViewer>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
};
