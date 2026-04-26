/**
 * Reasoning payload for function-call replay.
 *
 * OpenAI-compatible providers can expose additional reasoning fields on
 * assistant messages returned through the OpenAI SDK shape. Agentica stores
 * the allowlisted fields required to replay the assistant tool-call message
 * before the related tool result message.
 *
 * @author Samchon
 */
export interface AgenticaCallReasoningPayload {
  /**
   * Reasoning fields from the assistant message that created a function call.
   *
   * This property is not application metadata. It stores only internally
   * allowlisted assistant-message top-level fields that must survive history
   * and event serialization. The current allowlist is keys whose names start
   * with `reasoning`, such as `reasoning`, `reasoning_content`, and
   * `reasoning_details`.
   *
   * Agentica reattaches these fields to the reconstructed assistant message
   * immediately before the related tool result message. It does not store
   * arbitrary provider metadata or tool-call item extensions.
   */
  assistant?: Record<string, unknown>;
}
