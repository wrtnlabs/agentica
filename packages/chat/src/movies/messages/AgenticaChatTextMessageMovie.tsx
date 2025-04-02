import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Card, CardContent, Chip } from "@mui/material";

import type { AgenticaTextPrompt } from "@agentica/core";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatTextMessageMovie({
  prompt,
}: AgenticaChatTextMessageMovie.IProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: prompt.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      <Card
        elevation={3}
        style={{
          marginTop: 15,
          marginBottom: 15,
          marginLeft: prompt.role === "user" ? "15%" : undefined,
          marginRight: prompt.role === "assistant" ? "15%" : undefined,
          textAlign: prompt.role === "user" ? "right" : "left",
          backgroundColor: prompt.role === "user" ? "lightyellow" : undefined,
        }}
      >
        <CardContent>
          <Chip
            icon={prompt.role === "user" ? <FaceIcon /> : <SmartToyIcon />}
            label={prompt.role === "user" ? "User" : "Assistant"}
            variant="outlined"
            color={prompt.role === "user" ? "primary" : "success"}
          />
          <MarkdownViewer>{prompt.text}</MarkdownViewer>
        </CardContent>
      </Card>
    </div>
  );
}
export namespace AgenticaChatTextMessageMovie {
  export interface IProps {
    prompt: AgenticaTextPrompt;
  }
}
