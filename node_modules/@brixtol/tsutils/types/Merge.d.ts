
type IsEqual<T, U> = (
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? true : false
);

type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);

type Except<ObjectType, KeysType extends keyof ObjectType> = {
  [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
};

type Simplify<T> = {[KeyType in keyof T]: T[KeyType]};

type Combine<FirstType, SecondType> = (
  Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType
);

/**
 * Merge two types into a new type. Keys of the second
 * type overrides keys of the first type.
 *
 * Lifted from [type-fest](https://git.io/JX5ua)
 *
 * @example
 *
 * type Foo = { a: number; b: string; };
 * type Bar = { b: number; };
 *
 * const ab: Merge<Foo, Bar> = {a: 1, b: 2};
 */
export type Merge<FirstType, SecondType> = Simplify<Combine<FirstType, SecondType>>;
