import { pipe } from 'fp-ts/lib/pipeable';
import * as L from 'list/curried';
import { reduce, List } from 'list/curried';

export const uniq = (list: List<string>) =>
  pipe(new Set(list), L.from);

const isNonEmpty = (a: string) => a.length > 0;

export const append = (str: string) => (xs: string) =>
  isNonEmpty(xs) ? str + xs : xs;

export const join = (separator: string) =>
  reduce<string, string>(
    (b, a) =>
      isNonEmpty(a) && isNonEmpty(b) ? b + separator + a : b + a,
    ''
  );
