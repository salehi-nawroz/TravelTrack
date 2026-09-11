/**
 * Fixed Array Length
 *
 * Ensures an array has a fixed length, wherein
 * in cannot be any more or any less than the length
 * provided.
 *
 * @example
 *
 * type fixed = ArrayFixed<2, string>
 *
 * // RESULT
 *
 * <fixed>['A', 'B',] ✓ // Valid
 * <fixed>['A', 'B', 'C'] 𐄂 // invalid
 * <fixed>['A']  𐄂 // Invalid
 *
 */
export type ArrayFixed<
  Length extends number,
  Element,
  ArrayPrototype = [Element, ...Element[]]
> = Pick<
  ArrayPrototype,
  Exclude<
    keyof ArrayPrototype,
    'splice' |
    'push' |
    'pop' |
    'shift' |
    'unshift'
  >
> & {
  [index: number]: Element;
  [Symbol.iterator]: () => IterableIterator<Element>;
  readonly length: Length;
};
