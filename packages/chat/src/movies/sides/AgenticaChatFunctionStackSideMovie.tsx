import type { AgenticaOperationSelection } from "@agentica/core";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatFunctionStackSideMovie(
  props: AgenticaChatFunctionStackSideMovie.IProps
) {
  return (
    <React.Fragment>
      <Typography variant="h5"> Function Stack </Typography>
      <hr />
      {props.selections.map(select => (
        <Accordion>
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
}
export namespace AgenticaChatFunctionStackSideMovie {
  export interface IProps {
    selections: AgenticaOperationSelection[];
  }
}
