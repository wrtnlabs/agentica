import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{children}</ReactMarkdown>;
}
