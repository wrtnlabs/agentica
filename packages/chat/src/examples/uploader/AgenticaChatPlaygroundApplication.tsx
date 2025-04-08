import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection, IHttpLlmApplication } from "@samchon/openapi";
import type { ReactElement } from "react";

import { Agentica } from "@agentica/core";
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
import OpenAI from "openai";
import React, { useState } from "react";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

import { AgenticaChatUploaderMovie } from "./AgenticaChatUploaderMovie";

export function AgenticaChatUploaderApplication(props: AgenticaChatUploaderApplication.IProps) {
  // PARAMETERS
  const [host, setHost] = useState("http://localhost:37001");
  const [headersText, setHeadersText] = useState<string>(JSON.stringify({
    Authorization: "YOUR_SERVER_API_KEY",
  }, null, 2));
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");

  // RESULT
  const [application, setApplication]
  = useState<IHttpLlmApplication<"chatgpt"> | null>(null);
  const [progress, setProgress] = useState(false);

  const headers: Record<string, IHttpConnection.HeaderValue> | null = parseHeaders(headersText);
  const disabled: boolean = progress === true
    || headers === null
    || document === null
    || application === null
    || host.length === 0
    || apiKey.length === 0;

  // HANDLERS
  const handleError = (error: string) => {
    if (props.onError != null) {
      props.onError(error);
    }
    else { alert(error); }
  };
  const handleApplication = (
    application: IHttpLlmApplication<"chatgpt"> | null,
    error: string | null,
  ) => {
    setApplication(application);
    if (error !== null) {
      handleError(error);
    }
  };

  const open = async () => {
    if (application === null) {
      return;
    }
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
              headers: headers!,
            },
          },
        ],
      });
      props.onSuccess(<AgenticaChatApplication agent={agent} />);
    }
    catch (error) {
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
          onChange={e => setHost(e.target.value)}
          defaultValue={host}
          label="Host URL"
          variant="outlined"
          placeholder="Server URL"
          error={host.length === 0}
        />
        <br />
        <FormLabel> Headers </FormLabel>
        <TextField
          fullWidth
          multiline
          defaultValue={headersText}
          onChange={e => setHeadersText(e.target.value)}
          maxRows={10}
          error={headers === null}
          helperText={headers === null ? "Invalid JSON format" : undefined}
        />
        <br />
        <br />
        <Typography variant="h6">LLM Arguments</Typography>
        <br />
        <FormLabel> LLM Provider </FormLabel>
        <RadioGroup defaultValue="chatgpt" style={{ paddingLeft: 15 }}>
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
          onChange={e => setApiKey(e.target.value)}
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
        color="info"
        size="large"
        disabled={disabled}
        onClick={() => void open().catch(() => {})}
      >
        {progress ? "Generating..." : "Generate AI Chatbot"}
      </Button>
    </div>
  );
}
export namespace AgenticaChatUploaderApplication {
  export interface IProps {
    style?: React.CSSProperties;
    onError?: (error: string) => void;
    onSuccess: (element: ReactElement) => void;
  }
}

function parseHeaders(text: string): Record<string, IHttpConnection.HeaderValue> | null {
  try {
    return JSON.parse(text) as Record<string, IHttpConnection.HeaderValue>;
  }
  catch {
    return null;
  }
}
