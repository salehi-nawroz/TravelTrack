/**
 * Min Length
 */
type MinLength<
  T,
  N extends number,
  Current extends T[]
> = Current['length'] extends N
  ? [...Current, ...T[]]
  : MinLength<T, N, [...Current, T]>;

/**
 * Array Minimum Length
 *
 * Ensures an array type has a minimum length.
 *
 * @example
 *
 * type min = ArrayMin<2, string>
 *
 * // RESULT
 *
 * <min>['A', 'B',] ✓ // Valid
 * <min>['A', 'B', 'C'] ✓ // Valid
 * <min>['A']  𐄂 // Invalid
 *
 */
export type ArrayMin<N extends number, T> = MinLength<T, N, []>;
