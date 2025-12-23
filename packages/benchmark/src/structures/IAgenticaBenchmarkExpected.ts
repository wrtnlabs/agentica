/**
 * @module
 * This file contains the implementation of the IAgenticaBenchmarkExpected class.
 *
 * @author Wrtn Technologies
 */
import type { AgenticaOperation } from "@agentica/core";

/**
 * Expected operation determinant.
 *
 * `IAgenticaBenchmarkExpected` is a type for determining what
 * operation is expected in the benchmarking.
 *
 * And `IAgenticaBenchmarkExpected` is an union type of 4 types,
 * especially designed for the detailed determination of the expected
 * operations.
 *
 * @author Samchon
 */
export type IAgenticaBenchmarkExpected =
  | IAgenticaBenchmarkExpected.IAllOf
  | IAgenticaBenchmarkExpected.IAnyOf
  | IAgenticaBenchmarkExpected.IArray
  | IAgenticaBenchmarkExpected.IStandalone;

export namespace IAgenticaBenchmarkExpected {
  /**
   * All of them must meet the condition, but sequence is not important.
   */
  export interface IAllOf {
    type: "allOf";
    allOf: Array<
      Exclude<
        IAgenticaBenchmarkExpected,
        IAgenticaBenchmarkExpected.IAllOf
      >
    >;
  }

  /**
   * At least one of them must meet the condition.
   */
  export interface IAnyOf {
    type: "anyOf";
    anyOf: Array<
      Exclude<
        IAgenticaBenchmarkExpected,
        IAgenticaBenchmarkExpected.IAnyOf
      >
    >;
  }

  /**
   * All of them must meet the condition, and sequence is important.
   */
  export interface IArray {
    type: "array";
    items: Array<
      Exclude<
        IAgenticaBenchmarkExpected,
        IAgenticaBenchmarkExpected.IArray
      >
    >;
  }

  /**
   * Standalone operation.
   */
  export interface IStandalone {
    type: "standalone";
    operation: AgenticaOperation;
  }
}
