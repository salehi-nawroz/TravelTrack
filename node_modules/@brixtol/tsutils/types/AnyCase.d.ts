/**
 * AnyCase
 *
 * Converts a string union into and AnyCase combination,
 * for example:
 *
 * @example
 *
 * type union = AnyCase<'foo'>
 *
 * // RESULT
 * | 'FOO'
 * | 'FOo'
 * | 'FoO'
 * | 'Foo'
 * | 'fOO'
 * | 'fOo'
 * | 'foO'
 * | 'foo'
 *
 */
export type AnyCase<T extends string> = string extends T
  ? string
  : T extends `${infer T1}${infer T2}${infer R}`
  ? `${Uppercase<T1> | Lowercase<T1>}${
      | Uppercase<T2>
      | Lowercase<T2>}${AnyCase<R>}`
  : T extends `${infer T1}${infer R}`
  ? `${Uppercase<T1> | Lowercase<T1>}${AnyCase<R>}`
  : '';
