import { Filters, Manipulations } from './types';
import { identity } from 'fp-ts/lib/function';

export const filters: Filters<string> = {
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
  noUpscale: () => `no_upscale()`,
  noise: amount => `noise(${amount})`,
  proportion: amount => `proportion(${amount})`,
  quality: amount => `quality(${amount})`,
  rgb: (red, green, blue) => `rgb(${red}, ${green}, ${blue})`,
  rotate: angle => `rotate(${angle})`,
  roundCorner: (radius, red, green, blue, transparent = false) =>
    `round_corner(${
      Array.isArray(radius) ? radius.join('|') : radius
    }, ${red}, ${green}, ${blue}, ${transparent})`,
  sharpen: (amount, radius, luminanceOnly = false) =>
    `sharpen(${amount}, ${radius}, ${luminanceOnly})`,
  stripExif: () => `strip_exif()`
};

export const manipulations: Manipulations<string> = {
  resize: (
    width,
    height,
    flipVertically = false,
    flipHorizontally = false
  ) =>
    `${flipVertically ? '-' : ''}${width}x${
      flipHorizontally ? '-' : ''
    }${height}`,
  fitIn: (width, height) =>
    `fit-in/${manipulations.resize(width, height)}`,
  smartCrop: () => 'smart',
  hAlign: identity,
  vAlign: identity,
  metaDataOnly: () => 'meta',
  crop: (left, top, right, bottom) =>
    `${left}x${top}:${right}x${bottom}`
};
