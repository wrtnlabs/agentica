import { IAgenticaOperation } from "../json/IAgenticaOperation";

export abstract class AgenticaOperationBase<
  Protocol extends "http" | "class",
  Controller extends object,
  Function extends object,
> {
  /**
   * Protocol discriminator.
   */
  public readonly protocol: Protocol;

  /**
   * Belonged controller of the target function.
   */
  public readonly controller: Controller;

  /**
   * Target function to call.
   */
  public readonly function: Function;

  /**
   * Identifier name.
   */
  public readonly name: string;

  protected constructor(
    props: AgenticaOperationBase.IProps<Protocol, Controller, Function>,
  ) {
    this.protocol = props.protocol;
    this.controller = props.controller;
    this.function = props.function;
    this.name = props.name;
  }

  public toJSON(): IAgenticaOperation {
    return {
      protocol: this.protocol,
      controller: this.controller.constructor.name,
      function: this.function.constructor.name,
      name: this.name,
    };
  }
}
export namespace AgenticaOperationBase {
  export interface IProps<
    Protocol extends "http" | "class",
    Controller extends object,
    Function extends object,
  > {
    protocol: Protocol;
    controller: Controller;
    function: Function;
    name: string;
  }
}
