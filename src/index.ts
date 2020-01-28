import * as crypto from 'crypto-js';
import { list, List, map } from 'list/curried';
import { error } from 'fp-ts/lib/Console';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import {
  Endomorphism,
  flow,
  unsafeCoerce,
  constant
} from 'fp-ts/lib/function';

import * as lists from './manipulations';
import {
  securityKey,
  urlParts,
  filters,
  imagePath,
  appendTo,
  OptionLens,
  Options
} from './lenses';
import { Thumbor, Modifiers } from './types';
import { join, append, uniq, encodeBase64 } from './util';

const Builder = (options: Options): Thumbor => {
  const modifyOptions = (f: Endomorphism<Options>): Thumbor =>
    pipe(f(options), Builder);

  const setOption = <A>(lens: OptionLens<A>) =>
    flow(lens.set, modifyOptions);

  const getOption = <A>(lens: OptionLens<A>) =>
    pipe(lens.get(options), O.fromNullable);

  const concatLens = (lens: OptionLens<List<string>>) =>
    flow(appendTo(lens), modifyOptions);

  const applyTo = <A>(g: (str: string) => A) => (
    f: (...a: unknown[]) => string
  ) => flow(f, g);

  const applyConcat = flow(concatLens, applyTo);

  const combine = <A>(
    lens: OptionLens<List<string>>,
    modifiers: Modifiers
  ) =>
    pipe<Modifiers, Modifiers<Thumbor>, A>(
      modifiers,
      R.map(applyConcat(lens)),
      unsafeCoerce
    );

  const getHmac = (operation: string): string =>
    pipe(
      getOption(securityKey),
      O.fold(constant('unsafe'), key =>
        pipe(
          crypto.HmacSHA1(operation + options.imagePath, key),
          encodeBase64
        )
      )
    );

  const operation = pipe<
    List<[OptionLens<List<string>>, (xs: List<string>) => string]>,
    List<string>,
    string
  >(
    list(
      [urlParts, join('/')],
      [filters, flow(uniq, join(':'), append('filters:'))]
    ),
    map(([lens, f]) => pipe(lens.get(options), f)),
    join('/')
  );

  return {
    ...combine(urlParts, lists.urlParts),
    ...combine(filters, lists.filters),
    setPath: setOption(imagePath),
    setSecurityKey: setOption(securityKey),
    buildUrl: () =>
      pipe(
        getOption(imagePath),
        O.fold(
          flow(
            error(
              new Error(
                'Cannot build url. No path is set please set the url with setImagePath'
              )
            ),
            constant('Error building url')
          ),
          path =>
            pipe(
              list(
                options.serverUrl,
                getHmac(operation),
                operation,
                path
              ),
              join('/')
            )
        )
      )
  };
};

export default Builder;
