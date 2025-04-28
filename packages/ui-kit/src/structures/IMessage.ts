import type { ISender } from "./ISender";

export interface IMessage {
  id: string;
  text: string;
  createdAt: Date;
  sender: ISender;
}
