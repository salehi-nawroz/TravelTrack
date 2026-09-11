/**
 * Literal Union
 *
 * Allows string types to be passed while respecting
 * intellisense completions.
 *
 * ---
 *
 * Author: https://github.com/a2br
 * Reference: https://git.io/JPhlZ
 *
 * ---
 *
 * @example
 *
 * type union = { A: Union<'A' | 'B', string>; B: 'C' | 'D'; }
 *
 * // RESULT
 *
 * {
 *  A: 'foo' ✓ // "foo" is allowed
 *  B: 'foo' 𐄂 // "foo" is not allowed
 * }
 *
 */
export type LiteralUnion<T extends U, U = string> = | T | (U & Record<never, never>);
