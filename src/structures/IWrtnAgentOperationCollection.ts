import { IWrtnAgentOperation } from "./IWrtnAgentOperation";

/**
 * Collection of operations used in the Nestia Agent.
 *
 * `IWrtnAgentOperationCollection` is an interface type representing
 * a collection of operations for several purposes used in the
 * {@link WrtnAgent} internally.
 *
 * @author Samchon
 */
export interface IWrtnAgentOperationCollection {
  /**
   * List of every operations.
   */
  array: IWrtnAgentOperation[];

  /**
   * Divided operations.
   *
   * If you've configured the {@link IWrtnAgentConfig.capacity} property,
   * the  A.I. chatbot ({@link WrtnAgent}) will separate the operations
   * into the several groups to divide and conquer and LLM function selecting
   * for accuracy.
   *
   * In that case, this property `divided`'s length would be dtermined by
   * dividing the number of operations ({@link array}'s length) by the
   * {@link IWrtnAgentConfig.capacity}.
   *
   * Otherwise, if the {@link IWrtnAgentConfig.capacity} has not been
   * configured, this `divided` property would be the `undefined` value.
   */
  divided?: IWrtnAgentOperation[][] | undefined;

  /**
   * Flat dictionary of operations.
   *
   * Dictionary of operations with their {@link IWrtnAgentOperation.name}.
   */
  flat: Map<string, IWrtnAgentOperation>;

  /**
   * Group dictionary of operations.
   *
   * Dictionary of operations with their
   * {@link IWrtnAgentOperation.controller.name} and
   * {@link IWrtnAgentOperation.function.name}.
   */
  group: Map<string, Map<string, IWrtnAgentOperation>>;
}
