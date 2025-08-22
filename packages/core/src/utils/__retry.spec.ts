import { __get_retry } from "./__retry";

describe("__get_retry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success cases", () => {
    it("should not retry when successful on first attempt", async () => {
      const mockFn = vi.fn().mockResolvedValue("success");
      const retryFn = __get_retry(3);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(undefined);
    });

    it("should call exactly 2 times when successful on second attempt", async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error("First failure"))
        .mockResolvedValue("success");
      const retryFn = __get_retry(3);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, undefined);
      expect(mockFn).toHaveBeenNthCalledWith(2, new Error("First failure"));
    });

    it("should call limit times when successful on last attempt", async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error("First failure"))
        .mockRejectedValueOnce(new Error("Second failure"))
        .mockResolvedValue("success");
      const retryFn = __get_retry(3);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(1, undefined);
      expect(mockFn).toHaveBeenNthCalledWith(2, new Error("First failure"));
      expect(mockFn).toHaveBeenNthCalledWith(3, new Error("Second failure"));
    });
  });

  describe("failure cases", () => {
    it("should throw last error after limit attempts", async () => {
      const error1 = new Error("First failure");
      const error2 = new Error("Second failure");
      const error3 = new Error("Third failure");

      const mockFn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockRejectedValueOnce(error3);
      const retryFn = __get_retry(3);

      await expect(retryFn(mockFn)).rejects.toThrow("Third failure");
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(1, undefined);
      expect(mockFn).toHaveBeenNthCalledWith(2, error1);
      expect(mockFn).toHaveBeenNthCalledWith(3, error2);
    });

    it("should throw error immediately when limit is 1", async () => {
      const error = new Error("Immediate failure");
      const mockFn = vi.fn().mockRejectedValue(error);
      const retryFn = __get_retry(1);

      await expect(retryFn(mockFn)).rejects.toThrow("Immediate failure");
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(undefined);
    });
  });

  describe("prevError propagation", () => {
    it("should pass previous error as prevError correctly", async () => {
      const error1 = new Error("First error");
      const error2 = new Error("Second error");

      const mockFn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue("success");
      const retryFn = __get_retry(3);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(1, undefined);
      expect(mockFn).toHaveBeenNthCalledWith(2, error1);
      expect(mockFn).toHaveBeenNthCalledWith(3, error2);
    });

    it("should use initial prevError in first call when provided", async () => {
      const initialError = new Error("Initial error");
      const mockFn = vi.fn().mockResolvedValue("success");
      const retryFn = __get_retry(3);

      const result = await retryFn(mockFn, initialError);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(initialError);
    });
  });

  describe("different error types", () => {
    it("should handle string errors correctly", async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce("String error")
        .mockResolvedValue("success");
      const retryFn = __get_retry(2);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(2, "String error");
    });

    it("should handle null errors correctly", async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(null)
        .mockResolvedValue("success");
      const retryFn = __get_retry(2);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(2, null);
    });

    it("should handle undefined errors correctly", async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(undefined)
        .mockResolvedValue("success");
      const retryFn = __get_retry(2);

      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(2, undefined);
    });
  });

  describe("recursive call verification", () => {
    it("should occur recursive calls in correct order", async () => {
      const callOrder: string[] = [];
      const mockFn = vi.fn()
        .mockImplementationOnce(() => {
          callOrder.push("first call");
          throw new Error("First failure");
        })
        .mockImplementationOnce(() => {
          callOrder.push("second call");
          throw new Error("Second failure");
        })
        .mockImplementationOnce(async () => {
          callOrder.push("third call");
          return Promise.resolve("success");
        });

      const retryFn = __get_retry(3);
      const result = await retryFn(mockFn);

      expect(result).toBe("success");
      expect(callOrder).toEqual(["first call", "second call", "third call"]);
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe("type safety", () => {
    it("should handle different return types correctly", async () => {
      const stringFn = vi.fn().mockResolvedValue("string result");
      const numberFn = vi.fn().mockResolvedValue(42);
      const objectFn = vi.fn().mockResolvedValue({ key: "value" });

      const retryFn = __get_retry(3);

      const stringResult = await retryFn(stringFn);
      const numberResult = await retryFn(numberFn);
      const objectResult = await retryFn(objectFn);

      expect(stringResult).toBe("string result");
      expect(numberResult).toBe(42);
      expect(objectResult).toEqual({ key: "value" });
    });
  });
});
