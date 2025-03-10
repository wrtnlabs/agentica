export abstract class AgenticaEventBase<Type extends string> {
  public readonly type: Type;

  public constructor(type: Type) {
    this.type = type;
  }
}
