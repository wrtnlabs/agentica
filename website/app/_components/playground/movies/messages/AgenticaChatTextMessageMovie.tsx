import { AgenticaTextPrompt } from "@agentica/core";
import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Card, CardContent, Chip } from "@mui/material";

import { MarkdownViewer } from "../../markdown/MarkdownViewer";
import { cn } from "@/app/_lib/utils";

interface IProps {
  prompt: AgenticaTextPrompt;
}
export const AgenticaChatTextMessageMovie = ({
  prompt,
}: IProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: prompt.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      <Card
        elevation={3}
        className={cn(
          "mt-3 mb-3",
          prompt.role === "user" ? "mr-[15%] text-right lightyellow" : "ml-[15%] text-left",
        )}
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
};