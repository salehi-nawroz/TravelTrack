/**
 * Valueof
 *
 * Opposite of `keyof` returning object values as a
 * union type.
 *
 * @example
 *
 * type omitprops = Valueof<{
 *    foo: 'a',
 *    bar: 'b',
 *    baz: 'c'
 * }>
 *
 * // RESULT
 *
 * | 'a'
 * | 'b'
 * | 'c'
 */
export type Valueof<
  ObjectType,
  ValueType extends keyof ObjectType = keyof ObjectType
> = ObjectType[ValueType];
