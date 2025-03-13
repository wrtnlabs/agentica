import { CompletionUsage } from "openai/resources";

import { IAgenticaTokenUsageJson } from "../../json/IAgenticaTokenUsageJson";
import { AgenticaTokenUsage } from "../AgenticaTokenUsage";

export namespace AgenticaTokenUsageAggregator {
  export const aggregate = (props: {
    kind: Exclude<keyof IAgenticaTokenUsageJson, "aggregate">;
    completionUsage: CompletionUsage;
    usage: AgenticaTokenUsage;
  }): void => {
    if (!props.completionUsage) return;

    //----
    // COMPONENT
    //----
    const component: AgenticaTokenUsage.IComponent = props.usage[props.kind];

    // TOTAL
    component.total += props.completionUsage.total_tokens;

    // PROMPT
    component.input.total += props.completionUsage.prompt_tokens;
    component.input.total +=
      props.completionUsage.prompt_tokens_details?.audio_tokens ?? 0;
    component.input.cached +=
      props.completionUsage.prompt_tokens_details?.cached_tokens ?? 0;

    // COMPLETION
    component.output.total += props.completionUsage.completion_tokens;
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
    const sum = (getter: (comp: AgenticaTokenUsage.IComponent) => number) =>
      (
        Object.entries(props.usage) as [
          keyof AgenticaTokenUsage,
          AgenticaTokenUsage.IComponent,
        ][]
      )
        .filter(([key]) => key !== "aggregate")
        .map(([, comp]) => getter(comp))
        .reduce((a, b) => a + b, 0);
    const aggregate: AgenticaTokenUsage.IComponent = props.usage.aggregate;
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
}
