import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaConfig } from "../structures/IAgenticaConfig";

import { Singleton } from "../utils/Singleton";

import { AgenticaSystemPrompt } from "./AgenticaSystemPrompt";

/**
 * @TODO maybe this code will rewrite
 */
const isNode = new Singleton(() => {
  const isObject = (obj: any) => typeof obj === "object" && obj !== null;
  return (
    // eslint-disable-next-line no-restricted-globals
    typeof global === "object"
    // eslint-disable-next-line no-restricted-globals
    && isObject(global)
    // eslint-disable-next-line node/prefer-global/process, no-restricted-globals
    && isObject(global.process)
    // eslint-disable-next-line node/prefer-global/process, no-restricted-globals
    && isObject(global.process.versions)
    // eslint-disable-next-line node/prefer-global/process, no-restricted-globals
    && typeof global.process.versions.node !== "undefined"
  );
});

/**
 * @TODO maybe replace `process` property for lint pass
 */
const getLocale = new Singleton(() =>
  isNode.get()
    // eslint-disable-next-line node/prefer-global/process
    ? (process.env.LANG?.split(".")[0] ?? "en-US")
    : navigator.language,
);

const getTimezone = new Singleton(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone,
);

export function write<Model extends ILlmSchema.Model>(config?: IAgenticaConfig<Model>): string {
  if (config?.systemPrompt?.common !== undefined) {
    return config?.systemPrompt?.common(config);
  }

  const locale: string = config?.locale ?? getLocale.get();
  const timezone: string = config?.timezone ?? getTimezone.get();

  return AgenticaSystemPrompt.COMMON
    // intended code
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${locale}", locale)
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${timezone}", timezone);
}
export const AgenticaDefaultPrompt = {
  write,
};
