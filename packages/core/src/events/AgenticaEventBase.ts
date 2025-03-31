export interface AgenticaEventBase<Type extends string> {
  /**
   * Discriminator type.
   */
  type: Type;
}
