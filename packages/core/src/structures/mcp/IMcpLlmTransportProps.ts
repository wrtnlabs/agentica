import type { SSEClientTransportOptions } from "@modelcontextprotocol/sdk/client/sse";
import type { StdioServerParameters } from "@modelcontextprotocol/sdk/client/stdio";

export type IMcpLlmTransportProps = IMcpLlmTransportPropsHttp | IMcpLlmTransportPropsStdio;

export interface IMcpLlmTransportPropsHttp extends IMcpLlmTransportPropsBase<"http">, SSEClientTransportOptions {
  url: URL;
}
export interface IMcpLlmTransportPropsStdio extends IMcpLlmTransportPropsBase<"stdio">, StdioServerParameters {}

export interface IMcpLlmTransportPropsBase<T extends string> {
  name: string;
  version: string;
  type: T;
}
