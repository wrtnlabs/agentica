import type { AgenticaSystemMessageHistory } from "@agentica/core";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Card, CardContent, Chip } from "@mui/material";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatSystemMessageMovie({
  prompt,
}: AgenticaChatSystemMessageMovie.IProps) {
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
            label="System"
            variant="outlined"
            color="success"
          />
          <MarkdownViewer>{prompt.text}</MarkdownViewer>
        </CardContent>
      </Card>
    </div>
  );
}
export namespace AgenticaChatSystemMessageMovie {
  export interface IProps {
    prompt: AgenticaSystemMessageHistory;
  }
}
