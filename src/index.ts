import { map, uniq } from 'fp-ts/lib/Array';
import { eqString } from 'fp-ts/lib/Eq';
import * as O from 'fp-ts/lib/Option';
import { Option } from 'fp-ts/lib/Option';
import * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import { Endomorphism, flow, unsafeCoerce } from 'fp-ts/lib/function';
import crypto from 'crypto-js';

import { lens, OptionalLensName, optional, LensName } from './lenses';
import { Options, OptionLens } from './lenses';
import * as lists from './manipulations';
import { Thumbor, Modifiers } from './types';

const concat = (str: string) => (arr: string[]): string[] =>
  arr.concat(str);
const join = (str: string) => (arr: unknown[]): string =>
  arr.join(str);

const Builder = (options: Options): Thumbor => {
  const modifyOptions = (f: Endomorphism<Options>): Thumbor =>
    pipe(f(options), Builder);

  const setOption = (name: LensName) =>
    flow(lens(name).set, modifyOptions);

  const getOption = (name: OptionalLensName) =>
    pipe(options, optional(name));

  const concatLens = (name: 'filters' | 'urlParts') => (
    str: string
  ) =>
    modifyOptions(
      (lens(name) as OptionLens<string[]>).modify(concat(str))
    );

  const applyTo = <A>(g: (str: string) => A) => (
    f: (...a: unknown[]) => string
  ) => flow(f, g);

  const applyConcat = flow(concatLens, applyTo);

  type ListName = keyof typeof lists;

  const combine = <A>(
    lensName: 'filters' | 'urlParts',
    list: ListName = lensName as ListName
  ) =>
    pipe<Modifiers, Modifiers<Thumbor>, A>(
      lists[list],
      pipe(applyConcat(lensName), R.map),
      unsafeCoerce
    );

  const getHmac = (operation: string): string => {
    if (options.securityKey == null) return 'unsafe';
    const key = crypto.HmacSHA1(
      operation + options.imagePath,
      options.securityKey
    );

    const keyString = crypto.enc.Base64.stringify(key)
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return keyString;
  };

  const operation = pipe(
    ['urlParts', 'filters'],
    map(getOption),
    unsafeCoerce,
    ([urlParts, filters]: Array<Option<string[]>>) =>
      pipe(
        [
          [urlParts, join('/')],
          [
            filters,
            flow(uniq(eqString), join(':'), x => `filters:${x}`)
          ]
        ],
        map(([fa, f]: [Option<string[]>, (xs: string[]) => string]) =>
          pipe(fa, O.chain(NonEmptyArray.fromArray), O.map(f))
        ),
        map(O.toUndefined),
        join('')
      )
  );

  return {
    ...combine('urlParts'),
    ...combine('filters'),
    setPath: setOption('imagePath'),
    setSecurityKey: setOption('securityKey'),
    buildUrl: () =>
      pipe(
        [
          options.serverUrl,
          getHmac(operation),
          operation +
            `${operation.length > 0 ? '/' : ''}${options.imagePath}`
        ],
        join('/')
      )
  };
};

export default Builder;
