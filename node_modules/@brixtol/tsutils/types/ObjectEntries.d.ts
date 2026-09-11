/**
 * Object Entries
 *
 * Converts an object to a array entries list. Its a
 * type equivalent for `Object.entries()` method.
 *
 * @example
 *
 * type entries = ObjectEntries<{
 *  foo: { a: string },
 *  bar: { a: string }
 * }>
 *
 * // RESULT
 *
 * [
 *  [ 'foo', { a: string } ],
 *  [ 'bar', { a: string } ]
 * ]
 */
export type ObjectEntries<T> = {
  [K in keyof T]: [
    keyof Pick<
      T,
      {
        [X in keyof T]: T[X] extends T[K] ? X : never;
      }[keyof T]
    >,
    T[K]
  ];
}[keyof T][];
