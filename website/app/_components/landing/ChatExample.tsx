"use client";

import { CHAT_EXAMPLE_MESSAGE_LIST } from "@/app/_constants/landing";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatBubble } from "./ChatBubble";

export function ChatExample() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [visibleMessage, setVisibleMessage] = useState<number>(0);

  useEffect(() => {
    if (visibleMessage < CHAT_EXAMPLE_MESSAGE_LIST.length) {
      const delay =
        CHAT_EXAMPLE_MESSAGE_LIST[visibleMessage].message
          .split(/\n/)
          .filter((s) => s.trim() !== "").length *
          50 +
        1000;

      const timeout = setTimeout(() => {
        setVisibleMessage((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [visibleMessage]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hidden shrink-0 relative z-10 py-6 px-3 w-[480px] h-[800px] bg-[#27272A]/70 backdrop-blur-[10px] md:block rounded-[20px] ">
      <div
        ref={chatContainerRef}
        className="h-full px-3 flex flex-col gap-6 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400"
      >
        {CHAT_EXAMPLE_MESSAGE_LIST.slice(0, visibleMessage).map(
          (message, i) => (
            <ChatBubble key={i} {...message} />
          ),
        )}
      </div>

      {visibleMessage >= 4 && (
        <button
          onClick={scrollToBottom}
          className="cursor-pointer absolute bottom-4 left-[50%] transform-[translate(-50%,-50%)] bg-zinc-700/70 text-zinc-100 p-2 rounded-full w-fit"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
}
