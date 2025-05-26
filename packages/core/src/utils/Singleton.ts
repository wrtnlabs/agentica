/**
 * @internal
 */
const NOT_MOUNTED_YET = {};

/**
 * @internal
 *
 * @description
 * A singleton class that creates a single instance of a class.
 *
 * @example
 * ```ts
 * const singleton = new Singleton((name: string) => new SomeClass(name));
 * const instance = singleton.get("test");
 * ```
 *
 * but next case is not work
 * ```ts
 * const singleton = new Singleton((name: string) => new SomeClass(name));
 * const instance = singleton.get("test");
 * const instance2 = singleton.get("test2");
 *
 * expect(instance).toBe(instance2); // true
 * ```
 */
export class Singleton<T, Args extends any[] = []> {
  private readonly closure_: (...args: Args) => T;
  private value_: T | object;

  public constructor(closure: (...args: Args) => T) {
    this.closure_ = closure;
    this.value_ = NOT_MOUNTED_YET;
  }

  public get(...args: Args): T {
    if (this.value_ === NOT_MOUNTED_YET) {
      this.value_ = this.closure_(...args);
    }
    return this.value_ as T;
  }
}
