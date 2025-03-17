import { ChatMessageType } from "@/app/_constants/landing";
import { cva } from "class-variance-authority";
import {
  ChevronDown,
  SquareArrowDownRight,
  SquareCheckBig,
  UserRound,
} from "lucide-react";
import { SVGAttributes } from "react";

import { Markdown } from "./Markdown";

const TYPE_SELECTOR: Record<
  Exclude<ChatMessageType["type"], undefined>,
  { icon: SVGAttributes<SVGElement>; label: string }
> = {
  assistant: { icon: <UserRound size={16} />, label: "Assistant" },
  func_selector: {
    icon: <SquareCheckBig size={16} />,
    label: "Function Selector",
  },
  func_describer: {
    icon: <SquareArrowDownRight size={16} />,
    label: "Function Describer",
  },
};

const chatBubbleVariants = cva("py-4 px-5 rounded-2xl flex flex-col gap-4 ", {
  variants: {
    author: {
      user: "bg-zinc-600 max-w-[272px] ml-auto text-zinc-100",
      agent: "bg-white max-w-[340px] text-zinc-700",
    },
  },
});

export function ChatBubble({ author, messages, type }: ChatMessageType) {
  const isFuncCall = type === "func_selector" || type === "func_describer";

  return (
    <div className={chatBubbleVariants({ author })}>
      {type && (
        <div className="w-fit font-bold text-xs rounded-full border-[#06474C] text-[#06474C] border px-2 py-1 flex gap-1">
          <>{TYPE_SELECTOR[type].icon}</>
          {TYPE_SELECTOR[type].label}
        </div>
      )}
      {messages.map((message, index) => (
        <Markdown key={index}>{message}</Markdown>
      ))}
      {isFuncCall && (
        <div className="flex gap-1 py-1 px-2 text-[#848470] text-xs font-bold cursor-not-allowed">
          <ChevronDown size={16} strokeWidth={2} />
          SHOW FUNCTION DESCRIPTION
        </div>
      )}
    </div>
  );
}
