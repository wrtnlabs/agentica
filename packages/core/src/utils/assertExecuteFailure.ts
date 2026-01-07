import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";

export function assertExecuteFailure(failure: AgenticaExecuteHistory): void {
  if (failure.success === true) {
    return;
  }
  else if (failure.value instanceof Error) {
    throw failure.value;
  }
  else if (typeof failure.value === "object" && failure.value !== null) {
    const error: Error = new Error("Error from execute failure");
    Object.assign(error, failure.value);
    throw error;
  }
  throw failure.value;
}
