export class AssistantMessageEmptyError extends Error {
  constructor() {
    super("assistantMessage is empty");
  }
}
