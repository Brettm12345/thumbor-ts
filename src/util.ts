import { reduce, List } from 'list/curried';
import { enc } from 'crypto-js';
import * as L from 'list/curried';

export const uniq = (list: List<string>) => L.from(new Set(list));

export const encodeBase64 = (key: any) =>
  enc.Base64.stringify(key)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const isNonEmpty = (a: string) => a.length > 0;

export const append = (str: string) => (xs: string) =>
  isNonEmpty(xs) ? str + xs : xs;

export const join = (separator: string) =>
  reduce<string, string>(
    (b, a) =>
      isNonEmpty(a) && isNonEmpty(b) ? b + separator + a : b + a,
    ''
  );
