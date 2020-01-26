import { filter, map, uniq, isNonEmpty } from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray';
import { Thumbor, Filters, Manipulations, Modifiers } from './types';
import { Lens } from 'monocle-ts';
import crypto from 'crypto-js';
import {
  manipulations as manipulationList,
  filters as filterList
} from './manipulations';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import {
  Endomorphism,
  flow,
  unsafeCoerce,
  constant
} from 'fp-ts/lib/function';
import { eqString } from 'fp-ts/lib/Eq';

const concat = <A>(str: A) => (arr: A[]): A[] => arr.concat(str);
const join = (str: string) => (arr: unknown[]): string =>
  arr.join(str);

interface Options {
  serverUrl: string;
  securityKey?: string;
  filters?: string[];
  imagePath?: string;
  urlParts?: string[];
}

const nullableOption = Lens.fromNullableProp<Options>();
const imagePath = nullableOption('imagePath', '');
const securityKey = nullableOption('securityKey', '');
const filterLens = nullableOption('filters', []);
const urlPartLens = nullableOption('urlParts', []);
const Builder = (options: Options): Thumbor => {
  const modifyOptions = (f: Endomorphism<Options>): Thumbor =>
    pipe(options, f, Builder);

  const setOption = <A>(lens: Lens<Options, A>) =>
    flow(lens.set, modifyOptions);

  const concatLens = (lens: Lens<Options, string[]>) => (
    str: string
  ) => modifyOptions(lens.modify(concat(str)));

  const applyTo = <A>(g: (str: string) => A) => (
    f: (...a: unknown[]) => string
  ) => flow(f, g);

  const combineAs = <A>(
    lens: Lens<Options, string[]>,
    record: Modifiers
  ): A =>
    pipe<Modifiers, Modifiers<Thumbor>, A>(
      record,
      R.map(applyTo(concatLens(lens))),
      unsafeCoerce
    );

  const manipulations: Manipulations<Thumbor> = combineAs(
    urlPartLens,
    manipulationList
  );

  const imageFilters: Filters<Thumbor> = combineAs(
    filterLens,
    filterList
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

  return {
    ...manipulations,
    ...imageFilters,
    setPath: setOption(imagePath),
    setSecurityKey: setOption(securityKey),
    buildUrl: () => {
      const urlParts = pipe(
        O.fromNullable(options.urlParts),
        O.map(join('/'))
      );

      const param = (key: string) => (value: string): string =>
        `${key}:${value}`;

      const handleFilters = flow(
        uniq(eqString),
        join(':'),
        param('filters')
      );

      const filters = pipe(
        O.fromNullable(options.filters),
        O.map(handleFilters)
      );

      const slash = (a: string): string => `${a}/`;

      const operation = pipe(
        [urlParts, filters],
        filter(O.isSome),
        map(O.toNullable),
        NonEmptyArray.fromArray,
        O.fold(constant(''), flow(join('/'), slash))
      );
      const hmac = getHmac(operation);
      return `${options.serverUrl}/${hmac}/${operation}${options.imagePath}`;
    }
  };
};

export default Builder;
