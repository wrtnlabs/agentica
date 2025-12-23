import { is_node } from "tstl";

import type { IAgenticaConfig } from "../structures/IAgenticaConfig";
import type { IMicroAgenticaConfig } from "../structures/IMicroAgenticaConfig";
import type { IMicroAgenticaSystemPrompt } from "../structures/IMicroAgenticaSystemPrompt";

import { Singleton } from "../utils/Singleton";

import { AgenticaSystemPrompt } from "./AgenticaSystemPrompt";

/**
 * @TODO maybe replace `process` property for lint pass
 */
const getLocale = new Singleton(() =>
  is_node()
    // eslint-disable-next-line node/prefer-global/process
    ? (process.env.LANG?.split(".")[0] ?? "en-US")
    : navigator.language,
);

const getTimezone = new Singleton(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone,
);

export function write(config?: IAgenticaConfig | IMicroAgenticaConfig): string {
  if (config?.systemPrompt?.common !== undefined) {
    return (config.systemPrompt as IMicroAgenticaSystemPrompt).common!(config as unknown as IMicroAgenticaConfig);
  }

  const locale: string = config?.locale ?? getLocale.get();
  const timezone: string = config?.timezone ?? getTimezone.get();

  return AgenticaSystemPrompt.COMMON
  // intended code

    .replace("${locale}", locale)

    .replace("${timezone}", timezone)

    .replace("${datetime}", new Date().toISOString());
}
export const AgenticaDefaultPrompt = {
  write,
};
