import React from "react";
import ReactMarkdown from "react-markdown";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        p: ({ ...props }) => <p {...props} className="text-sm" />,
        h3: ({ ...props }) => <h4 {...props} className="font-bold text-base" />,
        h4: ({ ...props }) => <h4 {...props} className="font-bold text-sm" />,
        ul: ({ ...props }) => (
          <ul
            {...props}
            className="whitespace-normal list-inside list-disc pl-2 text-sm"
          />
        ),
        ol: ({ ...props }) => (
          <ol
            {...props}
            className="whitespace-normal list-inside list-decimal pl-2 text-sm"
          />
        ),
        li: ({ ...props }) => (
          <li
            className="marker:absolute marker:-left-[2px] marker:mr-[2px]"
            {...props}
          />
        ),
        img: ({ ...props }) => (
          <img {...props} className="block w-max-full h-auto" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
