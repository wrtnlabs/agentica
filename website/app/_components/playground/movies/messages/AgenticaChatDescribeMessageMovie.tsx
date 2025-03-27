import { AgenticaDescribePrompt } from "@agentica/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
} from "@mui/material";
import { ILlmSchema } from "@samchon/openapi";
import { useState } from "react";

import { MarkdownViewer } from "../../markdown/MarkdownViewer";
import { AgenticaChatExecuteMessageMovie } from "./AgenticaChatExecuteMessageMovie";

interface IProps<Model extends ILlmSchema.Model> {
  prompt: AgenticaDescribePrompt<Model>;
}

export const AgenticaChatDescribeMessageMovie = <
  Model extends ILlmSchema.Model,
>({
  prompt,
}: IProps<Model>) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card
      elevation={3}
      className="mt-3 mb-3 mr-[15%]"
    >
      <CardContent>
        <Chip label="Function Describer" variant="outlined" color="secondary" />
        <MarkdownViewer>{prompt.text}</MarkdownViewer>
      </CardContent>
      <CardActions className="text-right">
        <Button
          startIcon={
            <ExpandMoreIcon
              style={{
                transform: `rotate(${expanded ? 180 : 0}deg)`,
              }}
            />
          }
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Function Calls" : "Show Function Calls"}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {prompt.executes.map((execute, idx) => (
            <AgenticaChatExecuteMessageMovie key={`idx-${idx}`} execute={execute} />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
