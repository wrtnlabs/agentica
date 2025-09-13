export class AssistantMessageEmptyError extends Error {
  constructor() {
    super();
    const proto = new.target.prototype;
    // eslint-disable-next-line
    if (Object.setPrototypeOf) { Object.setPrototypeOf(this, proto); }
    else {
      // eslint-disable-next-line
      (this as any).__proto__ = proto; 
    }
  }
}

export class AssistantMessageEmptyWithReasoningError extends AssistantMessageEmptyError {
  public readonly reasoning: string;
  constructor(reasoning: string) {
    super();
    this.reasoning = reasoning;
  }
}
