import type { IMicroAgenticaRpcListener } from "./IMicroAgenticaRpcListener";

export class McpAgenticaRpcListener {
  public constructor(private readonly driver: IMicroAgenticaRpcListener) {}
}
