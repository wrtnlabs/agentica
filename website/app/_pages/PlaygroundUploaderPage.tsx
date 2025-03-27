"use client";

import { Agentica, IAgenticaVendor, validateHttpLlmApplication } from "@agentica/core";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { IHttpLlmApplication, IValidation, OpenApiV3, OpenApiV3_1, SwaggerV2 } from "@samchon/openapi";
import OpenAI from "openai";
import { useState } from "react";
import { load } from "js-yaml";


// @ts-expect-error i don't know why this is error
import JsonInput from "react-json-editor-ajrm";
// @ts-expect-error i don't know why this is error
import locale from "react-json-editor-ajrm/locale/en.js";

// @ts-expect-error i don't know why this is error
import FileUpload from "react-mui-fileuploader";

// @ts-expect-error i don't know why this is error
import { ExtendedFileProps } from "react-mui-fileuploader/dist/types/index.types";
import { AgenticaChatMovie } from "../_components/playground/movies/AgenticaChatMovie";

export const AgenticaChatUploaderMovie = (
  props: {
    onChange: (
      application: IHttpLlmApplication<"chatgpt"> | null,
      error: string | null,
    ) => void;
  }
) => {
  const [elements, setElements] = useState<ExtendedFileProps[]>([]);
  const onChange = async (array: ExtendedFileProps[]) => {
    if (array.length === 0) {
      props.onChange(null, null);
      return;
    }

    const file: ExtendedFileProps = array[array.length - 1]!;
    const buffer: ArrayBuffer = await file.arrayBuffer();
    const content: string = new TextDecoder().decode(buffer);
    const extension: "json" | "yaml" = file.name.split(".").pop()! as
      | "json"
      | "yaml";

    try {
      const document:
        | SwaggerV2.IDocument
        | OpenApiV3.IDocument
        | OpenApiV3_1.IDocument =
        extension === "json" ? JSON.parse(content) : load(content);
      const application: IValidation<IHttpLlmApplication<"chatgpt">> =
        validateHttpLlmApplication({
          model: "chatgpt",
          document,
          options: {
            reference: true,
          },
        });
      if (application.success === true) props.onChange(application.data, null);
      else props.onChange(null, JSON.stringify(application.errors, null, 2));
    } catch {
      props.onChange(
        null,
        extension === "json" ? "Invalid JSON file" : "Invalid YAML file",
      );
      return;
    }
    if (array.length > 1) setElements([file]);
  };
  return (
    <FileUpload
      defaultFiles={elements}
      onFilesChange={onChange}
      acceptedType=".json, .yaml"
      getBase64={false}
      multiFile={false}
      maxUploadFiles={1}
      title="Swagger file uploader"
      header="Drag and drop a Swagger file here"
      buttonLabel="Click Here"
      rightLabel="to select swagger.json/yaml file"
      buttonRemoveLabel="Clear"
    />
  );
};

function PlaygroundUploaderPage () {

  // PARAMETERS
  const [host, setHost] = useState("http://localhost:37001");
  const [headers, setHeaders] = useState<Record<string, string>>({
    Authorization: "YOUR_SERVER_API_KEY",
  });
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");
  const [agent, setAgent] = useState<Agentica<"chatgpt"> | null>(null);
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
    console.error(error);
     alert(error);
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
      setAgent(new Agentica({
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
      }));
    } catch (error) {
      handleError(error instanceof Error ? error.message : "unknown error");
      setProgress(false);
    }
  };

  return (
    <>
      {agent !== null ? (
        <AgenticaChatMovie agent={agent} />
      ) : (
        <div style={{ 
          width: "calc(100% - 30px)",
          height: "calc(100% - 30px)",
          overflowY: "auto",
          padding: 15
        }}>
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
      </div>)}
    </>
  );


}

export default PlaygroundUploaderPage;