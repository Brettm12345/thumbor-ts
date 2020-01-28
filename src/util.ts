import { pipe } from 'fp-ts/lib/pipeable';
import { reduce } from 'fp-ts/lib/Array';
import { enc } from 'crypto-js';

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

export const concat = (str: string) => (arr: string[]): string[] =>
  arr.concat(str);

const isNonEmpty = (a: string) => a.length > 0;
export const append = (str: string) => (xs: string) =>
  isNonEmpty(xs) ? str + xs : xs;

export const join = (str: string) => (arr: string[]): string =>
  pipe(
    arr,
    reduce('', (b, a) =>
      isNonEmpty(a) && isNonEmpty(b) ? b + str + a : b + a
    )
  );
