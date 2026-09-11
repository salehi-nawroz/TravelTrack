type JoinPaths<K, P, S extends string> = (
  K extends string | number
  ? P extends string | number
  ? `${K}${'' extends P ? '' : S}${P}`
  : never
  : never
);

/**
 * The type Prev is a long tuple that you can use to
 * get the previous number (up to a max value). So Prev[10] is 9,
 * and Prev[1] is 0. We'll need this to limit the recursion as
 * we proceed deeper into the object tree.
 */
type Prev = [ never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

/**
 * Recursion of the object paths
 */
type KeyPaths<
  T,
  S extends string,
  D extends number = 10
> = (
 [D] extends [never]
 ? never
 : T extends object
 ? {
     [K in keyof T]-?: K extends string | number
     ? `${K}` | JoinPaths<K, KeyPaths<T[K], S, Prev[D]>, S>
     : never
  }[keyof T] : ''
)

/**
 * JoinProps
 *
 * Deeply references object keys to generate a string literal
 * flattened union with an option separator character which will
 * default to `.` dot.
 *
 * @example
 *
 * const props: KeyofDot<{
 *  a: string;
 *  b: {
 *    c: string;
 *    d: {
 *    e: {
 *     g: string;
 *     j: string;
 *  }[];
 * }>
 *
 * // RESULT
 *
 * | "a"
 * | "b"
 * | "b.c"
 * | "b.d.e"
 * | "b.d"
 * | `b.d.e.${number}.g`
 * | `b.d.e.${number}.j`
 * | `b.d.e.${number}`
 */
export type JoinProps<T, Separator extends string = '.'> = KeyPaths<T, Separator>
