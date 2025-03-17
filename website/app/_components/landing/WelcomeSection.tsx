import { Button } from "@/app/_components/common/button";
import { GithubIcon } from "@/app/_components/icons/Github";
// import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ChatExample } from "./ChatExample";

export function WelcomeSection() {
  return (
    <div className="relative flex h-[calc(100vh_-_78px)] items-center justify-center md:justify-between gap-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(41,41,48,0.75)_0%,rgba(25,25,28,0.57)_53%,rgba(3,3,3,0)_100%)] px-20 py-8 md:gap-6 mx-auto max-w-[1280px]">
      <div className="flex flex-col gap-9 z-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-[80px] font-semibold text-zinc-50 md:text-start">
            Agentica
          </h1>
          <p className="text-center text-xl whitespace-pre-line text-[#767676] md:text-start">
            {
              "Agentic AI Framework specialized in LLM Function Calling\n enhanced by TypeScript compiler skills"
            }
          </p>
        </div>
        <div className="flex flex-col gap-[18px] md:flex-row">
          <Link href="/docs">
            <Button variant="secondary" className="w-full md:w-[240px]">
              📖 Guide Docs
              {/* <ArrowUpRight /> */}
            </Button>
          </Link>
          <Link href="https://github.com/wrtnlabs/agentica" target="_blank">
            <Button className="w-full md:w-[180px]">
              <GithubIcon width={24} height={24} className="h-6 w-6" />
              Github
            </Button>
          </Link>
        </div>
      </div>
      <ChatExample />
      <img
        src="/agentica/welcome_bg.png"
        alt="background"
        className="top-[50%] left-[50%] transform-[translate(-50%,-50%)] h-screen object-cover opacity-30 absolute md:w-[70%] md:h-auto"
      />
    </div>
  );
}
