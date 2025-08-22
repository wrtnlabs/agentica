/**
 * @internal
 */
export function __get_retry(limit: number) {
  const retryFn = async <T>(fn: (prevError?: unknown) => Promise<T>, prevError?: unknown, attempt: number = 0): Promise<T> => {
    try {
      return await fn(prevError);
    }
    catch (error) {
      if (attempt >= limit - 1) {
        throw error;
      }
      return retryFn(fn, error, attempt + 1);
    }
  };

  return retryFn;
}
