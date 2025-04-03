import { getRetry, groupByArray } from "./utils";

describe("getRetry", () => {
  it("should throw error when count is less than 1", () => {
    expect(() => getRetry(0)).toThrow("count should be greater than 0");
  });

  it("should retry the function specified number of times", async () => {
    const mockFn = vi.fn().mockImplementation(async () => {
      if (mockFn.mock.calls.length === 1) {
        throw new Error("Failed");
      }
      return "success";
    });

    const retryFn = getRetry(3);
    const result = await retryFn(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should throw the last error when all retries fail", async () => {
    const error = new Error("Failed");
    const mockFn = vi.fn().mockRejectedValue(error);

    const retryFn = getRetry(3);
    await expect(retryFn(mockFn)).rejects.toThrow(error);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("should handle noop functions", async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const retryFn = getRetry(3);

    const result = await retryFn(mockFn);
    expect(result).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle non-async functions", async () => {
    const mockFn: () => string = vi.fn()
      .mockImplementationOnce(() => { throw new Error("Failed"); })
      .mockImplementationOnce(() => "success");

    const retryFn = getRetry(3);
    const result = await retryFn(async () => mockFn());

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should stop retrying after successful attempt", async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error("Failed"))
      .mockResolvedValueOnce("success");

    const retryFn = getRetry(5);
    const result = await retryFn(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
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

  it("should handle count larger than array length", () => {
    const array = [1];
    const result = groupByArray(array, 2);
    expect(result).toEqual([[1]]);
  });

  it("should throw error when count is less than 1", () => {
    const array = [1, 2, 3, 4, 5];
    expect(() => groupByArray(array, 0)).toThrow("count should be greater than 0");
  });

  it("should handle array with different data types", () => {
    const mixedArray = [1, "two", { three: 3 }, [4], true, null, undefined];
    const result = groupByArray(mixedArray, 2);
    expect(result).toEqual([
      [1, "two"],
      [{ three: 3 }, [4]],
      [true, null],
      [undefined],
    ]);
  });

  it("should handle very large arrays", () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i);
    const result = groupByArray(largeArray, 100);
    expect(result.length).toBe(10);
    expect(result[0]?.length).toBe(100);
    expect(result[9]?.length).toBe(100);
  });
});
