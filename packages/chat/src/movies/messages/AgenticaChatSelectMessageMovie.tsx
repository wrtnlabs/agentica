import GradingIcon from "@mui/icons-material/Grading";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
} from "@mui/material";
import { useState } from "react";

import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperationSelection } from "@agentica/core";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatSelectMessageMovie<Model extends ILlmSchema.Model>({
  selection,
}: AgenticaChatSelectMessageMovie.IProps<Model>) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      elevation={3}
      style={{
        marginTop: 15,
        marginBottom: 15,
        marginRight: "15%",
      }}
    >
      <CardContent>
        <Chip
          icon={<GradingIcon />}
          label="Function Selector"
          variant="outlined"
          color="warning"
        />
        <br />
        <br />
        Operation:
        {selection.operation.protocol === "http"
          ? (
              <ul>
                <li>{selection.operation.function.method.toUpperCase()}</li>
                <li>{selection.operation.function.path}</li>
              </ul>
            )
          : (
              <ul>
                <li>{selection.operation.function.name}</li>
              </ul>
            )}
        <MarkdownViewer>{selection.reason}</MarkdownViewer>
      </CardContent>
      <CardActions style={{ textAlign: "right" }}>
        <Button onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide Function Description" : "Show Function Description"}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <MarkdownViewer>
            {selection.operation.function.description}
          </MarkdownViewer>
        </CardContent>
      </Collapse>
    </Card>
  );
}
export namespace AgenticaChatSelectMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    selection: AgenticaOperationSelection<Model>;
  }
}
