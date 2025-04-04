"use client";
import { toast } from "react-toastify/unstyled";
import { PreviewCard } from "../common/preview-card";
import { Toast } from "../common/toast";


export function PreviewSection() {
  return (
      <section className="flex flex-col-reverse md:flex-row md:justify-between w-full pb-[74px] md:pb-[120px]">
        <PreviewCard
          title="Agent OS"
          subtitle="Previous"
          image="/agentica/images/preview-agentOS.png"
          direction="left"
          onClick={() => toast.info(<Toast message="This service will be available soon." />)}
        />
        <PreviewCard
          href="https://wrtnlabs.io/autoview/"
          subtitle="Next"
          title="Autoview"
          image="/agentica/images/preview-autoview.png"
          direction="right"
        />
      </section>
  );
}
