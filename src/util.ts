import { eqString } from 'fp-ts/lib/Eq';
import { flow, Endomorphism } from 'fp-ts/lib/function';
import { reduce, List } from 'list/curried';
import { pipe } from 'fp-ts/lib/pipeable';
import { enc } from 'crypto-js';
import * as L from 'list/curried';
import * as A from 'fp-ts/lib/Array';

export const uniq: Endomorphism<List<string>> = flow(
  L.toArray,
  A.uniq(eqString),
  L.from
);

export const replace = (
  searchValue: {
    [Symbol.replace](string: string, replaceValue: string): string;
  },
  replaceValue: string
) => (str: string) => str.replace(searchValue, replaceValue);

// When I use flow here I get TypeError: Cannot read property 'charAt' of undefined
export const encodeBase64 = (key: any) =>
  pipe(
    enc.Base64.stringify(key),
    replace(/\+/g, '-'),
    replace(/\//g, '_')
  );

const isNonEmpty = (a: string) => a.length > 0;
export const append = (str: string) => (xs: string) =>
  isNonEmpty(xs) ? str + xs : xs;

export const join = (separator: string) =>
  reduce<string, string>(
    (b, a) =>
      isNonEmpty(a) && isNonEmpty(b) ? b + separator + a : b + a,
    ''
  );
