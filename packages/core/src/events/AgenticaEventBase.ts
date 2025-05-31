import type { tags } from "typia";

export interface AgenticaEventBase<Type extends string> {
  /**
   * Primary key of the event.
   */
  id: string;

  /**
   * Discriminator type.
   */
  type: Type;

  /**
   * Creation timestamp of the event.
   */
  created_at: string & tags.Format<"date-time">;
}
