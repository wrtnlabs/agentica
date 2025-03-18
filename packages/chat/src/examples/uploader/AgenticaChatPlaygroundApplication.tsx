import { Agentica, IAgenticaVendor } from "@agentica/core";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { IHttpLlmApplication } from "@samchon/openapi";
import OpenAI from "openai";
import React, { ReactElement, useState } from "react";
import JsonInput from "react-json-editor-ajrm";
// @ts-ignore
import locale from "react-json-editor-ajrm/locale/en.js";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";
import { AgenticaChatUploaderMovie } from "./AgenticaChatUploaderMovie";

export const AgenticaChatUploaderApplication = (
  props: AgenticaChatUploaderApplication.IProps,
) => {
  // PARAMETERS
  const [host, setHost] = useState("http://localhost:37001");
  const [headers, setHeaders] = useState<Record<string, string>>({
    Authorization: "YOUR_SERVER_API_KEY",
  });
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");

  // RESULT
  const [application, setApplication] =
    useState<IHttpLlmApplication<"chatgpt"> | null>(null);
  const [progress, setProgress] = useState(false);

  // HANDLERS
  const handleApplication = (
    application: IHttpLlmApplication<"chatgpt"> | null,
    error: string | null,
  ) => {
    setApplication(application);
    if (error !== null) handleError(error);
  };
  const handleError = (error: string) => {
    if (props.onError) props.onError(error);
    else alert(error);
  };

  const open = async () => {
    if (application === null) return;
    setProgress(true);
    try {
      const vendor: IAgenticaVendor = {
        api: new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true,
        }),
        model: model as "gpt-4o",
      };
      const agent: Agentica<"chatgpt"> = new Agentica({
        model: "chatgpt",
        vendor,
        controllers: [
          {
            protocol: "http",
            name: "main",
            application,
            connection: {
              host,
              headers,
            },
          },
        ],
      });
      props.onSuccess(<AgenticaChatApplication agent={agent} />);
    } catch (error) {
      handleError(error instanceof Error ? error.message : "unknown error");
      setProgress(false);
    }
  };

  return (
    <div style={props.style}>
      <AgenticaChatUploaderMovie onChange={handleApplication} />
      <br />
      <FormControl fullWidth>
        <Typography variant="h6">HTTP Connection</Typography>
        <br />
        <TextField
          onChange={(e) => setHost(e.target.value)}
          defaultValue={host}
          label="Host URL"
          variant="outlined"
          placeholder="Server URL"
          error={host.length === 0}
        />
        <br />
        <FormLabel> Headers </FormLabel>
        <JsonInput
          locale={locale}
          theme="dark_vscode_tribute"
          placeholder={headers}
          onChange={setHeaders}
          height="100px"
        />
        <br />
        <br />
        <Typography variant="h6">LLM Arguments</Typography>
        <br />
        <FormLabel> LLM Provider </FormLabel>
        <RadioGroup defaultValue={"chatgpt"} style={{ paddingLeft: 15 }}>
          <FormControlLabel
            value="chatgpt"
            control={<Radio />}
            label="OpenAI (ChatGPT)"
          />
        </RadioGroup>
        <FormLabel style={{ paddingTop: 20 }}> OpenAI Model </FormLabel>
        <RadioGroup
          defaultValue={model}
          onChange={(_e, value) => setModel(value)}
          style={{ paddingLeft: 15 }}
        >
          <FormControlLabel
            value="gpt-4o-mini"
            control={<Radio />}
            label="GPT-4o Mini"
          />
          <FormControlLabel value="gpt-4o" control={<Radio />} label="GPT-4o" />
        </RadioGroup>
        <br />
        <TextField
          onChange={(e) => setApiKey(e.target.value)}
          defaultValue={apiKey}
          label="OpenAI API Key"
          variant="outlined"
          placeholder="Your OpenAI API Key"
          error={apiKey.length === 0}
        />
      </FormControl>
      <br />
      <br />
      <Button
        component="a"
        fullWidth
        variant="contained"
        color={"info"}
        size="large"
        disabled={
          progress === true ||
          document === null ||
          application === null ||
          host.length === 0 ||
          apiKey.length === 0
        }
        onClick={() => open()}
      >
        {progress ? "Generating..." : "Generate AI Chatbot"}
      </Button>
    </div>
  );
};
export namespace AgenticaChatUploaderApplication {
  export interface IProps {
    style?: React.CSSProperties;
    onError?: (error: string) => void;
    onSuccess: (element: ReactElement) => void;
  }
}
