/**
 * Represents an array of strings split using a given character
 * or character set. Typically used on a return type  method
 * like `String.prototype.split`.
 *
 * Lifted from [type-fest](https://git.io/JX7p5)
 *
 * ---
 *
 * @example
 *
 * const split: Split<'a,b,c,d', ','> = ['a','b','c','d']
 */
export type Split<
  T extends string,
  Delimiter extends string,
> = (
  T extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : T extends Delimiter
  ? []
  : [T]
);
