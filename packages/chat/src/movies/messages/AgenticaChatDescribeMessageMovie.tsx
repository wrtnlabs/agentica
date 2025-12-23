import type { AgenticaDescribeHistory } from "@agentica/core";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
} from "@mui/material";
import { useState } from "react";

import { MarkdownViewer } from "../../components/MarkdownViewer";

import { AgenticaChatExecuteMessageMovie } from "./AgenticaChatExecuteMessageMovie";

export function AgenticaChatDescribeMessageMovie({
  history,
}: AgenticaChatDescribeMessageMovie.IProps) {
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
        <Chip label="Function Describer" variant="outlined" color="secondary" />
        <MarkdownViewer>{history.text}</MarkdownViewer>
      </CardContent>
      <CardActions style={{ textAlign: "right" }}>
        <Button
          startIcon={(
            <ExpandMoreIcon
              style={{
                transform: `rotate(${expanded ? 180 : 0}deg)`,
              }}
            />
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Function Calls" : "Show Function Calls"}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {history.executes.map(execute => (
            <AgenticaChatExecuteMessageMovie execute={execute} />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
export namespace AgenticaChatDescribeMessageMovie {
  export interface IProps {
    history: AgenticaDescribeHistory;
  }
}
