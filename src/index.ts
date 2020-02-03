import * as R from 'fp-ts/lib/Record';
import { Endomorphism, flow, unsafeCoerce } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

import build from './buildUrl';
import {
  OptionLens,
  Options,
  appendTo as appendToLens,
  filters,
  imagePath,
  securityKey,
  urlParts,
  ListLens
} from './lenses';
import * as manipulations from './manipulations';
import { Modifiers, Thumbor } from './types';

const thumbor = (options: Options): Thumbor => {
  const modifyOptions = (f: Endomorphism<Options>): Thumbor =>
    pipe(options, f, thumbor);

  const set = <A>(lens: OptionLens<A>) =>
    flow(lens.set, modifyOptions);

  const appendToOption = (lens: ListLens) =>
    flow(appendToLens(lens), modifyOptions);

  const applyTo = <A>(g: (str: string) => A) => (
    f: (...a: unknown[]) => string
  ) => flow(f, g);

  const appendTo = flow(appendToOption, applyTo);

  const combine = <A>(lens: ListLens, modifiers: Modifiers) =>
    pipe<Modifiers, Modifiers<Thumbor>, A>(
      modifiers,
      R.map(appendTo(lens)),
      unsafeCoerce
    );

  return {
    ...combine(urlParts, manipulations.urlParts),
    ...combine(filters, manipulations.filters),
    setPath: set(imagePath),
    setSecurityKey: set(securityKey),
    buildUrl: build(options)
  };
};

export default thumbor;
