import { flow } from 'fp-ts/lib/function';
import { enc } from 'crypto-js';

export const replace = (
  searchValue: {
    [Symbol.replace](string: string, replaceValue: string): string;
  },
  replaceValue: string
) => (str: string) => str.replace(searchValue, replaceValue);

export const encodeBase64 = flow(
  enc.Base64.stringify,
  replace(/\+/g, '-'),
  replace(/\//g, '_')
);
