# @brixtol/tsutils

TypeScript utility types used within the [Brixtol Textiles](https://brixtoltextiles.com) monorepo workspace. This module is loosely based on [type-fest](https://github.com/sindresorhus/type-fest) in the sense that is provides some essential TypeScript types.

### Install

[pnpm](https://pnpm.js.org/en/cli/install)

```cli
pnpm add @brixtol/tsutils

```

# Usage

Import the module via namespace. The below example shows a couple of utilities. For additional context look in the [test](https://github.com/BRIXTOL/tsutils/tree/master/test) directory.

```ts
import { AnyCase, ArrayMin, ConcatUnion } from '@brixtol/tsutils';

let string: AnyCase<'foo'>; // 'FOO' | 'FoO' | 'fOO' etc etc

let concat: ConcatUnion<'A' | 'B', '-'>; // 'A' | 'B' | 'A-B' etc etc

let arrmin: ArrayMin<2, string>; // ['a', 'b']

// etc etc
```

# Utilities

The package provides several useful TypeScript utilities. If you require more then look at [type-fest](https://github.com/sindresorhus/type-fest). Below are some basic examples of whats included and how to use them.

#### `AnyCase<string>`

Converts a string union into and AnyCase combination,

```ts
const anycase: AnyCase<'foo'> = (
  | 'FOO'
  | 'fOO'
  | 'foO'
  | 'Foo'
  | 'FOo'
  | 'foo'
  | 'fOo'
  | 'FoO'
);
```

#### `ArrayFixed<number, type>`

Ensures an array has a fixed length, where it cannot be any more or any less than the length provided.

```ts
// ✓ VALID
const a: ArrayFixed<2, string> = ['A', 'B'];
const b: ArrayFixed<3, string> = ['A', 'B', 'C'];

// 𐄂  INVALID
const c: ArrayFixed<2, string> = ['A'];
```

#### `ArrayMax<number, type>`

Ensures an array has a max length. If the size of the array exceeds the length an error will be thrown.

```ts
// ✓ VALID
const a: ArrayMax<3, string> = ['A', 'B'];
const b: ArrayMax<4, string> = ['A', 'B', 'C'];

// 𐄂  INVALID
const c: ArrayMax<2, string> = ['A', 'B', 'C'];
```

#### `ArrayMin<number, type>`

Ensures an array type has a minimum length. If the size of the array is less than the length an error will be thrown.

```ts
// ✓ VALID
const a: ArrayMin<2, string> = ['A', 'B'];
const b: ArrayMin<3, string> = ['A', 'B', 'C'];

// 𐄂  INVALID
const c: ArrayMin<2, string> = ['A'];
```

#### `ArrayRange<number, number, type>`

Ensures an array length is more than the `from` size and less than the `to` size.

```ts
// ✓ VALID
const a: ArrayRange<2, 4, string> = ['A', 'B'];
const b: ArrayRange<1, 3, string> = ['A', 'B', 'C'];

// 𐄂  INVALID
const c: ArrayRange<2, 4, string> = ['A'];
```

#### `ConcatUnion<union, separator>`

Concatenates a string union including values from the union type and custom separator.

<!--prettier-ignore -->
```ts
const union: ConcatUnion<'A' | 'B' | 'C', '-'> = (
  | 'A'
  | 'B'
  | 'C'
  | 'A-B'
  | 'B-A'
  | 'A-C'
  | 'B-C'
  | 'A-B-C'
  | 'B-A-C'
  | 'C-A'
  | 'C-B'
  | 'C-A-B'
  | 'C-B-A'
);

```

#### `Join<string, separator>`

Join an array of strings and/or numbers using the given string as a delimiter. Used for defining key paths in a nested object.

> Lifted from [type-fest](https://git.io/JX5eJ)

```ts
 // Mixed (strings & numbers) items; result is: 'foo.0.baz'
const path: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
 *
// Only string items; result is: 'foo.bar.baz'
const path: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz'
 *
// Only number items; result is: '1.2.3'
const path: Join<[1, 2, 3], '.'> = [1, 2, 3].join('.');
```

#### `JoinProps<object, separator?>`

Deeply references object keys to generate a string literal flattened union with an option separator character which will default to `.` dot.

```ts
const props: JoinProps<{
  a: string;
  b: {
    c: string;
    d: {
      e: {
        f: string;
        g: string;
      }[];
    }
  }
> = (
  | "a"
  | "b"
  | "b.c"
  | "b.d.e"
  | "b.d"
  | `b.d.e.${number}.f`
  | `b.d.e.${number}.g`
  | `b.d.e.${number}`
)

```

#### `LiteralUnion<union>`

Allows string types to be passed while respecting intellisense completions.

<!--prettier-ignore -->
```ts
const literal: LiteralUnion<'A' | 'B'> = (
  | 'A'
  | 'C'
  | 'D' // D is allowed to pass
)
```

#### `Merge<object, object>`

Merge two types into a new type. Keys of the second type overrides keys of the first type.

> Lifted from [type-fest](https://git.io/JX5ua)

<!--prettier-ignore -->
```ts
type Foo = { a: number; b: string };
type Bar = { b: number };

const ab: Merge<Foo, Bar> = { a: 1, b: 2 };
```

#### `NumberRange<number, number>`

Generates a number union between 2 numbers excluding the `TO` number limit, returning only the range between.

<!--prettier-ignore -->
```ts
const range: Range<1, 5> = (
  | 1
  | 2
  | 3
  | 4
)
```

#### `ObjectEntries<object>`

Converts an object to a array entries list. Its a type equivalent for `Object.entries()` method.

<!--prettier-ignore -->
```ts
const entries: ObjectEntries<{
  foo: { a: 1 },
  bar: { a: 2 }
}> = (
  [
    ['foo',  { a: 1 }],
    ['bar',  { a: 2 }],
  ]
)
```

#### `OmitProps<string[], object | object[]>`

Used to exclude object properties from a string list and will return the retained properties of the object. When passing an `Array` interface type the returning value will be array, else return value is object.

<!--prettier-ignore -->
```ts

// OBJECT RETURN TYPE
const array: OmitProps<[
  'foo',
  'baz'
], {
  foo: { a: string },
  bar: { a: string },
  baz: { a: string }
}> = {
  bar: { a: 'one' },
}

// ARRAY RETURN TYPE
const array: OmitProps<[
  'foo',
  'baz'
], Array<{
    foo: { a: string },
    bar: { a: string },
    baz: { a: string }
  }>
> = [
  {
    bar: { a: 'one' },
  }
]
```

#### `PartialDeep<object>`

Used to create a type from another type with all keys and nested keys set to optional.

> Lifted from [type-fest](https://github.com/sindresorhus/type-fest/)

<!--prettier-ignore -->
```ts
interface IObject {
  deep: {
    a: string;
    b: string;
    c: {
      d: any;
      e: number;
      f: {
        g: string[]
      }
    }
  }
}

// RESULT

const object: PartialDeep<IObject> = {
  deep: {
    a: 'foo'
  }
};

```

#### `PickProps<string[], object | object[]>`

Used to pick object properties from a string list and will return the selected properties on the object. When passing an `Array` interface type the returning value will be array, else return value is object.

<!--prettier-ignore -->
```ts

// OBJECT RETURN TYPE
const array: PickProps<[
  'foo',
  'baz'
], {
  foo: { a: string },
  bar: { a: string },
  baz: { a: string }
}> = {
  foo: { a: 'one' },
  baz: { a: 'one' },
}

// ARRAY RETURN TYPE
const array: OmitProps<[
  'foo',
  'baz'
], Array<{
    foo: { a: string },
    bar: { a: string },
    baz: { a: string }
  }>
> = [
  {
    foo: { a: 'one' },
    baz: { a: 'one' },
  }
]
```

#### `Split<string, separator>`

Represents an array of strings split using a given character or character set. Typically used on a return type method like `String.prototype.split`.

> Lifted from [type-fest](https://git.io/JX7p5)

<!--prettier-ignore -->
```ts
const split: Split<'a,b,c,d', ','> = ['a','b','c','d']
```

#### `Valueof<object>`

Opposite of `keyof` returning object values as a union type.

<!--prettier-ignore -->
```ts
const values: Valueof<{
  foo: 'a',
  bar: 'b',
  baz: 'c'
}> = (
  | 'a'
  | 'b'
  | 'c'
)
```

### License

Licensed under [MIT](#LICENCE)

---

We [♡](https://www.brixtoltextiles.com/discount/4D3V3L0P3RS]) open source!
