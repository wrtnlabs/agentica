import type { AgenticaAssistantMessageHistory } from "@agentica/core";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Card, CardContent, Chip } from "@mui/material";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatAssistantMessageMovie({
  prompt,
}: AgenticaChatAssistantMessageMovie.IProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Card
        elevation={3}
        style={{
          marginTop: 15,
          marginBottom: 15,
          marginRight: "15%",
          textAlign: "left",
        }}
      >
        <CardContent>
          <Chip
            icon={<SmartToyIcon />}
            label="Assistant"
            variant="outlined"
            color="success"
          />
          <MarkdownViewer>{prompt.text}</MarkdownViewer>
        </CardContent>
      </Card>
    </div>
  );
}
export namespace AgenticaChatAssistantMessageMovie {
  export interface IProps {
    prompt: AgenticaAssistantMessageHistory;
  }
}
