import type { ILlmSchema } from "@samchon/openapi";

import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useState } from "react";

export function VendorConfigurationMovie(props: VendorConfigurationMovie.IProps) {
  const [apiKey, setApiKey] = useState(props.config.apiKey);
  const [vendorMode, setVendorMode] = useState<"gpt-4o" | "gpt-4o-mini" | "manual">(
    props.config.baseURL === undefined && (props.config.vendorModel === "gpt-4o" || props.config.vendorModel === "gpt-4o-mini")
      ? (props.config.vendorModel)
      : "manual",
  );
  const [vendorModel, setVendorModel] = useState(props.config.vendorModel);
  const [schemaModel, setSchemaModel] = useState<ILlmSchema.Model>(props.config.schemaModel);
  const [baseURL, setBaseURL] = useState<string | undefined>(props.config.baseURL);

  const getConfig = (): VendorConfigurationMovie.IConfig => ({
    schemaModel,
    vendorModel,
    apiKey,
    baseURL,
  });

  const handleApiKey = (str: string) => {
    const config: VendorConfigurationMovie.IConfig = getConfig();
    config.apiKey = str;

    setApiKey(str);
    props.onChange(config);
  };

  const handleVendorMode = (_: unknown, value: string) => {
    const config: VendorConfigurationMovie.IConfig = getConfig();
    setVendorMode(value as "gpt-4o" | "gpt-4o-mini" | "manual");

    if (value === "gpt-4o" || value === "gpt-4o-mini") {
      config.vendorModel = value;
      config.baseURL = undefined;
      config.schemaModel = "chatgpt";
      setBaseURL(undefined);
      setVendorModel(value);
      setSchemaModel("chatgpt");
    }
    else {
      config.baseURL = "openrouter.ai/api/v1";
      setBaseURL("https://openrouter.ai/api/v1");
    }
    props.onChange(config);
  };

  const handleBaseURL = (str: string) => {
    const config: VendorConfigurationMovie.IConfig = getConfig();
    config.baseURL = str;
    setBaseURL(str);
    props.onChange(config);
  };

  const handleVendorModel = (str: string) => {
    const config: VendorConfigurationMovie.IConfig = getConfig();
    config.vendorModel = str;
    setVendorModel(str);
    props.onChange(config);
  };

  const handleSchemaModel = (str: ILlmSchema.Model) => {
    const config: VendorConfigurationMovie.IConfig = getConfig();
    config.schemaModel = str;
    setSchemaModel(str);
    props.onChange(config);
  };

  return (
    <>
      <TextField
        onChange={e => handleApiKey(e.target.value)}
        defaultValue={apiKey}
        label="OpenAI API Key"
        variant="outlined"
        placeholder="Your OpenAI API Key"
        error={apiKey.length === 0}
      />
      <br />
      <RadioGroup
        defaultValue={vendorMode}
        onChange={handleVendorMode}
        style={{ paddingLeft: 15 }}
      >
        <FormControlLabel
          control={<Radio />}
          label="GPT-4o Mini"
          value="gpt-4o-mini"
        />
        <FormControlLabel
          control={<Radio />}
          label="GPT-4o"
          value="gpt-4o"
        />
        <FormControlLabel
          control={<Radio />}
          label="Manual Configuration"
          value="manual"
        />
      </RadioGroup>
      {vendorMode === "manual"
        ? (
            <>
              <br />
              <TextField
                fullWidth
                label="Base URL"
                defaultValue={baseURL}
                onChange={(e => handleBaseURL(e.target.value))}
              />
              <br />
              <TextField
                fullWidth
                label="Vendor Model"
                defaultValue={vendorModel}
                onChange={e => handleVendorModel(e.target.value)}
              />
              <br />
              <RadioGroup
                title="Schema Model"
                defaultValue={schemaModel}
                onChange={(_, value) => handleSchemaModel(value as ILlmSchema.Model)}
                style={{ paddingLeft: 15 }}
              >
                <FormControlLabel
                  control={<Radio />}
                  label="OpenAI ChatGPT"
                  value="chatgpt"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Anthropic Claude"
                  value="claude"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Google Gemini"
                  value="gemini"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Meta Llama"
                  value="llama"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="OpenAPI v3.0"
                  value="3.0"
                />
                <FormControlLabel
                  control={<Radio />}
                  label="OpenAPI v3.1"
                  value="3.1"
                />
              </RadioGroup>
              <br />
            </>
          )
        : null}
      <br />
    </>
  );
}
export namespace VendorConfigurationMovie {
  export interface IProps {
    config: IConfig;
    onChange: (config: IConfig) => void;
  }
  export interface IConfig {
    schemaModel: ILlmSchema.Model;
    vendorModel: string;
    apiKey: string;
    baseURL?: string | undefined;
  }

  export function defaultConfig(): IConfig {
    return {
      schemaModel: "chatgpt",
      vendorModel: "gpt-4o-mini",
      apiKey: "",
      baseURL: undefined,
    };
  }
}
