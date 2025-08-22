export class AssistantMessageEmptyError extends Error {
  constructor() {
    super();
  }
}

export class AssistantMessageEmptyWithReasoningError extends AssistantMessageEmptyError {
  public readonly reasoning: string;
  constructor(reasoning: string) {
    super();
    this.reasoning = reasoning;
  }
}