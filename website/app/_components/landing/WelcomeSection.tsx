import { Button } from "@/app/_components/common/button";
import { GithubIcon } from "@/app/_components/icons/Github";
import Link from "next/link";
import { ChatExample } from "./ChatExample";
import { ArrowUpRight } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="relative flex h-[calc(100vh-64px)] items-center justify-center md:justify-between gap-0 bg-[radial-gradient(71.43%_49.13%_at_50%_50%,rgba(41,41,48,0.75)_0%,rgba(25,25,28,0.57)_53%,rgba(3,3,3,0)_100%)] px-5 md:px-20 py-8 md:gap-6 mx-auto max-w-[1440px]">
      <div className="flex flex-col gap-3 z-10 items-center max-w-[800px] w-full flex-1">
        <img
          src="/agentica/AgenticaFN.png"
          className="w-[180px] h-[180px] rounded-full md:w-[240px] md:h-[240px] lg:w-[300px] lg:h-[300px]"
        />
        <div className="flex flex-col gap-9 z-10 items-center">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-center text-[48px] font-semibold text-zinc-50 md:text-start md:text-[72px] lg:text-[80px]">
              Agentica
            </h1>
            <p className="text-center text-[15px] text-zinc-300  md:text-[18px] lg:text-xl whitespace-pre-line">
              {
                "Agentic AI Framework specialized in LLM Function Calling\n enhanced by TypeScript compiler skills"
              }
            </p>
          </div>
          <div className="flex flex-col w-full gap-[18px] md:flex-row md:w-auto">
            <Link href="/docs" className="flex-1">
              <Button variant="secondary" className="w-full md:w-[180px]">
                Docs
                <ArrowUpRight />
              </Button>
            </Link>
            <Link
              href="https://github.com/wrtnlabs/agentica"
              className="flex-1"
              target="_blank"
            >
              <Button className="w-full md:w-[180px]">
                Github
                <GithubIcon width={24} height={24} className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ChatExample />
    </div>
  );
}
