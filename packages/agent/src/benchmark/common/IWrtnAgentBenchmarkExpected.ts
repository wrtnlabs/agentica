import { IWrtnAgentOperation } from "../../structures/IWrtnAgentOperation";

/**
 * Expected operation determinant.
 *
 * `IWrtnAgentBenchmarkExpected` is a type for determining what
 * operation is expected in the benchmarking.
 *
 * And `IWrtnAgentBenchmarkExpected` is an union type of 4 types,
 * especially designed for the detailed determination of the expected
 * operations.
 *
 * @author Samchon
 */
export type IWrtnAgentBenchmarkExpected =
  | IWrtnAgentBenchmarkExpected.IAllOf
  | IWrtnAgentBenchmarkExpected.IAnyOf
  | IWrtnAgentBenchmarkExpected.IArray
  | IWrtnAgentBenchmarkExpected.IStandalone;
export namespace IWrtnAgentBenchmarkExpected {
  /**
   * All of them must meet the condition, but sequence is not important.
   */
  export interface IAllOf {
    type: "allOf";
    allOf: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IAllOf>
    >;
  }

  /**
   * At least one of them must meet the condition.
   */
  export interface IAnyOf {
    type: "anyOf";
    anyOf: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IAnyOf>
    >;
  }

  /**
   * All of them must meet the condition, and sequence is important.
   */
  export interface IArray {
    type: "array";
    items: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IArray>
    >;
  }

  /**
   * Standalone operation.
   */
  export interface IStandalone {
    type: "standalone";
    operation: IWrtnAgentOperation;
  }
}
