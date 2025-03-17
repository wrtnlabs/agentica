"use client";

import {
  CHAT_EXAMPLE_INITIAL_MESSAGE,
  CHAT_EXAMPLE_MESSAGE_LIST,
} from "@/app/_constants/landing";

//MEMO: animation
//import { motion } from "framer-motion";
//import { useState } from "react";

import { ChatBubble } from "./ChatBubble";

export function ChatExample() {
  // const [isComplete, setIsComplete] = useState(false);
  // const messageSplit = CHAT_EXAMPLE_INITIAL_MESSAGE.split(" ");

  return (
    <div className="hidden overflow-y-scroll h-full w-[480px] rounded-[20px] bg-[#27272A] md:flex flex-col gap-6 px-7 py-6 z-10">
      {/* <motion.div
        initial={{ opacity: 1, fontSize: "30px" }}
        animate={{ opacity: 1, fontSize: isComplete ? "14px" : "30px" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {messageSplit.map((word, i) => {
          const isLast = i === messageSplit.length - 1;
          return (
            <div key={i} className="inline-block overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate="visible"
                variants={{
                  visible: (i: number) => ({
                    y: 0,
                    transition: { delay: i * 0.1 },
                  }),
                }}
                custom={i}
                className="inline-block text-zinc-100 will-change-transform"
                onAnimationComplete={() => isLast && setIsComplete(true)}
              >
                {word + (!isLast ? "\u00A0" : "")}
              </motion.div>
            </div>
          );
        })}
      </motion.div> */}
      <ChatBubble author="user" messages={[CHAT_EXAMPLE_INITIAL_MESSAGE]} />
      {CHAT_EXAMPLE_MESSAGE_LIST.map((message, i) => (
        <ChatBubble key={i} {...message} />
      ))}
    </div>
  );
}
