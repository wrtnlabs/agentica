import type { IMessage } from "./IMessage";

export interface IMemoryBase {
  message: {
    getAll: () => Promise<IMessage[]>;
    set: (messages: IMessage[]) => Promise<void>;
  };
  chat: {
    getAll: () => Promise<IMessage[]>;
    set: (messages: IMessage) => Promise<void>;
  };
}
