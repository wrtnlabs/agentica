import type { AgenticaContext } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { GreaterThan, Integer } from "type-fest";

import { sha256 } from "@noble/hashes/sha2";
import { utf8ToBytes } from "@noble/hashes/utils";

/** type function to check if a number is greater than 0 */
type GreaterThanZeroInteger<T extends number> = GreaterThan<Integer<T>, 0> extends true ? T : never;

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
export function getRetry<TCount extends number>(count: GreaterThanZeroInteger<TCount>) {
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

/**
 * This function is used to group an array into a 2-dimensional array.
 *
 * It will throw an error if the count is not a number,
 * or if the count is not a finite number,
 * or if the count is not an integer,
 * or if the count is less than 1.
 *
 * @param array - The array to group.
 * @param count - The number of elements in each group.
 * @returns A 2-dimensional array.
 */
export function groupByArray<T, TCount extends number>(array: T[], count: GreaterThanZeroInteger<TCount>): T[][] {
  if (count < 1) {
    throw new Error("count should be greater than 0");
  }

  if (array.length === 0) {
    return [];
  }

  if (array.length < count) {
    return [array];
  }

  const grouped = [];
  for (let i = 0; i < array.length; i += count) {
    grouped.push(array.slice(i, i + count));
  }
  return grouped;
}

/**
 * Removes duplicates from an array.
 * You can specify which value to compare using a property selector function.
 *
 * @param array - Array to remove duplicates from
 * @param selector - Function that selects the value to compare
 * @returns New array with duplicates removed
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'John' }
 * ];
 *
 * const uniqueUsers = uniqBy(users, user => user.id);
 * // Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * ```
 */
export function uniqBy<T, K>(array: T[], selector: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = selector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Generates a hash from an Agentica ctx.operations.array.
 *
 * @param ctx - The Agentica context to generate a hash from
 * @returns A hash of the Agentica context
 */
export function generateHashFromCtx<SchemaModel extends ILlmSchema.Model>(ctx: AgenticaContext<SchemaModel>): string {
  const target = JSON.stringify(ctx.operations.array);
  const bytes = utf8ToBytes(target);
  const hash = sha256(bytes);
  const binary = String.fromCharCode(...hash);
  return btoa(binary);
}
