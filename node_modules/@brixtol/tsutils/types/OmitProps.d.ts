/**
 * Omit Props
 *
 * Used to exclude object properties from a string
 * list and  will return the retained properties of the object.
 *
 * > When passing an `Array` interface type the returning
 * value will be array, else return value is object
 *
 * @example
 *
 * type omitprops = OmitProps<[ 'foo', 'baz' ], {
 *    foo: { a: string },
 *    bar: { a: string },
 *    baz: { a: string }
 * }>
 *
 * // RESULT
 *
 * {
 *   bar: { a: string }
 * }
 *
 * // RETURNING ARRAY
 *
 * type omitprops = omitProps<[ 'foo', 'baz' ], Array<{
 *    foo: { a: string },
 *    bar: { a: string },
 *    baz: { a: string }
 * }>>
 *
 * // RESULT
 * [
 *  {
 *    bar: { a: string }
 *  }
 * ]
 */
export declare type OmitProps<U, T> = T extends any[] ? Array<
  U extends string[]
  ? Omit<T[number], U[number]>
  : T[number]
> : T extends object
  ? U extends string[]
  ? Omit<T, U[number]>
  : T
  : never;
