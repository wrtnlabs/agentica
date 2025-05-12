import type {
  Agentica,
  AgenticaAssistantEvent,
  AgenticaDescribeEvent,
  AgenticaHistory,
  AgenticaOperationSelection,
  AgenticaSelectEvent,
  AgenticaTokenUsage,
  AgenticaUserEvent,
  AgenticaValidateEvent,
} from "@agentica/core";
import type {
  Theme,
} from "@mui/material";
import type { ILlmSchema } from "@samchon/openapi";
import type { ReactElement } from "react";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Button,
  Container,
  Drawer,
  IconButton,
  Input,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toPng } from "html-to-image";
import React, { useEffect, useRef, useState } from "react";

import { AgenticaChatMessageMovie } from "./messages/AgenticaChatMessageMovie";
import { AgenticaChatSideMovie } from "./sides/AgenticaChatSideMovie";

const SIDE_WIDTH = 450;

export function AgenticaChatMovie<Model extends ILlmSchema.Model>({
  agent,
  title,
}: AgenticaChatMovie.IProps<Model>) {
  // ----
  // VARIABLES
  // ----
  // REFERENCES
  const upperDivRef = useRef<HTMLDivElement>(null);
  const middleDivRef = useRef<HTMLDivElement>(null);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // STATES
  const [error, setError] = useState<Error | null>(null);
  const [text, setText] = useState("");
  const [histories, setHistories] = useState<AgenticaHistory<Model>[]>(
    agent.getHistories().slice(),
  );
  const [tokenUsage, setTokenUsage] = useState<AgenticaTokenUsage>(
    JSON.parse(JSON.stringify(agent.getTokenUsage())) as AgenticaTokenUsage,
  );
  const [height, setHeight] = useState(122);
  const [enabled, setEnabled] = useState(true);
  const [selections, setSelections] = useState<
    AgenticaOperationSelection<Model>[]
  >([]);
  const [openSide, setOpenSide] = useState(false);

  // ----
  // EVENT INTERACTIONS
  // ----
  // EVENT LISTENERS
  const handleUser = async (event: AgenticaUserEvent) => {
    console.log("handleUser()");
    setHistories(prev => [...prev, event.toHistory()]);
  };
  const handleAssistant = async (event: AgenticaAssistantEvent) => {
    console.log("handleAssistant()");
    await event.join(); // @todo Jaxtyn: streaming
    setHistories(prev => [...prev, event.toHistory()]);
  };
  const handleDescribe = async (event: AgenticaDescribeEvent<Model>) => {
    await event.join(); // @todo Jaxtyn: streaming
    setHistories(prev => [...prev, event.toHistory()]);
  };
  const handleSelect = (evevnt: AgenticaSelectEvent<Model>) => {
    setHistories(prev => [...prev, evevnt.toHistory()]);
    setSelections(prev => [...prev, evevnt.selection]);
  };
  const handleValidate = (event: AgenticaValidateEvent<Model>) => {
    console.error(event);
  };

  // INITIALIZATION
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.select();
    }
    agent.on("assistant", handleAssistant);
    agent.on("user", handleUser);
    agent.on("select", handleSelect);
    agent.on("describe", handleDescribe);
    agent.on("validate", handleValidate);
    setTokenUsage(agent.getTokenUsage());
    return () => {
      agent.off("assistant", handleAssistant);
      agent.off("user", handleUser);
      agent.off("select", handleSelect);
      agent.off("describe", handleDescribe);
      agent.off("validate", handleValidate);
    };
  }, []);

  // EVENT HANDLERS
  const handleResize = () => {
    setTimeout(() => {
      if (
        upperDivRef.current === null
        || middleDivRef.current === null
        || bottomDivRef.current === null
      ) { return; }
      const newHeight: number
        = upperDivRef.current.clientHeight + bottomDivRef.current.clientHeight;
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    });
  };

  const conversate = async () => {
    setText("");
    setEnabled(false);
    handleResize();
    try {
      await agent.conversate(text);
    }
    catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        setError(error);
      }
      else { setError(new Error("Unknown error")); }
      return;
    }

    histories.splice(0, histories.length);
    histories.push(...agent.getHistories());
    setHistories(histories);
    setTokenUsage(agent.getTokenUsage());
    setEnabled(true);

    const selections: AgenticaOperationSelection<Model>[] = agent
      .getHistories()
      .filter(h => h.type === "select")
      .map(h => h.selections)
      .flat();
    for (const cancel of agent
      .getHistories()
      .filter(h => h.type === "cancel")
      .map(h => h.selections)
      .flat()) {
      const index: number = selections.findIndex(
        s =>
          s.operation.protocol === cancel.operation.protocol
          && s.operation.controller.name === cancel.operation.controller.name
          && s.operation.function.name === cancel.operation.function.name,
      );
      if (index !== -1) {
        selections.splice(index, 1);
      }
    }
    setSelections(selections);
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      if (enabled === false) {
        event.preventDefault();
      }
      else {
        await conversate();
      }
    }
  };

  const capture = async () => {
    if (bodyContainerRef.current === null) {
      return;
    }

    const dataUrl = await toPng(bodyContainerRef.current, {});
    const link = document.createElement("a");
    link.download = "nestia-chat-screenshot.png";
    link.href = dataUrl;
    link.click();
    link.remove();
  };

  // ----
  // RENDERERS
  // ----
  const theme: Theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("lg"));
  const bodyMovie = (): ReactElement => (
    <div
      style={{
        overflowY: "auto",
        height: "100%",
        width: isMobile ? "100%" : `calc(100% - ${SIDE_WIDTH}px)`,
        margin: 0,
        backgroundColor: "lightblue",
      }}
    >
      <Container
        style={{
          paddingBottom: 50,
          width: "100%",
          minHeight: "100%",
          backgroundColor: "lightblue",
          margin: 0,
        }}
        ref={bodyContainerRef}
      >
        {histories
          .map((prompt, index) => <AgenticaChatMessageMovie key={index} prompt={prompt} />)
          .filter(elem => elem !== null)}
      </Container>
    </div>
  );
  const sideMovie = (): ReactElement => (
    <div
      style={{
        width: isMobile ? undefined : SIDE_WIDTH,
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#eeeeee",
      }}
    >
      <Container
        maxWidth={false}
        onClick={isMobile ? () => setOpenSide(false) : undefined}
      >
        <AgenticaChatSideMovie
          vendor={agent.getVendor()}
          config={agent.getConfig()}
          usage={tokenUsage}
          selections={selections}
          error={error}
        />
      </Container>
    </div>
  );

  console.log("AgenticaChatMovie()");
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AppBar ref={upperDivRef} position="relative" component="div">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title ?? "Agentica Chatbot"}
          </Typography>
          {isMobile
            ? (
                <>
                  <IconButton onClick={() => void capture().catch(() => {})}>
                    <AddAPhotoIcon />
                  </IconButton>
                  <IconButton onClick={() => setOpenSide(true)}>
                    <ReceiptLongIcon />
                  </IconButton>
                </>
              )
            : (
                <Button
                  color="inherit"
                  startIcon={<AddAPhotoIcon />}
                  onClick={() => void capture().catch(() => {})}
                >
                  Screenshot Capture
                </Button>
              )}
        </Toolbar>
      </AppBar>
      <div
        ref={middleDivRef}
        style={{
          width: "100%",
          height: `calc(100% - ${height}px)`,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {isMobile
          ? (
              <>
                {bodyMovie()}
                <Drawer
                  anchor="right"
                  open={openSide}
                  onClose={() => setOpenSide(false)}
                >
                  {sideMovie()}
                </Drawer>
              </>
            )
          : (
              <>
                {bodyMovie()}
                {sideMovie()}
              </>
            )}
      </div>
      <AppBar
        ref={bottomDivRef}
        position="static"
        component="div"
        color="inherit"
      >
        <Toolbar>
          <Input
            inputRef={inputRef}
            fullWidth
            placeholder="Conversate with AI Chatbot"
            value={text}
            multiline={true}
            onKeyUp={e => void handleKeyUp(e).catch(() => {})}
            onChange={(e) => {
              setText(e.target.value);
              handleResize();
            }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: 10 }}
            startIcon={<SendIcon />}
            disabled={!enabled}
            onClick={() => void conversate().catch(() => {})}
          >
            Send
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export namespace AgenticaChatMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    agent: Agentica<Model>;
    title?: string;
  }
}
