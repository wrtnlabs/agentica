"use client";

import { CHAT_EXAMPLE_MESSAGE_LIST } from "@/app/_constants/landing";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useStickToBottom } from 'use-stick-to-bottom';
import { ChatBubble } from "./ChatBubble";

export function ChatExample() {
  const { isAtBottom, scrollToBottom, scrollRef, contentRef } = useStickToBottom()
  const [visibleMessage, setVisibleMessage] = useState<number>(0);

  const scrollToTop = () => {
    if (scrollRef.current) scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })};

  useEffect(() => {
    if (visibleMessage < CHAT_EXAMPLE_MESSAGE_LIST.length) {
      const delay =
        CHAT_EXAMPLE_MESSAGE_LIST[visibleMessage].message.split(/\n/).length *
          50 +
        1000;

      const timeout = setTimeout(() => {
        setVisibleMessage((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } 
  }, [visibleMessage]);


  return (
    <div className="hidden shrink-0 relative z-10 px-3 w-[480px] h-[800px] bg-[#27272A]/70 backdrop-blur-[10px] md:block rounded-[20px]">
      <div
        ref={scrollRef}
        className="group h-full py-6 px-3 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400"
      >
        <div ref={contentRef} className="flex flex-col gap-6">
          {CHAT_EXAMPLE_MESSAGE_LIST.slice(0, visibleMessage).map(
            (message, i) => {
              return <div key={i}><ChatBubble {...message} /></div>
            }
          )}
        </div>

        {visibleMessage >= 4 && (
          <button
            onClick={() => isAtBottom ? scrollToTop() : scrollToBottom()}
            className="hidden group-hover:block cursor-pointer absolute bottom-4 left-[50%] bg-zinc-700/70 text-zinc-100 p-2 rounded-full w-fit"
            style={{
              transform: isAtBottom ? "translate(-50%,-50%) rotate(180deg)" : "translate(-50%,-50%) rotate(0)",
              transition: "transform 0.3s",
            }}
          >
            <ArrowDown size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
