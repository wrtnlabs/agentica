export abstract class AgenticaEventBase<
  Type extends string,
  Json extends { type: Type },
> {
  public readonly type: Type;

  public constructor(type: Type) {
    this.type = type;
  }

  public abstract toJSON(): Json;
}
