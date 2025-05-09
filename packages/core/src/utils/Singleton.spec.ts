import { Singleton } from "./Singleton";

describe("singleton", () => {
  describe("basic functionality", () => {
    it("should create instance only once", () => {
      const factory = () => ({ value: 42 });
      const singleton = new Singleton(factory);

      const instance1 = singleton.get();
      const instance2 = singleton.get();

      expect(instance1).toBe(instance2);
      expect(instance1.value).toBe(42);
    });

    it("should create different instances for different singletons", () => {
      const factory1 = () => ({ value: 42 });
      const factory2 = () => ({ value: 24 });

      const singleton1 = new Singleton(factory1);
      const singleton2 = new Singleton(factory2);

      const instance1 = singleton1.get();
      const instance2 = singleton2.get();

      expect(instance1).not.toBe(instance2);
      expect(instance1.value).toBe(42);
      expect(instance2.value).toBe(24);
    });
  });

  describe("constructor arguments", () => {
    it("should pass constructor arguments to factory", () => {
      const factory = (value: number) => ({ value });
      const singleton = new Singleton(factory);

      const instance = singleton.get(42);
      expect(instance.value).toBe(42);
    });

    it("should use same instance with same constructor arguments", () => {
      const factory = (value: number) => ({ value });
      const singleton = new Singleton(factory);

      const instance1 = singleton.get(42);
      const instance2 = singleton.get(42);

      expect(instance1).toBe(instance2);
      expect(instance1.value).toBe(42);
    });

    it("should return same instance even with different constructor arguments", () => {
      const factory = (value: number) => ({ value });
      const singleton = new Singleton(factory);

      const instance1 = singleton.get(42);
      const instance2 = singleton.get(24);

      expect(instance1).toBe(instance2);
      expect(instance1.value).toBe(42);
      expect(instance2.value).toBe(42);
    });
  });

  describe("complex object types", () => {
    it("should handle complex objects", () => {
      interface ComplexObject {
        id: number;
        data: { name: string; value: number };
        timestamp: Date;
      }

      const factory = (id: number, name: string, value: number) => ({
        id,
        data: { name, value },
        timestamp: new Date(),
      });

      const singleton = new Singleton<ComplexObject, [number, string, number]>(factory);
      const instance = singleton.get(1, "test", 42);

      expect(instance.id).toBe(1);
      expect(instance.data.name).toBe("test");
      expect(instance.data.value).toBe(42);
      expect(instance.timestamp).toBeInstanceOf(Date);
    });

    it("should maintain same complex object instance", () => {
      const factory = () => ({
        data: new Map<string, number>([["key", 42]]),
        array: [1, 2, 3],
      });

      const singleton = new Singleton(factory);
      const instance1 = singleton.get();
      const instance2 = singleton.get();

      expect(instance1).toBe(instance2);
      expect(instance1.data).toBe(instance2.data);
      expect(instance1.array).toBe(instance2.array);
    });
  });

  describe("edge cases", () => {
    it("should handle null factory return", () => {
      const factory = () => null;
      const singleton = new Singleton(factory);

      const instance = singleton.get();
      expect(instance).toBeNull();
    });

    it("should handle undefined factory return", () => {
      const factory = () => undefined;
      const singleton = new Singleton(factory);

      const instance = singleton.get();
      expect(instance).toBeUndefined();
    });

    it("should handle primitive values", () => {
      const factory = () => 42;
      const singleton = new Singleton(factory);

      const instance = singleton.get();
      expect(instance).toBe(42);
    });

    it("should handle factory throwing error", () => {
      const factory = () => {
        throw new Error("Factory error");
      };
      const singleton = new Singleton(factory);

      expect(() => singleton.get()).toThrow("Factory error");
    });
  });
});
