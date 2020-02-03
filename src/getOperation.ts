import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { List, list, map } from 'list/curried';

import { Options, filters, urlParts, ListLens } from './lenses';
import { append, join, uniq } from './util';

const getOperation = (options: Options): string =>
  pipe(
    list(
      [urlParts, join('/')],
      [filters, flow(uniq, join(':'), append('filters:'))]
    ) as List<[ListLens, (xs: List<string>) => string]>,
    map(([lens, f]) => pipe(lens.get(options), f)),
    join('/')
  );

export default getOperation;
