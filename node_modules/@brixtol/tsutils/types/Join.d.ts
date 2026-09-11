/**
 * Join an array of strings and/or numbers using
 * the given string as a delimiter. Used for defining key
 * paths in a nested object.
 *
 * Lifted from [type-fest](https://git.io/JX5eJ)
 *
 * @example
 *
 *  // Mixed (strings & numbers) items; result is: 'foo.0.baz'
 * const path: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
 *
 * // Only string items; result is: 'foo.bar.baz'
 * const path: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz'
 *
 * // Only number items; result is: '1.2.3'
 * const path: Join<[1, 2, 3], '.'> = [1, 2, 3].join('.');
 */
export type Join<
  Strings extends Array<string | number>,
  Delimiter extends string,
> = (
  Strings extends []
  ? ''
  : Strings extends [string | number]
  ? `${Strings[0]}`
  : Strings extends [string | number, ...infer Rest]
  // @ts-expect-error `Rest` is inferred as `unknown` here: https://git.io/JX7jN
  ? `${Strings[0]}${Delimiter}${Join<Rest, Delimiter>}`
  : string
);
