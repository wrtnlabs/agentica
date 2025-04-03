"use client";

import { CHAT_EXAMPLE_MESSAGE_LIST } from "@/app/_constants/landing";
import { useIntersectionObserver } from "@/app/_hooks/useIntersectionObserver";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatBubble } from "./ChatBubble";

export function ChatExample() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);

  const [visibleMessage, setVisibleMessage] = useState<number>(0);

  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  const scrollToTop = () => {
    if (chatContainerRef.current) chatContainerRef.current?.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    })
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
  };

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if(!chatContainer) return;

    const onScroll = () => {
      console.log("onScroll")
      setIsUserScrolling(true);
      setIsAutoScroll(false);
  
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
  
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
        if (isAtBottom && isStreaming) setIsAutoScroll(true)
      }, 200);
    };
  
    chatContainer.addEventListener('scroll', onScroll);

    return () => {
      chatContainer.removeEventListener('scroll', onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isAtBottom, isStreaming]);

  const bottomBoundaryContent = useIntersectionObserver(bottomBoundaryRef, {
    rootMargin: "0px",
  });

  useEffect(() => {
    setIsAtBottom(!!bottomBoundaryContent?.isIntersecting);
    if (isAtBottom && isStreaming && !isUserScrolling) setIsAutoScroll(true)
  }, [bottomBoundaryContent?.isIntersecting, isAtBottom, isStreaming, isUserScrolling]);


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
    } else {
      setIsStreaming(false)
    }
  }, [isAutoScroll, visibleMessage]);


  return (
    <div className="hidden shrink-0 relative z-10 px-3 w-[480px] h-[800px] bg-[#27272A]/70 backdrop-blur-[10px] md:block rounded-[20px]">
      <div
        ref={chatContainerRef}
        className="h-full py-6 px-3 flex flex-col gap-6 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400"
      >
        {CHAT_EXAMPLE_MESSAGE_LIST.slice(0, visibleMessage).map(
          (message, i) => {
            const isLast = i === visibleMessage - 1;
            return (
              <div key={i} ref={isLast ? bottomBoundaryRef : undefined}>
                <ChatBubble {...message} callback={() => {
                  if(isAutoScroll)  requestAnimationFrame(() => scrollToBottom())
                }} />
              </div>
            );
          },
        )}
      </div>

      {!isAutoScroll && (
        <button
          onClick={isAtBottom ? scrollToTop : scrollToBottom}
          className="cursor-pointer absolute bottom-4 left-[50%] bg-zinc-700/70 text-zinc-100 p-2 rounded-full w-fit"
          style={{
            transform: isAtBottom ? "translate(-50%,-50%) rotate(180deg)" : "translate(-50%,-50%) rotate(0)",
            transition: "transform 0.3s",
          }}
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
}
