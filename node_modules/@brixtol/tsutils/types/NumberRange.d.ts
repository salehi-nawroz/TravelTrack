/**
 * Prepend Next Number
 *
 * @private
 */
type PrependNextNum<A extends Array<unknown>> = (
  A['length'] extends infer T
  ? (
    (
      t: T,
      ...a: A
    ) => void
  ) extends (...x: infer X) => void
  ? X
  : never
  : never
);

/**
 * Enumerate Internally
 *
 * @private
 */
type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A['length'] ? 0 : 1];

/**
 * Enumerate
 *
 * @private
 */
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[]
  ? E
  : never;

/**
 * Union Number Range
 *
 * Generates a number union between 2 numbers excluding
 * the `TO` number limit, returning only the range between.
 *
 * @example
 *
 * type range = Range<1, 5>
 *
 * // RESULT
 *
 * 1 |
 * 2 |
 * 3 |
 * 4 | // 5 is excluded
 */
export type NumberRange<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;
