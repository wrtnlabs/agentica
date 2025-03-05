import { CompletionUsage } from "openai/resources";

import { IAgenticaTokenUsage } from "../structures/IAgenticaTokenUsage";

export namespace AgenticaTokenUsageAggregator {
  export const aggregate = (props: {
    kind: Exclude<keyof IAgenticaTokenUsage, "aggregate">;
    completionUsage: CompletionUsage;
    usage: IAgenticaTokenUsage;
  }): void => {
    if (!props.completionUsage) return;

    //----
    // COMPONENT
    //----
    const component: IAgenticaTokenUsage.IComponent = props.usage[props.kind];

    // TOTAL
    component.total += props.completionUsage.total_tokens;

    // PROMPT
    component.input.total += props.completionUsage.prompt_tokens;

    component.input.cached +=
      props.completionUsage.prompt_tokens_details?.cached_tokens ?? 0;

    // COMPLETION
    component.output.total += props.completionUsage.total_tokens;
    component.output.accepted_prediction +=
      props.completionUsage.completion_tokens_details
        ?.accepted_prediction_tokens ?? 0;
    component.output.reasoning +=
      props.completionUsage.completion_tokens_details?.reasoning_tokens ?? 0;
    component.output.rejected_prediction +=
      props.completionUsage.completion_tokens_details
        ?.rejected_prediction_tokens ?? 0;

    //----
    // RE-AGGREGATE
    //----
    const sum = (getter: (comp: IAgenticaTokenUsage.IComponent) => number) =>
      (
        Object.entries(props.usage) as [
          keyof IAgenticaTokenUsage,
          IAgenticaTokenUsage.IComponent,
        ][]
      )
        .filter(([key]) => key !== "aggregate")
        .map(([, comp]) => getter(comp))
        .reduce((a, b) => a + b, 0);
    const aggregate: IAgenticaTokenUsage.IComponent = props.usage.aggregate;
    aggregate.total = sum((comp) => comp.total);
    aggregate.input.total = sum((comp) => comp.input.total);
    aggregate.input.cached = sum((comp) => comp.input.cached);
    aggregate.output.total = sum((comp) => comp.output.total);
    aggregate.output.reasoning = sum((comp) => comp.output.reasoning);
    aggregate.output.accepted_prediction = sum(
      (comp) => comp.output.accepted_prediction,
    );
    aggregate.output.rejected_prediction = sum(
      (comp) => comp.output.rejected_prediction,
    );
  };

  export const plus = (
    x: IAgenticaTokenUsage,
    y: IAgenticaTokenUsage,
  ): IAgenticaTokenUsage => {
    const component = (
      a: IAgenticaTokenUsage.IComponent,
      b: IAgenticaTokenUsage.IComponent,
    ): IAgenticaTokenUsage.IComponent => ({
      total: a.total + b.total,
      input: {
        total: a.input.total + b.input.total,
        cached: a.input.cached + b.input.cached,
      },
      output: {
        total: a.output.total + b.output.total,
        reasoning: a.output.reasoning + b.output.reasoning,
        accepted_prediction:
          a.output.accepted_prediction + b.output.accepted_prediction,
        rejected_prediction:
          a.output.rejected_prediction + b.output.rejected_prediction,
      },
    });
    return {
      aggregate: component(x.aggregate, y.aggregate),
      initialize: component(x.initialize, y.initialize),
      select: component(x.select, y.select),
      cancel: component(x.cancel, y.cancel),
      call: component(x.call, y.call),
      describe: component(x.describe, y.describe),
    };
  };

  export const zero = (): IAgenticaTokenUsage => {
    const component = (): IAgenticaTokenUsage.IComponent => ({
      total: 0,
      input: {
        total: 0,
        cached: 0,
      },
      output: {
        total: 0,
        reasoning: 0,
        accepted_prediction: 0,
        rejected_prediction: 0,
      },
    });
    return {
      aggregate: component(),
      initialize: component(),
      select: component(),
      cancel: component(),
      call: component(),
      describe: component(),
    };
  };
}
