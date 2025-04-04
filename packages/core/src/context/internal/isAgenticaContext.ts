import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../AgenticaContext";
import type { MicroAgenticaContext } from "../MicroAgenticaContext";

/**
 * @internal
 */
export function isAgenticaContext<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
): ctx is AgenticaContext<Model> {
  return typeof (ctx as AgenticaContext<Model>).initialize === "function";
}
