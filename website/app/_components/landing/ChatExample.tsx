"use client";

import {
  CHAT_BUBBLE_DELAY,
  CHAT_EXAMPLE_MESSAGE_LIST,
} from "@/app/_constants/landing";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatBubble } from "./ChatBubble";

export function ChatExample() {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    if (visibleMessages < CHAT_EXAMPLE_MESSAGE_LIST.length) {
      const delay =
        CHAT_EXAMPLE_MESSAGE_LIST[visibleMessages].messages.length *
          CHAT_BUBBLE_DELAY +
        1000;

      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [visibleMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#27272A] shrink-0 relative hidden rounded-[20px] py-6 px-1 z-10 md:block w-[480px] h-[800px]">
      <div
        ref={chatContainerRef}
        className="w-[472px] h-[756px] px-6 overflow-y-scroll md:flex flex-col gap-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400"
      >
        {CHAT_EXAMPLE_MESSAGE_LIST.slice(0, visibleMessages).map(
          (message, i) => (
            <ChatBubble key={i} {...message} />
          ),
        )}
      </div>

      {visibleMessages >= 4 && (
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
