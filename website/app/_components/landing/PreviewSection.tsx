"use client";
import { PreviewCard } from "../common/preview-card";
import Link from "next/link";


export function PreviewSection() {
  return (
      <section className="flex flex-col-reverse md:flex-row md:justify-between w-full pb-[74px] md:pb-[120px]">
        <Link href="https://wrtnlabs.io">
          <PreviewCard
            title="Agent OS"
            subtitle="Previous"
            image="/agentica/images/preview-agentOS.png"
            direction="left"
          />
          </Link>
       
        <Link href="https://wrtnlabs.io/autoview">
          <PreviewCard
            subtitle="Next"
            title="Autoview"
            image="/agentica/images/preview-autoview.png"
            direction="right"
          />
        </Link>
      </section>
  );
}
