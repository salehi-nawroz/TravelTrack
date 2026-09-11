/**
 * Pick Props
 *
 * Used to pick object properties from a string list
 * and will return the selected properties on the object.
 *
 * > When passing an `Array` interface type the returning
 * value will be array, else return value is object
 *
 * @example
 *
 * // RETURNING OBJECT
 *
 * type pickprops = PickProps<[ 'foo', 'baz' ], {
 *    foo: { a: string },
 *    bar: { a: string },
 *    baz: { a: string }
 * }>
 *
 * // RESULT
 * {
 *   bar: { a: string }
 * }
 *
 * // RETURNING ARRAY
 *
 * type pickprops = PickProps<[ 'foo', 'baz' ], Array<{
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
export declare type PickProps<U, T> = T extends any[] ? Array<
  U extends string[]
  ? Pick<T[number], Extract<keyof T, U[number]>>
  : T[number]
> : T extends object
  ? U extends string[]
  ? Pick<T, Extract<keyof T, U[number]>>
  : T
  : never;
