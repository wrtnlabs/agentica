import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DescriptionIcon from "@mui/icons-material/Description";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";

const Section = (props: {
  title: string;
  summary: string;
  description: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) => (
  <ListItem alignItems="flex-start">
    <ListItemButton href={props.href}>
      <ListItemAvatar>{props.icon}</ListItemAvatar>
      <ListItemText
        primary={props.title}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              sx={{ color: "text.primary", display: "inline" }}
            >
              {props.summary}
            </Typography>
            {props.description}
          </React.Fragment>
        }
      />
    </ListItemButton>
  </ListItem>
);

const Application = () => {
  return (
    <React.Fragment>
      <Typography variant="h4">Agentica Chatbot Examples</Typography>
      <hr />
      <List sx={{ width: "100%", maxWidth: 720, bgcolor: "background.paper" }}>
        <Section
          href="./playground.html"
          title="Agentica Playground"
          summary="Test your backend server's AI chatbot"
          icon={<FeaturedPlayListIcon />}
          description={
            <p>
              Upload your Swagger document file to the playground website, and
              start conversation with your backend server. Validate your backend
              server's Swagger documentation quality before developing your AI
              chatbot application.
            </p>
          }
        />
        <Divider variant="inset" component="li" />
        <Section
          href="./shopping.html"
          title="Shopping AI Chatbot"
          summary="AI chatbot by Swagger document"
          icon={<AddShoppingCartIcon />}
          description={
            <React.Fragment>
              <p>
                Shopping AI chatbot which can search products, and take orders
                just by conversation texts.
              </p>
              <p>
                This example project has been developed to prove a key concept
                of <code>nestia/agent</code> that every backend servers
                providing Swagger documents can be conversed with the AI
                chatbot. You can search products, and take orders just by
                conversation texts.
              </p>
              <p>
                If you've developed a backend server, then you can chat with the
                backend server just by delivering the Swagger document. If your
                documentation quality is enough, you can experience the new AI
                era. No more GUI development required. Just develop only backend
                server and chat with it.
              </p>
            </React.Fragment>
          }
        />
        <Divider variant="inset" component="li" />
        <Section
          href="./bbs.html"
          title="BBS AI Chatbot"
          summary="AI chatbot by TypeScript Class"
          icon={<DescriptionIcon />}
          description={
            <React.Fragment>
              <p>
                BBS (Bullet-in Board System) AI chatbot posting articles just
                by conversation texts.
              </p>
              <p>
                This example project has been developed to demonstrate{" "}
                <code>{"typia.llm.application<App, Model>()"}</code> function 
                which can generate LLM (Large Language Model) function
                calling application schema from a TypeScript class type.
              </p>
              <p>
                If you've developed a TypeScript facade class, then you can chat
                with the class just by taking the class type. If you've done
                enough documentations on the class methods and DTO (Data
                Transfer Object) types, you can experience the new AI era. No
                more GUI development required. Just develop only TypeScript
                class containing the business logics and chat with it.
              </p>
            </React.Fragment>
          }
        />
      </List>
    </React.Fragment>
  );
};

createRoot(window.document.getElementById("root")!).render(<Application />);
