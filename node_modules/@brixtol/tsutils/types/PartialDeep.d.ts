/**
 * Primitives
 */
type Primitive = (
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
);

/**
 * Same as `PartialDeep`, but accepts only `Map`s and as inputs.
 * Internal helper for `PartialDeep`.
*/
interface PartialMapDeep<
  KeyType,
  ValueType
> extends Map<
  PartialDeep<KeyType>,
  PartialDeep<ValueType>
> {}

/**
 * Same as `PartialDeep`, but accepts only `Set`s as inputs.
 * Internal helper for `PartialDeep`.
 */
interface PartialSetDeep<T> extends Set<PartialDeep<T>> {}

/**
 * Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs.
 * Internal helper for `PartialDeep`.
*/
interface PartialReadonlyMapDeep<
  KeyType,
  ValueType
> extends ReadonlyMap<
  PartialDeep<KeyType>,
  PartialDeep<ValueType>
> {}

/**
 * Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs.
 * Internal helper for `PartialDeep`.
*/
interface PartialReadonlySetDeep<T> extends ReadonlySet<PartialDeep<T>> {}

/**
 * Same as `PartialDeep`, but accepts only `object`s as inputs.
 * Internal helper for `PartialDeep`.
 */
type PartialObjectDeep<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>
};

/**
 * Partial Deep
 *
 * Used to create a type from another type with all keys and
 * nested keys set to optional.
 *
 * ---
 *
 * This Utility was lifted off [type-fest](https://github.com/sindresorhus/type-fest)
 *
 * Author: [sindresorhus](https://github.com/sindresorhus)
 * Reference: https://git.io/JX0cZ
 *
 * ---
 *
 * @example
 *
 * type partialdeep = PartialDeep<{
 *   deep: {
 *     a: number;
 *     b: string;
 *     deeper: {
 *       c: [];
 *       d: unknown;
 *     }
 *   }
 *   e: any;
 *   f: string;
 * }>
 *
 * // RESULT
 *
 * {
 *   deep?: {
 *     a?: number;
 *     b?: string;
 *     deeper?: {
 *       c?: [];
 *       d?: unknown;
 *     }
 *   }
 *   e?: any;
 *   f?: string;
 * }
 */
export type PartialDeep<T> = T extends Primitive
  ? Partial<T>
  : T extends Map<infer KeyType, infer ValueType>
  ? PartialMapDeep<KeyType, ValueType>
  : T extends Set<infer ItemType>
  ? PartialSetDeep<ItemType>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? PartialReadonlyMapDeep<KeyType, ValueType>
  : T extends ReadonlySet<infer ItemType>
  ? PartialReadonlySetDeep<ItemType>
  : T extends ((...arguments: any[]) => unknown)
  ? T | undefined
  : T extends object
  ? T extends Array<infer ItemType>
  ? ItemType[] extends T
  ? Array<PartialDeep<ItemType | undefined>>
  : PartialObjectDeep<T>
  : PartialObjectDeep<T>
  : unknown;
