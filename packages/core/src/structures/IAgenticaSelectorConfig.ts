export interface IAgenticaSelectorConfig {
  /**
   * Candidate operation selection strategy.
   *
   * - `llm` and `standard` preserve the current full-catalog LLM selector.
   * - `local` uses the dependency-free local operation index only.
   * - `hybrid` narrows candidates with the local index, then asks the LLM
   *   selector to choose within that smaller catalog.
   * - `auto` preserves `llm` below the configured character threshold and uses
   *   `hybrid` above it.
   *
   * @default "llm"
   */
  type?: "llm" | "standard" | "local" | "hybrid" | "auto";

  /**
   * Maximum number of local index results to project.
   *
   * @default 12
   */
  topK?: number;

  /**
   * Minimum lexical score accepted from the local index.
   *
   * @default 0
   */
  minScore?: number;

  /**
   * Fallback behavior when the local index finds no candidates.
   *
   * @default "llm"
   */
  fallback?: "llm" | "none";

  /**
   * Character heuristic used by `auto` mode when provider context size and
   * tokenizer details are not available.
   *
   * @default 24000
   */
  autoThresholdCharacters?: number;
}
