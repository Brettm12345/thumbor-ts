import { Lens } from 'monocle-ts';
import * as Lists from './manipulations';
import { concat } from './util';

export interface Options {
  serverUrl: string;
  securityKey?: string;
  filters?: string[];
  imagePath?: string;
  urlParts?: string[];
}

export type ListName = keyof typeof Lists;
export type LensName = keyof Options;
export type OptionLens<A> = Lens<Options, A>;

const { fromProp: prop, fromNullableProp: propOr } = Lens;
const serverUrl = prop<Options>()('serverUrl');
const filters = propOr<Options>()('filters', []);
const urlParts = propOr<Options>()('urlParts', []);
const imagePath = prop<Options>()('imagePath');
const securityKey = prop<Options>()('securityKey');
export { serverUrl, filters, urlParts, imagePath, securityKey };

export const concatTo = (lens: OptionLens<string[]>) => (
  str: string
) => lens.modify(concat(str));
