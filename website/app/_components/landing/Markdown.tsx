import React from "react";
import ReactMarkdown from "react-markdown";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  const regex = /^ {2,}-\s/;
  if (regex.test(children)) {
    const content = children.replace(regex, "");
    const pl = Math.floor((children.match(/^ */)?.[0].length || 2) / 2) + 2;

    return (
      <ul
        className={`whitespace-normal list-inside list-disc text-sm`}
        style={{ paddingLeft: `${pl}rem` }}
      >
        <li className="marker:absolute marker:-left-[4px] marker:mr-[4px]">
          {content}
        </li>
      </ul>
    );
  }

  if (children === "") return <br />;

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
          // eslint-disable-next-line @next/next/no-img-element
          <img {...props} alt="image" className="block w-max-full h-auto" />
        ),
        hr: ({ ...props }) => <hr {...props} className="border-zinc-700" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
