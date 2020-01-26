import { Lens } from 'monocle-ts';

export interface Options {
  serverUrl: string;
  securityKey?: string;
  filters?: string[];
  imagePath?: string;
  urlParts?: string[];
}

const defaults: Required<Omit<Options, 'serverUrl'>> = {
  imagePath: '',
  securityKey: '',
  filters: [],
  urlParts: []
};

export type LensName = keyof Options;
export type OptionalLensName = keyof typeof defaults;
export type OptionLens<A> = Lens<Options, A>;

const option = Lens.fromNullableProp<Options>();
const prop = Lens.fromProp<Options>();
export const lens = (name: LensName) =>
  name === 'serverUrl' ? prop(name) : option(name, defaults[name]);
export const optional = (name: keyof typeof defaults) =>
  option(name, defaults[name]).asOptional().getOption;
