import { EllipsisIcon } from "lucide-react";
import { Highlight } from "prism-react-renderer";

import { FUNC_CALL_CODE } from "../../_constants/landing";

export function FuncCallCode() {
  return (
    <div className="flex flex-auto flex-col gap-8 rounded-3xl border bg-[#030303] border-zinc-700 p-2">
      <div className="flex h-10 items-center justify-between rounded-2xl border border-zinc-700 px-2.5 text-zinc-700">
        <div className="flex gap-2">
          <div className="h-5 w-5 rounded-full border border-zinc-700" />
          <div className="h-5 w-5 rounded-full border border-zinc-700" />
          <div className="h-5 w-5 rounded-full border border-zinc-700" />
        </div>
        <EllipsisIcon size={20} />
      </div>

      <Highlight
        theme={{
          plain: { color: "#FFFFFF" },
          styles: [
            { types: ["property-access"], style: { color: "#79C0FF" } },
            { types: ["maybe-class-name"], style: { color: "#FFA656" } },
            { types: ["keyword"], style: { color: "#FF7B72" } },
            { types: ["string", "operator"], style: { color: "#A5D6FF" } },
            { types: ["function", "method"], style: { color: "#D2A8FF" } },
            { types: ["class-name"], style: { color: "#FFA656" } },
          ],
        }}
        code={FUNC_CALL_CODE}
        language="tsx"
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={style}
            className="m-4 h-full overflow-x-auto bg-transparent! p-2 text-left [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700/50"
          >
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                className="table-row overflow-scroll"
              >
                <span className="table-cell pr-4 text-right opacity-50 select-none">
                  {i + 1}
                </span>
                <div className="table-cell">
                  {line.map((token, i) => (
                    <span key={i} {...getTokenProps({ token })} />
                  ))}
                </div>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
