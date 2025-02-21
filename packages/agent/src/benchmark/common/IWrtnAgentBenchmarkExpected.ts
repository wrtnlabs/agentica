import { IWrtnAgentOperation } from "../../structures/IWrtnAgentOperation";

export type IWrtnAgentBenchmarkExpected =
  | IWrtnAgentBenchmarkExpected.IAllOf
  | IWrtnAgentBenchmarkExpected.IAnyOf
  | IWrtnAgentBenchmarkExpected.IArray
  | IWrtnAgentBenchmarkExpected.IStandalone;
export namespace IWrtnAgentBenchmarkExpected {
  /**
   * 이들 모두가 실행되어야 만족이되, 순서는 중요하지 않음.
   */
  export interface IAllOf {
    type: "allOf";
    allOf: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IAllOf>
    >;
  }

  /**
   * 이 중 단 하나만 실행되어도 만족.
   */
  export interface IAnyOf {
    type: "anyOf";
    anyOf: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IAnyOf>
    >;
  }

  /**
   * 이들 모두가 순서대로 실행되어야 함.
   */
  export interface IArray {
    type: "array";
    items: Array<
      Exclude<IWrtnAgentBenchmarkExpected, IWrtnAgentBenchmarkExpected.IArray>
    >;
  }

  /**
   * 단독 실행 조건.
   */
  export interface IStandalone {
    type: "standalone";
    operation: IWrtnAgentOperation;
  }
}
