import { CardShowcase } from "../_components/common/card-showcase";
import { PreviewCard } from "../_components/common/preview-card";
import { CoreValueCard } from "../_components/landing/CoreValueCard";
import { FuncCallCard } from "../_components/landing/FuncCallCard";
import { FuncCallCode } from "../_components/landing/FuncCallCode";
import { Section } from "../_components/landing/Section";
import { WelcomeSection } from "../_components/landing/WelcomeSection";
import { CORE_VALUES, FUNC_CALLS } from "../_constants/landing";
import LenisProvider from "../_provider/LenisProvider";

export default function AgenticaPage() {
  return (
    <LenisProvider>
      {/* Welcome */}
      <WelcomeSection />

      {/* Function calling */}

      <Section
        title="Function calling"
        description="One click to turn your backend into an AI agent."
      >
        <div className="flex flex-col gap-8 rounded-4xl border border-zinc-700 p-2 lg:flex-row">
          <FuncCallCode />
          <div className="flex flex-col gap-4 rounded-3xl border border-zinc-700 p-2 md:flex-row lg:w-[394px] lg:flex-col">
            {FUNC_CALLS.map((value) => (
              <FuncCallCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Core Value"
        description="Simplicity at scale—AI for every developer."
      >
        <div className="flex flex-col gap-8 rounded-[44px] border border-zinc-700 p-2 md:flex-row">
          {CORE_VALUES.map((value) => (
            <CoreValueCard key={value.title} {...value} />
          ))}
        </div>
      </Section>

      {/* Showcase */}
      <Section
        title="Showcase"
        description="This is a minimal full-stack React application of Agentica."
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-5">
          <CardShowcase
            imageSrc="https://picsum.photos/200/300"
            title="Github Agent"
            description="Meet an AI agent that uses GitHub’s main APIs to handle your tasks—from scanning key projects to generating refined code, requesting reviews, and even committing changes. "
          />
          <CardShowcase
            imageSrc="https://picsum.photos/200/300"
            title="Github Agent"
            description="Meet an AI agent that uses GitHub’s main APIs to handle your tasks—from scanning key projects to generating refined code, requesting reviews, and even committing changes. "
          />
        </div>
      </Section>
      <section className="flex w-full pb-[74px] md:justify-end md:pb-[120px]">
        <PreviewCard
          href="/agentica/github-agent"
          title="Github Agent"
          image="https://picsum.photos/200/300"
        />
      </section>
    </LenisProvider>
  );
}
