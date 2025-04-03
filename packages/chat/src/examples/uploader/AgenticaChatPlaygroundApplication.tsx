import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpLlmApplication } from "@samchon/openapi";
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
import JsonInput from "react-json-editor-ajrm";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

import { AgenticaChatUploaderMovie } from "./AgenticaChatUploaderMovie";

/**
 * {@link https://github.com/AndrewRedican/react-json-editor-ajrm}
 */
const locale = {
  format: "{reason} at line {line}",
  symbols: {
    colon: "colon",
    // :
    comma: "comma",
    // ,  ،  、
    semicolon: "semicolon",
    // ;
    slash: "slash",
    // /  relevant for comment syntax support
    backslash: "backslash",
    // \  relevant for escaping character
    brackets: {
      round: "round brackets",
      // ( )
      square: "square brackets",
      // [ ]
      curly: "curly brackets",
      // { }
      angle: "angle brackets", // < >

    },
    period: "period",
    // . Also known as full point, full stop, or dot
    quotes: {
      single: "single quote",
      // '
      double: "double quote",
      // "
      grave: "grave accent", // ` used on Javascript ES6 Syntax for String Templates

    },
    space: "space",
    //
    ampersand: "ampersand",
    // &
    asterisk: "asterisk",
    // *  relevant for some comment sytanx
    at: "at sign",
    // @  multiple uses in other coding languages including certain data types
    equals: "equals sign",
    // =

    hash: "hash",
    // #

    percent: "percent",
    // %

    plus: "plus",
    // +

    minus: "minus",
    // −

    dash: "dash",
    // −

    hyphen: "hyphen",
    // −

    tilde: "tilde",
    // ~

    underscore: "underscore",
    // _

    bar: "vertical bar",
    // |

  },
  types: {
    key: "key",
    value: "value",
    number: "number",
    string: "string",
    primitive: "primitive",
    boolean: "boolean",
    character: "character",
    integer: "integer",
    array: "array",
    float: "float", // ... Reference: https://en.wikipedia.org/wiki/List_of_data_structures

  },
  invalidToken: {
    tokenSequence: {
      prohibited: "'{firstToken}' token cannot be followed by '{secondToken}' token(s)",
      permitted: "'{firstToken}' token can only be followed by '{secondToken}' token(s)",
    },
    termSequence: {
      prohibited: "A {firstTerm} cannot be followed by a {secondTerm}",
      permitted: "A {firstTerm} can only be followed by a {secondTerm}",
    },
    double: "'{token}' token cannot be followed by another '{token}' token",
    useInstead: "'{badToken}' token is not accepted. Use '{goodToken}' instead",
    unexpected: "Unexpected '{token}' token found",
  },
  brace: {
    curly: {
      missingOpen: "Missing '{' open curly brace",
      missingClose: "Open '{' curly brace is missing closing '}' curly brace",
      cannotWrap: "'{token}' token cannot be wrapped in '{}' curly braces",
    },
    square: {
      missingOpen: "Missing '[' open square brace",
      missingClose: "Open '[' square brace is missing closing ']' square brace",
      cannotWrap: "'{token}' token cannot be wrapped in '[]' square braces",
    },
  },
  string: {
    missingOpen: "Missing/invalid opening string '{quote}' token",
    missingClose: "Missing/invalid closing string '{quote}' token",
    mustBeWrappedByQuotes: "Strings must be wrapped by quotes",
    nonAlphanumeric: "Non-alphanumeric token '{token}' is not allowed outside string notation",
    unexpectedKey: "Unexpected key found at string position",
  },
  key: {
    numberAndLetterMissingQuotes: "Key beginning with number and containing letters must be wrapped by quotes",
    spaceMissingQuotes: "Key containing space must be wrapped by quotes",
    unexpectedString: "Unexpected string found at key position",
  },
  noTrailingOrLeadingComma: "Trailing or leading commas in arrays and objects are not permitted",
};

export function AgenticaChatUploaderApplication(props: AgenticaChatUploaderApplication.IProps) {
  // PARAMETERS
  const [host, setHost] = useState("http://localhost:37001");
  const [headers, setHeaders] = useState<Record<string, string>>({
    Authorization: "YOUR_SERVER_API_KEY",
  });
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");

  // RESULT
  const [application, setApplication]
    = useState<IHttpLlmApplication<"chatgpt"> | null>(null);
  const [progress, setProgress] = useState(false);

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
              headers,
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
        disabled={
          progress === true
          || document === null
          || application === null
          || host.length === 0
          || apiKey.length === 0
        }
        onClick={void open}
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
