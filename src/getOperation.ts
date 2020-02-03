import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { List, list, map } from 'list/curried';

import { OptionLens, Options, filters, urlParts } from './lenses';
import { append, join, uniq } from './util';

const getOperation = (options: Options) =>
  pipe<
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

export default getOperation;
