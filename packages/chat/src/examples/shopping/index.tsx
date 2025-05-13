import type { IHttpConnection } from "@samchon/openapi";

import {
  Button,
  Divider,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import ShoppingApi from "@samchon/shopping-api";
import OpenAI from "openai";
import { Suspense, useState } from "react";
import { createRoot } from "react-dom/client";

import { VendorConfigurationMovie } from "../common/VendorConfigurationMovie";

import { ShoppingChatApplication, ShoppingChatApplicationSkeleton } from "./ShoppingChatApplication";

function Application() {
  const [config, setConfig] = useState<VendorConfigurationMovie.IConfig>(
    VendorConfigurationMovie.defaultConfig(),
  );
  const [locale, setLocale] = useState(window.navigator.language);
  const [name, setName] = useState("John Doe");
  const [mobile, setMobile] = useState("821012345678");

  const [progress, setProgress] = useState(false);
  const [next, setNext] = useState<ShoppingChatApplication.IProps | null>(null);

  const startChatApplication = async () => {
    setProgress(true);

    // HANDLESHAKE WITH SHOPPING BACKEND
    const connection: IHttpConnection = {
      host: "https://shopping-be.wrtn.ai",
    };
    await ShoppingApi.functional.shoppings.customers.authenticate.create(
      connection,
      {
        channel_code: "samchon",
        external_user: null,
        href: window.location.href,
        referrer: window.document.referrer,
      },
    );
    await ShoppingApi.functional.shoppings.customers.authenticate.activate(
      connection,
      {
        mobile,
        name,
      },
    );

    // ADVANCE TO THE NEXT STEP
    setNext({
      api: new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        dangerouslyAllowBrowser: true,
      }),
      vendorModel: config.vendorModel,
      schemaModel: config.schemaModel,
      connection,
      name,
      mobile,
      locale,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: next !== null ? undefined : "auto",
      }}
    >
      {next !== null
        ? (
            <Suspense fallback={<ShoppingChatApplicationSkeleton />}>
              <ShoppingChatApplication {...next} />
            </Suspense>
          )
        : (
            <FormControl
              style={{
                width: "calc(100% - 60px)",
                padding: 15,
                margin: 15,
              }}
            >
              <Typography variant="h4">Shopping AI Chatbot</Typography>
              <br />
              <Divider />
              <br />
              Demonstration of Agentica with Shopping Backend API.
              <br />
              <br />
              <Link
                href="https://github.com/samchon/shopping-backend"
                target="_blank"
              >
                https://github.com/samchon/shopping-backend
              </Link>
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
              <TextField
                onChange={e => setName(e.target.value)}
                defaultValue={name}
                label="Name"
                variant="outlined"
                error={name.length === 0}
              />
              <br />
              <TextField
                onChange={e => setMobile(e.target.value)}
                defaultValue={mobile}
                label="Mobile"
                variant="outlined"
                error={mobile.length === 0}
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
                  progress
                  || config.apiKey.length === 0
                  || config.vendorModel.length === 0
                  || config.schemaModel.length === 0
                  || locale.length === 0
                  || name.length === 0
                  || mobile.length === 0
                }
                onClick={() => void startChatApplication().catch(() => {})}
              >
                {progress ? "Starting..." : "Start AI Chatbot"}
              </Button>
            </FormControl>
          )}
    </div>
  );
}

createRoot(window.document.getElementById("root")!).render(<Application />);
