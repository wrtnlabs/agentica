/**
 * This function is used to get a retry function.
 *
 * It will throw an error if the count is not a number,
 * or if the count is not a finite number,
 * or if the count is not an integer,
 * or if the count is less than 1.
 *
 * @param count - The number of times to retry the function.
 * @returns A retry function.
 * @throws {TypeError} If the count is not a number, or if the count is not a finite number, or if the count is not an integer, or if the count is less than 1.
 * @throws {Error} If the function fails to return a value after the specified number of retries.
 */
export function getRetry(count: number) {
  if (!Number.isFinite(count)) {
    if (Number.isNaN(count)) {
      throw new TypeError("count should be greater than 0");
    }
    throw new Error("count should be finite");
  }
  if (!Number.isInteger(count)) {
    throw new TypeError("count should be an integer");
  }
  if (count < 1) {
    throw new Error("count should be greater than 0");
  }

  return async <T>(fn: () => Promise<T>) => {
    let lastError: unknown = null;

    for (let i = 0; i < count; i++) {
      try {
        return await fn();
      }
      catch (e: unknown) {
        lastError = e;
        if (i === count - 1) {
          throw e;
        }
      }
    }
    // count should be greater than 0.
    throw lastError;
  };
}

export function groupByArray<T>(array: T[], count: number): T[][] {
  const grouped = [];
  for (let i = 0; i < array.length; i += count) {
    grouped.push(array.slice(i, i + count));
  }
  return grouped;
}
