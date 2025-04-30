import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const Code = {
  code: ({ className, ...props }) => {
    const language = /language-(\w+)/.exec(className || "");
    const code = props.children;
    const isBlock = props.children && props.children.length > 1;

    if (!isBlock) {
      return <code {...props} className="bg-zinc-100">{code}</code>;
    }

    return (
      <div className="flex flex-col gap-2 border bg-zinc-50 p-2 border-zinc-200 rounded-md">
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-400">{language && language?.length > 1 ? language[1] : ""}</p>
          <button
            className="text-sm text-zinc-600 px-3 py-2 cursor-pointer"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
            }}
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={vs2015}
          highlighter="hljs"
          language={language && language?.length > 1 ? language[1] : "javascript"}
        >
          {String(code)}
        </SyntaxHighlighter>
      </div>
    );
  },
};
