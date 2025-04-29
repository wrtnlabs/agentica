import type { AgenticaUserInputHistory } from "@agentica/core/src/histories/AgenticaUserInputHistory";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Card, CardContent, Chip } from "@mui/material";

import { MarkdownViewer } from "../../components/MarkdownViewer";

export function AgenticaChatUserInput({
  prompt,
}: AgenticaChatUserInput.IProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      {
        prompt.contents.map((content, index) => (
          content.type === "text"
            ? (
                <Card
                  key={index}
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
                    <MarkdownViewer>{content.text}</MarkdownViewer>
                  </CardContent>
                </Card>
              )
              // @todo handle other content types (multi modal)
            : null
        ))
      }
    </div>
  );
}
export namespace AgenticaChatUserInput {
  export interface IProps {
    prompt: AgenticaUserInputHistory;
  }
}
