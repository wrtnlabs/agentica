import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection, OpenApi } from "@samchon/openapi";
import type { ReactElement } from "react";

import { Agentica } from "@agentica/core";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { HttpLlm } from "@samchon/openapi";
import OpenAI from "openai";
import React, { useState } from "react";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";
import { VendorConfigurationMovie } from "../common/VendorConfigurationMovie";

import { AgenticaChatUploaderMovie } from "./AgenticaChatUploaderMovie";

export function AgenticaChatUploaderApplication(props: AgenticaChatUploaderApplication.IProps) {
  // PARAMETERS
  const [host, setHost] = useState("http://localhost:37001");
  const [headersText, setHeadersText] = useState<string>(JSON.stringify({
    Authorization: "YOUR_SERVER_API_KEY",
  }, null, 2));
  const [config, setConfig] = useState<VendorConfigurationMovie.IConfig>(
    VendorConfigurationMovie.defaultConfig(),
  );

  // RESULT
  const [document, setDocument] = useState<OpenApi.IDocument | null>(null);
  const [progress, setProgress] = useState(false);

  const headers: Record<string, IHttpConnection.HeaderValue> | null = parseHeaders(headersText);
  const disabled: boolean = progress === true
    || headers === null
    || document === null
    || host.length === 0
    || config.apiKey.length === 0
    || config.vendorModel.length === 0;

  // HANDLERS
  const handleError = (error: string) => {
    if (props.onError != null) {
      props.onError(error);
    }
    else { alert(error); }
  };
  const handleDocument = (
    document: OpenApi.IDocument | null,
    error: string | null,
  ) => {
    setDocument(document);
    if (error !== null) {
      handleError(error);
    }
  };

  const open = async () => {
    if (document === null) {
      return;
    }
    setProgress(true);
    try {
      const vendor: IAgenticaVendor = {
        api: new OpenAI({
          apiKey: config.apiKey,
          baseURL: config.baseURL,
          dangerouslyAllowBrowser: true,
        }),
        model: config.vendorModel,
      };
      const agent: Agentica = new Agentica({
        vendor,
        controllers: [
          {
            protocol: "http",
            name: "main",
            application: HttpLlm.application({
              document,
            }),
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
      <AgenticaChatUploaderMovie onChange={handleDocument} />
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
        <Typography variant="h6">OpenAI Configuration</Typography>
        <br />
        <VendorConfigurationMovie config={config} onChange={setConfig} />
        <br />
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
