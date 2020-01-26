import { identity, unsafeCoerce } from 'fp-ts/lib/function';

import { Filters, Manipulations, Modifiers } from './types';

const { isArray } = Array;
type BuildModifiers = <A>(a: A) => Modifiers;
const buildModifiers: BuildModifiers = unsafeCoerce;

export const filters = buildModifiers<Filters>({
  autoJpg: () => 'autoJpg()',
  backgroundColor: color => `background_color(${color})`,
  blur: (radius, sigma) => `blur(${radius}, ${sigma || radius})`,
  brightness: amount => `brightness(${amount})`,
  contrast: amount => `contrast(${amount})`,
  convolution: (items, columns, normalize = false) =>
    `convolution(${items.join(';')}, ${columns}, ${normalize})`,
  equalize: () => 'equalize()',
  extractFocal: () => 'extract_focal()',
  fill: (color, fillTransparent = false) =>
    `fill(${color}, ${fillTransparent})`,
  focal: (left, top, right, bottom) =>
    `focal(${left}x${top}:${right}x${bottom})`,
  format: format => `format(${format})`,
  grayscale: () => 'grayscale()',
  maxBytes: max => `max_bytes(${max})`,
  noUpscale: () => 'no_upscale()',
  noise: amount => `noise(${amount})`,
  proportion: amount => `proportion(${amount})`,
  quality: amount => `quality(${amount})`,
  rgb: (red, green, blue) => `rgb(${red}, ${green}, ${blue})`,
  rotate: angle => `rotate(${angle})`,
  roundCorner: (radius, red, green, blue, transparent = false) =>
    `round_corner(${
      isArray(radius) ? radius.join('|') : radius
    }, ${red}, ${green}, ${blue}, ${transparent})`,
  sharpen: (amount, radius, luminanceOnly = false) =>
    `sharpen(${amount}, ${radius}, ${luminanceOnly})`,
  stripExif: () => `strip_exif()`
});

const dash = (bool: boolean): string => (bool ? '-' : '');

export const urlParts = buildModifiers<Manipulations>({
  resize: (
    width,
    height,
    flipVertically = false,
    flipHorizontally = false
  ) =>
    `${dash(flipVertically)}${width}x${dash(
      flipHorizontally
    )}${height}`,
  fitIn: (width, height) => `fit-in/${width}x${height}`,
  smartCrop: () => 'smart',
  hAlign: identity,
  vAlign: identity,
  metaDataOnly: () => 'meta',
  crop: (left, top, right, bottom) =>
    `${left}x${top}:${right}x${bottom}`
});
