import { getRetry, groupByArray } from "./utils";

describe("getRetry", () => {
  it("should throw error when count is less than 1", () => {
    expect(() => getRetry(0)).toThrow("count should be greater than 0");
  });

  it("should retry the function specified number of times", async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error("Failed");
      }
      return "success";
    };

    const retryFn = getRetry(3);
    const result = await retryFn(fn);
    expect(result).toBe("success");
    expect(attempts).toBe(3);
  });

  it("should throw the last error when all retries fail", async () => {
    const error = new Error("Failed");
    const fn = async () => {
      throw error;
    };

    const retryFn = getRetry(3);
    await expect(retryFn(fn)).rejects.toThrow(error);
  });
});

describe("groupByArray", () => {
  it("should group array into chunks of specified size", () => {
    const array = [1, 2, 3, 4, 5, 6];
    const result = groupByArray(array, 2);
    expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it("should handle array with length not divisible by count", () => {
    const array = [1, 2, 3, 4, 5];
    const result = groupByArray(array, 2);
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("should return empty array when input array is empty", () => {
    const result = groupByArray([], 2);
    expect(result).toEqual([]);
  });
});
