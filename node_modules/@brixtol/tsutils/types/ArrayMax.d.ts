/**
 * Max Array Length
 *
 * Ensures an array has a max length. If the size
 * of the array exceeds the length an error will be thrown
 *
 * @example
 *
 * type max = ArrayMax<3, string>
 *
 * // RESULT
 *
 * <max>['A', 'B'] ✓ // Valid
 * <max>['A', 'B', 'C'] 𐄂 // Invalid
 *
 */
export type ArrayMax<X extends number, T, A extends T[] = []> =
  | A
  | {
    0: ArrayMax<X, T, [T, ...A]>;
  }[
    [T, ...A]['length'] extends X
    ? never
    : 0
  ];
