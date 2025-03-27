import {
  Agentica,
  AgenticaDescribeEvent,
  AgenticaOperationSelection,
  AgenticaPrompt,
  AgenticaSelectEvent,
  AgenticaTextEvent,
  AgenticaTokenUsage,
} from "@agentica/core";
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
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ILlmSchema } from "@samchon/openapi";
import { toPng } from "html-to-image";
import React, { ReactElement, useEffect, useRef, useState } from "react";

import { AgenticaChatMessageMovie } from "./messages/AgenticaChatMessageMovie";
import { AgenticaChatSideMovie } from "./sides/AgenticaChatSideMovie";


const SIDE_WIDTH = 450;

interface IProps<Model extends ILlmSchema.Model> {
  agent: Agentica<Model>;
  title?: string;
}

export const AgenticaChatMovie = <Model extends ILlmSchema.Model>({
  agent,
  title,
}: IProps<Model>) => {
  //----
  // VARIABLES
  //----
  // REFERENCES
  const upperDivRef = useRef<HTMLDivElement>(null);
  const middleDivRef = useRef<HTMLDivElement>(null);
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // STATES
  const [error, setError] = useState<Error | null>(null);
  const [text, setText] = useState("");
  const [histories, setHistories] = useState<AgenticaPrompt<Model>[]>(
    agent.getPromptHistories().slice(),
  );
  const [tokenUsage, setTokenUsage] = useState<AgenticaTokenUsage>(
    JSON.parse(JSON.stringify(agent.getTokenUsage())),
  );
  const [height, setHeight] = useState(122);
  const [enabled, setEnabled] = useState(true);
  const [selections, setSelections] = useState<
    AgenticaOperationSelection<Model>[]
  >([]);
  const [openSide, setOpenSide] = useState(false);

  //----
  // EVENT INTERACTIONS
  //----
  // EVENT LISTENERS
  const handleText = async (event: AgenticaTextEvent) => {
    await event.join(); // @todo Jaxtyn: streaming
    histories.push(event.toPrompt());
    setHistories(histories);
  };
  const handleDescribe = async (event: AgenticaDescribeEvent<Model>) => {
    await event.join(); // @todo Jaxtyn: streaming
    histories.push(event.toPrompt());
    setHistories(histories);
  };
  const handleSelect = (evevnt: AgenticaSelectEvent<Model>) => {
    histories.push(evevnt.toPrompt());
    setHistories(histories);

    selections.push(evevnt.selection);
    setSelections(selections);
  };

  // INITIALIZATION
  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.select();
    agent.on("text", handleText);
    agent.on("describe", handleDescribe);
    agent.on("select", handleSelect);
    setTokenUsage(agent.getTokenUsage());
    return () => {
      agent.off("text", handleText);
      agent.off("describe", handleDescribe);
      agent.off("select", handleSelect);
    };
  }, []);

  // EVENT HANDLERS
  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      if (enabled === false) event.preventDefault();
      else await conversate();
    }
  };

  const handleResize = () => {
    setTimeout(() => {
      if (
        upperDivRef.current === null ||
        middleDivRef.current === null ||
        bottomDivRef.current === null
      )
        return;
      const newHeight: number =
        upperDivRef.current.clientHeight + bottomDivRef.current.clientHeight;
      if (newHeight !== height) setHeight(newHeight);
    });
  };

  const conversate = async () => {
    setText("");
    setEnabled(false);
    handleResize();
    try {
      await agent.conversate(text);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        setError(error);
      } else setError(new Error("Unknown error"));
      return;
    }

    histories.splice(0, histories.length);
    histories.push(...agent.getPromptHistories());
    setHistories(histories);
    setTokenUsage(agent.getTokenUsage());
    setEnabled(true);

    const selections: AgenticaOperationSelection<Model>[] = agent
      .getPromptHistories()
      .filter((h) => h.type === "select")
      .map((h) => h.selections)
      .flat();
    for (const cancel of agent
      .getPromptHistories()
      .filter((h) => h.type === "cancel")
      .map((h) => h.selections)
      .flat()) {
      const index: number = selections.findIndex(
        (s) =>
          s.operation.protocol === cancel.operation.protocol &&
          s.operation.controller.name === cancel.operation.controller.name &&
          s.operation.function.name === cancel.operation.function.name,
      );
      if (index !== -1) selections.splice(index, 1);
    }
    setSelections(selections);
  };

  const capture = async () => {
    if (bodyContainerRef.current === null) return;

    const dataUrl = await toPng(bodyContainerRef.current, {});
    const link = document.createElement("a");
    link.download = "nestia-chat-screenshot.png";
    link.href = dataUrl;
    link.click();
    link.remove();
  };

  //----
  // RENDERERS
  //----
  const theme: Theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("lg"));
  const Body = (): ReactElement => (
    <div
      className={"overflow-y-auto w-full m-0 bg-blue-200"}
    >
      <Container
        className="bg-blue-200"
        style={{
          paddingBottom: 50,
          width: "100%",
          minHeight: "100%",
          margin: 0,
        }}
        ref={bodyContainerRef}
      >
        {histories
          .map((prompt, idx) => <AgenticaChatMessageMovie key={`idx-${idx}`} prompt={prompt} />)
          .filter((elem) => elem !== null)}
      </Container>
    </div>
  );
  const sideMovie = (): ReactElement => (
    <div
      className='h-full overflow-y-auto bg-gray-100'
      style={{
        width: isMobile ? undefined : SIDE_WIDTH,
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

  return (
    <div className="w-full	h-[calc(100vh-64px)] flex flex-col">
      <AppBar ref={upperDivRef} position="static" component="div">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title ?? "Agentica Chatbot"}
          </Typography>
          {isMobile ? (
            <>
              <IconButton onClick={capture}>
                <AddAPhotoIcon />
              </IconButton>
              <IconButton onClick={() => setOpenSide(true)}>
                <ReceiptLongIcon />
              </IconButton>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<AddAPhotoIcon />}
              onClick={capture}
            >
              Screenshot Capture
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div
        ref={middleDivRef}
        className="w-full h-full flex flex-row"
      >
        {isMobile ? (
          <>
            <Body/>
            <Drawer
              anchor="right"
              open={openSide}
              onClose={() => setOpenSide(false)}
            >
              {sideMovie()}
            </Drawer>
          </>
        ) : (
          <>
            <Body/>
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
            onKeyUp={handleKeyUp}
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
            onClick={conversate}
          >
            Send
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
