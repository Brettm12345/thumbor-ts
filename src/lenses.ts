import { Lens } from 'monocle-ts';
import { append, list, List } from 'list/curried';

import * as Lists from './manipulations';

export type Options = Readonly<{
  serverUrl: string;
  securityKey?: string;
  filters?: List<string>;
  imagePath?: string;
  urlParts?: List<string>;
}>;

export type ListName = keyof typeof Lists;
export type LensName = keyof Options;
export type OptionLens<A> = Lens<Options, A>;
export type ListLens = OptionLens<List<string>>;

const { fromProp: prop, fromNullableProp: propOr } = Lens;
const serverUrl = prop<Options>()('serverUrl');
const filters = propOr<Options>()('filters', list(''));
const urlParts = propOr<Options>()('urlParts', list(''));
const imagePath = prop<Options>()('imagePath');
const securityKey = prop<Options>()('securityKey');
export { serverUrl, filters, urlParts, imagePath, securityKey };

export const appendTo = (lens: OptionLens<List<string>>) => (
  str: string
) => lens.modify(append(str));
