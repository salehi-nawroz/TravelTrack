
/**
 * Union to Pop
 *
 * @private
 */
type UnionPop<
  Literals,
  Overload = Literals extends any
  ? (f: Literals) => void
  : never,
  Intersect = (
    Overload extends any
    ? (k: Overload) => void
    : never
  ) extends (
    k: infer Inferred
  ) => void
    ? Inferred
    : never
> = Intersect extends (a: infer T) => void ? T : never;

/**
 * Concat Union
 *
 * Concatenates a string union including values from the
 * union type and custom separator.
 *
 * ---
 *
 * Reference: https://stackoverflow.com/a/65157132/2021554
 *
 * ---
 *
 * @example
 *
 * type union = ConcatUnion<'A' | 'B', '|'>
 *
 * // RESULT
 *
 * | 'A'
 * | 'B'
 * | 'A|B'
 * | 'B|A'
 *
 */
export type ConcatUnion<
  U extends string,
  S extends string
> = UnionPop<U> extends infer T
  ? T extends string
  ? Exclude<U, T> extends never
  ? T
  :
  (
    | `${ConcatUnion<Exclude<U, T>, S>}${S}${T}`
    | `${T}${S}${ConcatUnion<Exclude<U, T>, S>}`
    | ConcatUnion<Exclude<U, T>, S>
    | U
    | T
  )
  : never
  : never;
