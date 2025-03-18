import { CHAT_BUBBLE_DELAY, ChatMessageType } from "@/app/_constants/landing";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { SquareArrowDownRight, SquareCheckBig, UserRound } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { Markdown } from "./Markdown";

const TYPE_SELECTOR: Record<
  Exclude<ChatMessageType["type"], undefined>,
  { icon: ReactNode; label: string }
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

const chatBubbleVariants = cva("py-4 px-5 rounded-2xl flex flex-col gap-4", {
  variants: {
    author: {
      user: "bg-zinc-600 max-w-[272px] ml-auto text-zinc-100",
      agent: "bg-white max-w-[340px] text-zinc-700",
    },
  },
});

export function ChatBubble({ author, messages, type }: ChatMessageType) {
  const [visibleTexts, setVisibleTexts] = useState<number>(0);

  useEffect(() => {
    if (visibleTexts < messages.length) {
      const timeout = setTimeout(() => {
        setVisibleTexts((prev) => prev + 1);
      }, CHAT_BUBBLE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [visibleTexts, messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={chatBubbleVariants({ author })}
    >
      {type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-fit font-bold text-xs rounded-full border-[#06474C] text-[#06474C] border px-2 py-1 flex gap-1"
        >
          {TYPE_SELECTOR[type].icon}
          {TYPE_SELECTOR[type].label}
        </motion.div>
      )}
      {messages.slice(0, visibleTexts).map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Markdown>{message}</Markdown>
        </motion.div>
      ))}
    </motion.div>
  );
}
