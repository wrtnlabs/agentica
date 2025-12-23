import type { AgenticaContext } from "../AgenticaContext";
import type { MicroAgenticaContext } from "../MicroAgenticaContext";

/**
 * @internal
 */
export function isAgenticaContext(
  ctx: AgenticaContext | MicroAgenticaContext,
): ctx is AgenticaContext {
  return typeof (ctx as AgenticaContext).initialize === "function";
}
