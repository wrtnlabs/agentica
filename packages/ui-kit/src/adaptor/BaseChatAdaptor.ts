export interface BaseChatAdaptor {
  sendMessage: (message: string) => Promise<void>;
}
