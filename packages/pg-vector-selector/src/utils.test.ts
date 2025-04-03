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

  it("should handle noop functions", async () => {
    const retryFn = getRetry(3);
    const result = await retryFn(async () => {});
    expect(result).toBeUndefined();
  });

  it("should handle non-async functions", async () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      if (attempts < 2) {
        throw new Error("Failed");
      }
      return "success";
    };

    const retryFn = getRetry(3);
    const result = await retryFn(async () => fn());
    expect(result).toBe("success");
    expect(attempts).toBe(2);
  });

  it("should stop retrying after successful attempt", async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts === 2) {
        return "success";
      }
      throw new Error("Failed");
    };

    const retryFn = getRetry(5);
    const result = await retryFn(fn);
    expect(result).toBe("success");
    expect(attempts).toBe(2);
  });

  it("should handle different types of errors", async () => {
    const retryFn = getRetry(3);

    await expect(retryFn(async () => {
      throw new TypeError("Type error");
    })).rejects.toThrow(TypeError);

    await expect(retryFn(async () => {
      throw new RangeError("Range error");
    })).rejects.toThrow(RangeError);
  });

  it("should handle null and undefined return values", async () => {
    const retryFn = getRetry(2);

    const nullFn = async () => null;
    const undefinedFn = async () => undefined;

    expect(await retryFn(nullFn)).toBeNull();
    expect(await retryFn(undefinedFn)).toBeUndefined();
  });

  it("should handle floating point calculations", async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error("Failed");
      }
      return 3.14159;
    };

    const retryFn = getRetry(3);
    const result = await retryFn(fn);
    expect(result).toBeCloseTo(3.14159);
    expect(attempts).toBe(2);
  });

  it("should handle mathematical operations with floating points", async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error("Failed");
      }
      return 0.1 + 0.2; // Known floating point precision issue
    };

    const retryFn = getRetry(3);
    const result = await retryFn(fn);
    expect(result).toBeCloseTo(0.3);
    expect(attempts).toBe(2);
  });

  it("should handle very small floating point numbers", async () => {
    const retryFn = getRetry(2);
    const fn = async () => 0.0000001;

    const result = await retryFn(fn);
    expect(result).toBeCloseTo(0.0000001);
  });

  it("should handle very large floating point numbers", async () => {
    const retryFn = getRetry(2);
    const fn = async () => 1e20;

    const result = await retryFn(fn);
    expect(result).toBe(1e20);
  });

  it("should throw error when count is NaN", () => {
    expect(() => getRetry(Number.NaN)).toThrow("count should be greater than 0");
    expect(() => getRetry(0 / 0)).toThrow("count should be greater than 0");
    expect(() => getRetry(Number.parseInt("not a number"))).toThrow("count should be greater than 0");
  });

  it("should throw error when count is Infinite", () => {
    expect(() => getRetry(Infinity)).toThrow("count should be finite");
    expect(() => getRetry(-Infinity)).toThrow("count should be finite");
    expect(() => getRetry(1 / 0)).toThrow("count should be finite");
  });

  it("should throw error when count is not an integer", () => {
    expect(() => getRetry(1.5)).toThrow("count should be an integer");
    expect(() => getRetry(2.7)).toThrow("count should be an integer");
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
