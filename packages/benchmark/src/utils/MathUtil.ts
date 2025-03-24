/**
 * @module
 * This file contains functions to work with MathUtil.
 *
 * @author Wrtn Technologies
 */

export const MathUtil = {
  /**
   * Round a number to 2 decimal places.
   *
   * @param value - The number to round.
   * @returns The rounded number.
   */
  round: (value: number): number => Math.floor(value * 100) / 100,
};
