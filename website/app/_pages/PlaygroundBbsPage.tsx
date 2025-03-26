"use client";

/**
 * Chatting Scripts
 * What can you do?
 * 
 * -------------
 * 
 * I will create an article. Would you help me?
 * 
 * -------------
 * 
 * Title is "Introduce `typia`, superfast runtime validator", and thumbnail URL is https://typia.io/logo.png
 * 
 * Content body is below.
 * 
 * `typia` is a transformer library supporting below features:
 * 
 * - Super-fast runtime validators
 * - Enhanced JSON schema and serde functions
 * - LLM function calling schema and structured output
 * - Protocol Buffer encoder and decoder
 * - Random data generator
 * 
 * For reference, `typia`'s runtime validator 20,000x faster than `class-validator` by utilizing the AoT (Ahead of Time) compilation strategy. Let's visit typia website https://typia.io, and enjoy its super-fast performance.
 * 
 * -------------
 * 
 * I'll create a new article more.
 * 
 * -------------
 * 
 * Title is "Introduce nestia, collection NestJS helper libraries", and thumbnail is https://nestia.io/logo.png
 * 
 * The content body is below.
 * 
 * `nestia` is a set of helper libraries for NestJS.
 * 
 * - `@nestia/core`: Super-fast decorators
 * - `@nestia/sdk`: SDK/Swagger generators with native TypeScript types
 * - `@nestia/editor`: Swawgger-UI with Online TypeScript IDE and SDK
 * - `@nestia/chat`: Super AI chatbot by Swagger document
 * 
 * 
 * For reference, runtime validator is 20,000x faster than `class-validator` by utilizing the `typia` library, and make composite server performance 30x faster.
 * 
 * Also, you can make AI chatbot just by Swagger document, so that every backend servers can be the AI chatbot. Let's enjoy the new paradigm of the AI era.
 * 
 * -------------
 * 
 * I wanna update the previous written article's title. Change it to "Introduce `nestia`, collection of NestJS helper libraries within framework of the AI era".
 * 
 * -------------
 * 
 * Would you show me every articles in the system?
 * 
 * -------------
 * 
 * I wanna delete the article which has the title "Introduce `typia`, superfast runtime validator".
 * 
 */

import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { llm, tags } from "typia";
import OpenAI from "openai";
import { Agentica } from "@agentica/core";
import { AgenticaChatMovie } from "../_components/playground/movies/AgenticaChatMovie";
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Divider } from "@mui/material";
import { Typography } from "@mui/material";
import { FormControl } from "@mui/material";


/**
 * Article entity.
 *
 * `IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).
 */
interface IBbsArticle extends IBbsArticle.ICreate {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Creation time of the article.
   */
  created_at: string & tags.Format<"date-time">;

  /**
   * Last updated time of the article.
   */
  updated_at: string & tags.Format<"date-time">;
}

export namespace IBbsArticle {
  /**
   * Information of the article to create.
   */
  export interface ICreate {
    /**
     * Title of the article.
     *
     * Representative title of the article.
     */
    title: string;

    /**
     * Content body.
     *
     * Content body of the article writtn in the markdown format.
     */
    body: string;

    /**
     * Thumbnail image URI.
     *
     * Thumbnail image URI which can represent the article.
     *
     * If configured as `null`, it means that no thumbnail image in the article.
     */
    thumbnail:
      | null
      | (string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">);
  }

  /**
   * Information of the article to update.
   *
   * Only the filled properties will be updated.
   */
  export type IUpdate = Partial<ICreate>;
}



class BbsArticleService {
  private readonly articles: IBbsArticle[] = [];

  /**
   * Get all articles.
   *
   * List up every articles archived in the BBS DB.
   *
   * @returns List of every articles
   */
  public index(): IBbsArticle[] {
    return this.articles;
  }

  /**
   * Create a new article.
   *
   * Writes a new article and archives it into the DB.
   *
   * @param props Properties of create function
   * @returns Newly created article
   */
  public create(props: {
    /**
     * Information of the article to create
     */
    input: IBbsArticle.ICreate;
  }): IBbsArticle {
    const article: IBbsArticle = {
      id:v4(),
      title: props.input.title,
      body: props.input.body,
      thumbnail: props.input.thumbnail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.articles.push(article);
    return article;
  }

  /**
   * Update an article.
   *
   * Updates an article with new content.
   *
   * @param props Properties of update function
   * @param input New content to update
   */
  public update(props: {
    /**
     * Target article's {@link IBbsArticle.id}.
     */
    id: string & tags.Format<"uuid">;

    /**
     * New content to update.
     */
    input: IBbsArticle.IUpdate;
  }): void {
    const article: IBbsArticle | undefined = this.articles.find(
      (a) => a.id === props.id,
    );
    if (article === undefined)
      throw new Error("Unable to find the matched article.");
    if (props.input.title !== undefined) article.title = props.input.title;
    if (props.input.body !== undefined) article.body = props.input.body;
    if (props.input.thumbnail !== undefined)
      article.thumbnail = props.input.thumbnail;
    article.updated_at = new Date().toISOString();
  }

  /**
   * Erase an article.
   *
   * Erases an article from the DB.
   *
   * @param props Properties of erase function
   */
  public erase(props: {
    /**
     * Target article's {@link IBbsArticle.id}.
     */
    id: string & tags.Format<"uuid">;
  }): void {
    const index: number = this.articles.findIndex((a) => a.id === props.id);
    if (index === -1) throw new Error("Unable to find the matched article.");
    this.articles.splice(index, 1);
  }
}



const BbsChatApplication = (props: {
  apiKey: string;
  model?: OpenAI.ChatModel;
  locale?: string;
  timezone?: string;
}) => {
  const service: BbsArticleService = new BbsArticleService();
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: new OpenAI({
        apiKey: props.apiKey,
        dangerouslyAllowBrowser: true,
      }),
      model: props.model ?? "gpt-4o-mini",
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: llm.application<
          BbsArticleService,
          "chatgpt"
        >(),
        execute: service,
      },
    ],
    config: {
      locale: props.locale,
      timezone: props.timezone,
      executor: {
        initialize: null,
      },
    },
  });
  return <AgenticaChatMovie agent={agent} />;
};

/**
 * Only Client Only Client
 * This Component is only rendered on the client side.
 * 
 * If you want to use this Component, you can use it by importing from the client-only.tsx file.
 */
export default function PlaygroundBbsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<"gpt-4o" | "gpt-4o-mini">("gpt-4o-mini");
  const [locale, setLocale] = useState(window.navigator.language);

  const [start, setStart] = useState(false);

  if (!mounted) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {start === true ? (
        <BbsChatApplication apiKey={apiKey} model={model} locale={locale} />
      ) : (
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
          <TextField
            onChange={(e) => setApiKey(e.target.value)}
            defaultValue={apiKey}
            label="OpenAI API Key"
            variant="outlined"
            placeholder="Your OpenAI API Key"
            error={apiKey.length === 0}
          />
          <br />
          <RadioGroup
            defaultValue={model}
            onChange={(_e, value) => setModel(value as "gpt-4o-mini")}
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
          </RadioGroup>
          <br />
          <Typography variant="h6"> Membership Information </Typography>
          <br />
          <TextField
            onChange={(e) => setLocale(e.target.value)}
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
            color={"info"}
            size="large"
            disabled={apiKey.length === 0 || locale.length === 0}
            onClick={() => setStart(true)}
          >
            Start AI Chatbot
          </Button>
        </FormControl>
      )}
    </div>
  );
}