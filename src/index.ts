import { uniq } from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { Thumbor, Filters, Manipulations } from './types';
import { Lens } from 'monocle-ts';
import crypto from 'crypto-js';
import {
  manipulations as manipulationList,
  filters as filterList
} from './manipulations';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import { Endomorphism, flow } from 'fp-ts/lib/function';
import { eqString } from 'fp-ts/lib/Eq';
export { Thumbor } from './types';

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
    pipe(
      options,
      f,
      Builder
    );

  const concat = (x: string) => (xs: string[]) => xs.concat(x);
  const concatStr = (lens: Lens<Options, string[]>) => (
    str: string
  ) => modifyOptions(lens.modify(concat(str)));

  const applyTo = <A>(g: (str: string) => A) => (
    f: (...a: unknown[]) => string
  ) =>
    flow(
      f,
      g
    );

  type ManipulationRecord = Record<
    string,
    (...a: unknown[]) => string
  >;

  const manipulations = (pipe(
    (manipulationList as unknown) as ManipulationRecord,
    R.map(applyTo(concatStr(urlPartLens)))
  ) as unknown) as Manipulations<Thumbor>;

  const imageFilters = (pipe(
    (filterList as unknown) as ManipulationRecord,
    R.map(applyTo(concatStr(filterLens)))
  ) as unknown) as Filters<Thumbor>;

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
    setPath: flow(
      imagePath.set,
      modifyOptions
    ),
    setSecurityKey: flow(
      securityKey.set,
      modifyOptions
    ),
    buildUrl: () => {
      const urlParts = pipe(
        O.fromNullable(options.urlParts),
        O.map(a => a.join('/'))
      );

      const filters = pipe(
        O.fromNullable(options.filters),
        O.map(
          flow(
            uniq(eqString),
            a => a.join(':'),
            a => `filters:${a}`
          )
        )
      );

      const operation = [urlParts, filters]
        .filter(O.isSome)
        .map(O.toNullable)
        .join('/');

      const hmac = getHmac(operation);
      return `${options.serverUrl}/${hmac}/${operation}${
        operation.length > 0 ? '/' : ''
      }${options.imagePath}`;
    }
  };
};

export default Builder;
