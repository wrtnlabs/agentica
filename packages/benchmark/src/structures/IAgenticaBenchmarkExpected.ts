import { AgenticaOperation } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

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
export type IAgenticaBenchmarkExpected<Model extends ILlmSchema.Model> =
  | IAgenticaBenchmarkExpected.IAllOf<Model>
  | IAgenticaBenchmarkExpected.IAnyOf<Model>
  | IAgenticaBenchmarkExpected.IArray<Model>
  | IAgenticaBenchmarkExpected.IStandalone<Model>;
export namespace IAgenticaBenchmarkExpected {
  /**
   * All of them must meet the condition, but sequence is not important.
   */
  export interface IAllOf<Model extends ILlmSchema.Model> {
    type: "allOf";
    allOf: Array<
      Exclude<
        IAgenticaBenchmarkExpected<Model>,
        IAgenticaBenchmarkExpected.IAllOf<Model>
      >
    >;
  }

  /**
   * At least one of them must meet the condition.
   */
  export interface IAnyOf<Model extends ILlmSchema.Model> {
    type: "anyOf";
    anyOf: Array<
      Exclude<
        IAgenticaBenchmarkExpected<Model>,
        IAgenticaBenchmarkExpected.IAnyOf<Model>
      >
    >;
  }

  /**
   * All of them must meet the condition, and sequence is important.
   */
  export interface IArray<Model extends ILlmSchema.Model> {
    type: "array";
    items: Array<
      Exclude<
        IAgenticaBenchmarkExpected<Model>,
        IAgenticaBenchmarkExpected.IArray<Model>
      >
    >;
  }

  /**
   * Standalone operation.
   */
  export interface IStandalone<Model extends ILlmSchema.Model> {
    type: "standalone";
    operation: AgenticaOperation<Model>;
  }
}
