import { IWrtnAgentConfig } from "../structures/IWrtnAgentConfig";
import { Singleton } from "./Singleton";
import { WrtnAgentSystemPrompt } from "./WrtnAgentSystemPrompt";

export namespace WrtnAgentDefaultPrompt {
  export const write = (
    config?: IWrtnAgentConfig.WithoutAgentExecutePlan,
  ): string => {
    if (config?.systemPrompt?.common)
      return config?.systemPrompt?.common(config);

    const locale: string = config?.locale ?? getLocale.get();
    const timezone: string = config?.timezone ?? getTimezone.get();

    return WrtnAgentSystemPrompt.COMMON.replace("${locale}", locale).replace(
      "${timezone}",
      timezone,
    );
  };
}

const getLocale = new Singleton(() =>
  isNode.get()
    ? (process.env.LANG?.split(".")[0] ?? "en-US")
    : navigator.language,
);

const getTimezone = new Singleton(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone,
);

const isNode = new Singleton(() => {
  const isObject = (obj: any) => typeof obj === "object" && obj !== null;
  return (
    typeof global === "object" &&
    isObject(global) &&
    isObject(global.process) &&
    isObject(global.process.versions) &&
    typeof global.process.versions.node !== "undefined"
  );
});
