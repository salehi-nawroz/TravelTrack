import { Path } from './Path';

/**
 * PathProps
 *
 * Creates a string path reference from an object, separating
 * each key using a dot character. This is different from
 * the `DotProp<>` utilitiy. It a shortened equivelent of
 * [Get](https://git.io/JX5Jo) in TypeFest, but lacks support
 * for number properties and is less expressive.
 *
 */
export type PathProps<T, P extends Path<T>> =(
  P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? Rest extends Path<T[Key]>
  ? PathProps<T[Key], Rest>
  : never
  : never
  : P extends keyof T
  ? T[P]
  : never
);
