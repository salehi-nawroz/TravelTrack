type DotPath<T, Key extends keyof T> = (
  Key extends string
  ? T[Key] extends Record<string, any>
  ? | `${Key}.${DotPath<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
    | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
  : never
);

type PathKeys<T> = DotPath<T, keyof T> | keyof T;

/**
 * Path
 *
 * Creates a string union from an object. The values are
 * equal to object properties.
 *
 * ---
 *
 * @example
 *
 * Path<{
 *  a: {
 *    b: {
 *     c: string
 *  }
 * }
 *}> //=> 'a' | 'a.b' | 'a.b.c'
 */
export type Path<T> = PathKeys<T> extends string | keyof T ? PathKeys<T> : keyof T;
