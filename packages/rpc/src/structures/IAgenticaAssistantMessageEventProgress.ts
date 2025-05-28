export interface IAgenticaAssistantMessageEventProgress {
  type: "assistantMessagePiece";
  sequence: number;
  text: string;
  done: boolean;
}
