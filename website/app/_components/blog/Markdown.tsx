import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ ...props }) => (
          <h1 {...props} className="text-2xl text-zinc-50 pt-8 pb-4" />
        ),
        h2: ({ ...props }) => (
          <h2 {...props} className="text-xl text-zinc-50 pt-6 pb-3" />
        ),
        h3: ({ ...props }) => (
          <h3 {...props} className="text-lg text-zinc-50 pt-4 pb-2" />
        ),
        h4: ({ ...props }) => (
          <h4 {...props} className="text-base text-zinc-50" />
        ),
        h5: ({ ...props }) => (
          <h5 {...props} className="text-sm text-zinc-50" />
        ),
        h6: ({ ...props }) => (
          <h6 {...props} className="text-xs text-zinc-50" />
        ),
        p: ({ ...props }) => <p {...props} className="text-zinc-300" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
