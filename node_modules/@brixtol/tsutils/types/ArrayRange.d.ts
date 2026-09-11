import { ArrayMax } from './ArrayMax';

/**
 * Array Range
 *
 * Ensures an array length is more than the `from`
 * size and less than the `to` size.
 *
 * @example
 *
 * type range = ArrayRange<2, 3, string>
 *
 * // RESULT
 *
 * <range>['A', 'B',] ✓ // Valid
 * <range>['A', 'B', 'C'] ✓ // Valid
 * <range>['A']  𐄂 // Invalid
 * <range>['A', 'B', 'C', 'D']  𐄂 // Invalid
 */
export type ArrayRange<
  From extends number,
  To extends number,
  T
> = Exclude<
  ArrayMax<To, T>,
  ArrayMax<From, T>
>;
