import type { IHttpLlmFunction, ILlmFunction, IValidation } from "@samchon/openapi";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import type { IAgenticaConfig } from "../../structures/IAgenticaConfig";
import type { IAgenticaController } from "../../structures/IAgenticaController";
import type { IMcpLlmFunction } from "../../structures/mcp/IMcpLlmFunction";

import { assertMcpLlmApplication } from "../../functional/assertMcpLlmApplication";

import { compose, divide, getOperations, toClassOperations, toHttpOperations, toMcpOperations } from "./AgenticaOperationComposer";

// test helper functions
function createMockHttpFunction(name: string, method: "get" | "post" | "patch" | "put" | "delete", path: string): IHttpLlmFunction<any> {
  return {
    name,
    method,
    path,
    validate: () => ({ success: true, data: {} } as IValidation<unknown>),
    operation: () => ({}),
    route: () => ({
      method,
      path,
      emendedPath: path,
      accessor: [name],
      body: null,
      query: null,
      parameters: [],
      headers: null,
      success: null,
      exceptions: {},
      comment: () => "OK",
      operation: () => ({}),
    }),
    parameters: {},
    output: {},
  };
}

function createMockHttpController(name: string, functions: IHttpLlmFunction<any>[]): IAgenticaController.IHttp<any> {
  return {
    name,
    protocol: "http",
    connection: { host: "https://example.com" },
    application: {
      model: "chatgpt",
      options: {},
      functions,
      errors: [],
    },
  };
}

function createMockClassController(name: string, functions: ILlmFunction<any>[]): IAgenticaController.IClass<any> {
  return {
    name,
    protocol: "class",
    application: {
      model: "chatgpt",
      options: {},
      functions,
    },
    execute: {},
  };
}

async function createMockMcpController(name: string, functions: IMcpLlmFunction[]): Promise<IAgenticaController.IMcp> {
  const client = new Client({
    name: "calculator",
    version: "1.0.0",
  });

  await client.connect(new StdioClientTransport({
    command: "npx",
    args: ["-y", "@wrtnlabs/calculator-mcp"],
  }));

  return {
    name,
    protocol: "mcp",
    application: await assertMcpLlmApplication({
      client,
    }).then(v => ({
      ...v,
      functions,
    })),
  };
}

describe("a AgenticaOperationComposer", () => {
  describe("compose", () => {
    it("should compose operations from controllers", async () => {
      // Mock controllers
      const mockHttpController = createMockHttpController("httpController", [
        createMockHttpFunction("function1", "get", "/api/function1"),
        createMockHttpFunction("function2", "post", "/api/function2"),
      ]);

      const mockClassController = createMockClassController("classController", [
        {
          name: "function3",
          validate: () => ({ success: true, data: {} } as IValidation<unknown>),
          parameters: {},
          output: {},
        },
      ]);

      const mockMcpController = await createMockMcpController("mcpController", [
        {
          name: "function4",
          parameters: {},
        },
      ]);

      const controllers = [mockHttpController, mockClassController, mockMcpController];

      const result = compose({ controllers });

      expect(result.array).toHaveLength(4);
      expect(result.flat).toBeInstanceOf(Map);
      expect(result.group).toBeInstanceOf(Map);
      expect(result.divided).toBeUndefined();
    });

    it("should divide operations when capacity is provided", () => {
      // Mock controllers
      const mockController = createMockHttpController("httpController", [
        createMockHttpFunction("function1", "get", "/api/function1"),
        createMockHttpFunction("function2", "post", "/api/function2"),
        createMockHttpFunction("function3", "put", "/api/function3"),
        createMockHttpFunction("function4", "delete", "/api/function4"),
        createMockHttpFunction("function5", "patch", "/api/function5"),
      ]);

      const config: IAgenticaConfig<any> = {
        capacity: 2,
      };

      const result = compose({ controllers: [mockController], config });

      expect(result.array).toHaveLength(5);
      expect(result.divided).toBeDefined();
      expect(result.divided).toHaveLength(3); // 5 items with capacity 2 should be divided into 3 groups
    });
  });

  describe("getOperations", () => {
    it("should get operations from http controllers", () => {
      const mockController = createMockHttpController("httpController", [
        createMockHttpFunction("function1", "get", "/api/function1"),
        createMockHttpFunction("function2", "post", "/api/function2"),
      ]);

      const result = getOperations({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(2);
      expect(result[0]?.protocol).toBe("http");
      expect(result[0]?.name).toBe("_0_function1");
      expect(result[1]?.name).toBe("_0_function2");
    });

    it("should get operations from class controllers", () => {
      const mockController = createMockClassController("classController", [
        {
          name: "function1",
          validate: () => ({ success: true, data: {} } as IValidation<unknown>),
          parameters: {},
          output: {},
        },
      ]);

      const result = getOperations({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(1);
      expect(result[0]?.protocol).toBe("class");
      expect(result[0]?.name).toBe("_0_function1");
    });

    it("should get operations from mcp controllers", async () => {
      const mockController = await createMockMcpController("mcpController", [
        {
          name: "function1",
          parameters: {},
        },
      ]);

      const result = getOperations({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(1);
      expect(result[0]?.protocol).toBe("mcp");
      expect(result[0]?.name).toBe("_0_function1");
    });

    it("should throw error for unsupported protocol", () => {
      const mockController: IAgenticaController.IHttp<any> = {
        name: "unsupportedController",
        protocol: "unsupported" as unknown as "http",
        connection: { host: "https://example.com" },
        application: { } as unknown as IAgenticaController.IHttp<any>["application"],
      };

      expect(() => getOperations({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` })).toThrow("Unsupported protocol: unsupported");
    });
  });

  describe("toHttpOperations", () => {
    it("should convert http controller to operations", () => {
      const mockController = createMockHttpController("httpController", [
        createMockHttpFunction("function1", "get", "/api/function1"),
        createMockHttpFunction("function2", "post", "/api/function2"),
      ]);

      const result = toHttpOperations({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(2);
      expect(result[0]?.protocol).toBe("http");
      expect(result[0]?.name).toBe("_0_function1");
      expect(result[1]?.name).toBe("_0_function2");
    });
  });

  describe("toClassOperations", () => {
    it("should convert class controller to operations", () => {
      const mockController = createMockClassController("classController", [
        {
          name: "function1",
          validate: () => ({ success: true, data: {} } as IValidation<unknown>),
          parameters: {},
          output: {},
        },
      ]);

      const result = toClassOperations({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(1);
      expect(result[0]?.protocol).toBe("class");
      expect(result[0]?.name).toBe("_0_function1");
    });
  });

  describe("toMcpOperations", () => {
    it("should convert mcp controller to operations", async () => {
      const mockController = await createMockMcpController("mcpController", [
        {
          name: "function1",
          parameters: {},
        },
      ]);

      const result = toMcpOperations({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });

      expect(result).toHaveLength(1);
      expect(result[0]?.protocol).toBe("mcp");
      expect(result[0]?.name).toBe("_0_function1");
    });
  });
  describe("divide with invalid capacity", () => {
    it("should throw error when capacity is 0", () => {
      const array = [1, 2, 3, 4, 5];
      const capacity = 0;

      expect(() => divide({ array, capacity })).toThrow("Capacity must be a positive integer");
    });

    it("should throw error when capacity is negative", () => {
      const array = [1, 2, 3, 4, 5];
      const capacity = -3;

      expect(() => divide({ array, capacity })).toThrow("Capacity must be a positive integer");
    });

    it("should throw error when capacity is decimal", () => {
      const array = [1, 2, 3, 4, 5];
      const capacity = 2.5;
      const result = divide({ array, capacity });
      expect(result).toEqual([[1, 2, 3], [4, 5]]);
    });

    it("should throw error when capacity is Infinity", () => {
      const array = [1, 2, 3, 4, 5];
      const capacity = Infinity;

      expect(() => divide({ array, capacity })).toThrow("Capacity must be a positive integer");
    });

    it("should throw error when capacity is NaN", () => {
      const array = [1, 2, 3, 4, 5];
      const capacity = Number.NaN;

      expect(() => divide({ array, capacity })).toThrow("Capacity must be a positive integer");
    });
  });

  describe("divide", () => {
    it("should divide array into chunks based on capacity", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const capacity = 3;

      const result = divide({ array, capacity });

      expect(result).toHaveLength(4); // 10 items with capacity 3 should be divided into 4 groups
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([7, 8, 9]);
      expect(result[3]).toEqual([10]);
    });

    it("should handle empty array", () => {
      const array: number[] = [];
      const capacity = 3;

      const result = divide({ array, capacity });

      expect(result).toHaveLength(0);
    });

    it("should handle array smaller than capacity", () => {
      const array = [1, 2];
      const capacity = 3;

      const result = divide({ array, capacity });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([1, 2]);
    });
  });
});
