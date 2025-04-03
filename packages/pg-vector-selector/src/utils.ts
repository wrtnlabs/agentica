export function getRetry(count: number) {
  if (count < 1) {
    throw new Error("count should be greater than 0");
  }

  return async <T>(fn: () => Promise<T>) => {
    let lastError: Error | null = null;

    for (let i = 0; i < count; i++) {
      try {
        return await fn();
      }
      catch (e: unknown) {
        lastError = e as Error;
        if (i === count - 1) {
          throw e;
        }
      }
    }

    if (lastError != null) {
      throw lastError;
    }
    throw new Error("unreachable code");
  };
}

export function groupByArray<T>(array: T[], count: number): T[][] {
  const grouped = [];
  for (let i = 0; i < array.length; i += count) {
    grouped.push(array.slice(i, i + count));
  }
  return grouped;
}
