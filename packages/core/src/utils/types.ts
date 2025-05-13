/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Test.ts
 */

type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <
  A,
>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

type Boolean = 0 | 1;
/**
 * Test should pass
 */
export type Pass = 1;

/**
 * Test should fail
 */
export type Fail = 0;

/**
 * Check or test the validity of a type
 * @param debug to debug with parameter hints (`ctrl+p`, `ctrl+shift+space`)
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
export function check<Type, Expect, Outcome extends Boolean>(
  debug?: Type,
): Equals<Equals<Type, Expect>, Outcome> {
  if (debug !== undefined) {
    // eslint-disable-next-line no-console
    console.log(debug);
  }

  return 1 as Equals<Equals<Type, Expect>, Outcome>;
}

/**
 * Validates a batch of [[check]]
 * @param _checks a batch of [[check]]
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
export function checks(_checks: 1[]): void { }
