import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Divider, Heading, Image, Link, List, Paragraph, Quote, Table } from "./components";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // TODO
        // ...Code,
        ...Divider,
        ...Heading,
        ...Image,
        ...Link,
        ...List,
        ...Paragraph,
        ...Quote,
        ...Table,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
