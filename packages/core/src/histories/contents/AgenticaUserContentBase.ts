export interface AgenticaUserContentBase<Type extends string> {
  /**
   * Discriminator for the type of content.
   */
  type: Type;
}
