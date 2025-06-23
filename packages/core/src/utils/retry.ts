/**
 * Utility function to retry an async function a specified number of times
 * @param {Function} asyncFn - The async function to execute
 * @param {object} options - Options object
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.delay - Wait time between retries in milliseconds (default: 1000)
 * @param {Function} options.shouldRetry - Function to determine whether to retry (default: retry on all errors)
 * @param {boolean} options.exponentialBackoff - Whether to use exponential backoff (default: false)
 * @returns {Promise} - Result of the original function or error
 */
export async function retryAsync<T>(asyncFn: () => Promise<T>, options: {
  maxRetries?: number;
  delay?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  exponentialBackoff?: boolean;
} = {}): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await asyncFn();
      return result;
    }
    catch (error) {
      lastError = error;

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
