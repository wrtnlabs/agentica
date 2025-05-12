export interface AgenticaUserMessageContentBase<Type extends string> {
  /**
   * Discriminator for the type of content.
   */
  type: Type;
}
