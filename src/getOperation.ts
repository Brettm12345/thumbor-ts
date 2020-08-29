import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { List, list, map, contains } from 'list/curried';

import { Options, filters, urlParts, ListLens } from './lenses';
import { append, join, uniq } from './util';

const hasMeta = contains('meta');

const getOperation = (options: Options): string => {
  if (hasMeta(urlParts.get(options))) {
    return `meta`;
  }
  return pipe(
    list(
      [urlParts, join('/')],
      [filters, flow(uniq, join(':'), append('filters:'))]
    ) as List<[ListLens, (xs: List<string>) => string]>,
    map(([lens, f]) => pipe(lens.get(options), f)),
    join('/')
  );
};

export default getOperation;
