import type { IMessage } from "./IMessage";

export interface IAgentServiceBase {
  messages: IMessage[];
  loading: boolean;
  sendMessage: (message: string) => Promise<void>;
}
