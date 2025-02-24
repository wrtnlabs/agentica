import { IAgenticaConfig } from "../structures/IAgenticaConfig";
import { IAgenticaController } from "../structures/IAgenticaController";
import { IAgenticaOperation } from "../structures/IAgenticaOperation";
import { IAgenticaOperationCollection } from "../structures/IAgenticaOperationCollection";
import { __map_take } from "./__map_take";

export namespace AgenticaOperationComposer {
  export const compose = (props: {
    controllers: IAgenticaController[];
    config?: IAgenticaConfig | undefined;
  }): IAgenticaOperationCollection => {
    const unique: boolean =
      props.controllers.length === 1 ||
      (() => {
        const names: string[] = props.controllers
          .map((controller) =>
            controller.application.functions.map((func) => func.name),
          )
          .flat();
        return new Set(names).size === names.length;
      })();
    const naming = (func: string, ci: number) =>
      unique ? func : `_${ci}_${func}`;

    const array: IAgenticaOperation[] = props.controllers
      .map((controller, ci) =>
        controller.protocol === "http"
          ? controller.application.functions.map(
              (func) =>
                ({
                  protocol: "http",
                  controller,
                  function: func,
                  name: naming(func.name, ci),
                }) satisfies IAgenticaOperation.IHttp,
            )
          : controller.application.functions.map(
              (func) =>
                ({
                  protocol: "class",
                  controller,
                  function: func,
                  name: naming(func.name, ci),
                }) satisfies IAgenticaOperation.IClass,
            ),
      )
      .flat();
    const divided: IAgenticaOperation[][] | undefined =
      !!props.config?.capacity && array.length > props.config.capacity
        ? divideOperations({
            array,
            capacity: props.config.capacity,
          })
        : undefined;

    const flat: Map<string, IAgenticaOperation> = new Map();
    const group: Map<string, Map<string, IAgenticaOperation>> = new Map();
    for (const item of array) {
      flat.set(item.name, item);
      __map_take(group, item.controller.name, () => new Map()).set(
        item.name,
        item,
      );
    }
    return {
      array,
      divided,
      flat,
      group,
    };
  };

  const divideOperations = (props: {
    array: IAgenticaOperation[];
    capacity: number;
  }): IAgenticaOperation[][] => {
    const size: number = Math.ceil(props.array.length / props.capacity);
    const capacity: number = Math.ceil(props.array.length / size);
    const replica: IAgenticaOperation[] = props.array.slice();
    return new Array(size).fill(0).map(() => replica.splice(0, capacity));
  };
}
