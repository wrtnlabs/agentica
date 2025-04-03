import { ChatMessageType } from "@/app/_constants/landing";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { SquareArrowDownRight, SquareCheckBig, UserRound } from "lucide-react";
import Image from "next/image";
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
      agent: "bg-white w-[340px] text-zinc-700",
    },
  },
});

interface ChatBubbleProps extends ChatMessageType {
  callback: () => void;
}

export function ChatBubble({ author, message, type, callback }: ChatBubbleProps) {
  const isAgent = author === "agent";
  const sentences = message.split(/\n/);
  const [viewSentences, setViewSentences] = useState<string[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    sentences.forEach((sentence, index) => {
      const timeoutId = setTimeout(() => {
        setViewSentences((prev) => [...prev, sentence]);
        callback()
      }, 50 * index);
      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex gap-2 w-full">
      {isAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 flex justify-center items-center rounded-full bg-[#D2FBF9]"
        >
          <Image src="/agentica/agent.svg" alt="agent" width={20} height={20} />
        </motion.div>
      )}
      <div className={chatBubbleVariants({ author })}>
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

        <div className="flex flex-col">
          {viewSentences.map((sentence, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                transition: "opacity 0.4s ease-in-out",
              }}
            >
              <Markdown>{sentence}</Markdown>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
