import * as crypto from 'crypto-js';
import * as Log from 'fp-ts/lib/Console';
import { IO } from 'fp-ts/lib/IO';
import * as O from 'fp-ts/lib/Option';
import { constant, flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { list } from 'list';

import getOperation from './getOperation';
import { Options } from './lenses';
import { join } from './util';

export const encodeBase64 = (key: any) =>
  crypto.enc.Base64.stringify(key)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const buildUrl = (options: Options): IO<string> => () => {
  const { serverUrl, imagePath, securityKey } = options;
  const operation = getOperation(options);
  const hmac = pipe(
    securityKey,
    O.fromNullable,
    O.fold(constant('unsafe'), key =>
      pipe(crypto.HmacSHA1(operation + imagePath, key), encodeBase64)
    )
  );
  return pipe(
    imagePath,
    O.fromNullable,
    O.fold(
      flow(
        Log.error(
          new Error(
            'Cannot build url. No path is set please set the url with setImagePath'
          )
        ),
        constant('Error building url. No path set')
      ),
      path => pipe(list(serverUrl, hmac, operation, path), join('/'))
    )
  );
};

export default buildUrl;
