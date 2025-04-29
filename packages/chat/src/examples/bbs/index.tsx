import {
  Button,
  Divider,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import OpenAI from "openai";
import { useState } from "react";
import { createRoot } from "react-dom/client";

import { VendorConfigurationMovie } from "../common/VendorConfigurationMovie";

import { BbsChatApplication } from "./BbsChatApplication";

function Application() {
  const [config, setConfig] = useState<VendorConfigurationMovie.IConfig>(
    VendorConfigurationMovie.defaultConfig(),
  );
  const [locale, setLocale] = useState(window.navigator.language);
  const [start, setStart] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: start === true ? undefined : "auto",
      }}
    >
      {start === true
        ? (
            <BbsChatApplication
              api={
                new OpenAI({
                  apiKey: config.apiKey,
                  baseURL: config.baseURL,
                  dangerouslyAllowBrowser: true,
                })
              }
              vendorModel={config.vendorModel}
              schemaModel={config.schemaModel}
              locale={locale}
            />
          )
        : (
            <FormControl
              style={{
                width: "calc(100% - 60px)",
                padding: 15,
                margin: 15,
              }}
            >
              <Typography variant="h6">BBS AI Chatbot</Typography>
              <br />
              <Divider />
              <br />
              Demonstration of Agentica with TypeScript Controller
              Class.
              <br />
              <br />
              <Typography variant="h6"> OpenAI Configuration </Typography>
              <br />
              <VendorConfigurationMovie config={config} onChange={setConfig} />
              <br />
              <Typography variant="h6"> Membership Information </Typography>
              <br />
              <TextField
                onChange={e => setLocale(e.target.value)}
                defaultValue={locale}
                label="Locale"
                variant="outlined"
                error={locale.length === 0}
              />
              <br />
              <br />
              <Button
                component="a"
                fullWidth
                variant="contained"
                color="info"
                size="large"
                disabled={
                  config.apiKey.length === 0
                  || config.vendorModel.length === 0
                  || config.schemaModel.length === 0
                  || locale.length === 0
                }
                onClick={() => setStart(true)}
              >
                Start AI Chatbot
              </Button>
            </FormControl>
          )}
    </div>
  );
}

createRoot(window.document.getElementById("root")!).render(<Application />);
