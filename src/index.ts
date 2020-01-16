/* eslint-disable fp/no-class, fp/no-this */
import crypto from 'crypto-js';

export type VAlign = 'top' | 'middle' | 'bottom';
export type HAlign = 'right' | 'center' | 'left';
export type Format = 'webp' | 'jpeg' | 'gif' | 'png';
type Side = 'left' | 'right' | 'top' | 'bottom';
export type Crop = Record<Side, number>;

interface Options {
  serverUrl: string;
  securityKey?: string;
  filters?: string[];
  imagePath?: string;
  urlParts?: string[];
}

export class Thumbor {
  private serverUrl = '';
  private imagePath = '';
  private securityKey: string | undefined = undefined;
  private filters: string[] = [];
  private urlParts: string[] = [];
  constructor(private options: Options) {
    Object.assign(this, options);
  }

  private assignOptions(options: Partial<Options>) {
    return new Thumbor(Object.assign(this.options, options));
  }

  private addPart(part: string) {
    return this.assignOptions({
      urlParts: [...this.urlParts.filter(p => p === part), part]
    });
  }

  private addFilter(filter: string) {
    return this.assignOptions({
      filters: [...this.filters.filter(f => f === filter), filter]
    });
  }

  /**
   * Set path of image
   * @param {string} path
   */
  setPath(path: string) {
    return this.assignOptions({
      imagePath: path.replace(/^\//g, '')
    });
  }

  /**
   * Set the security key of the instance
   * @param {string} securityKey
   */
  setSecurityKey(securityKey: string) {
    return this.assignOptions({ securityKey });
  }

  /**
   * Resize the image to the specified dimensions. Overrides any previous call
   * to `fitIn` or `resize`.
   *
   * Use a value of 0 for proportional resizing. E.g. for a 640 x 480 image,
   * `.resize(320, 0)` yields a 320 x 240 thumbnail.
   *
   * Use a value of 'orig' to use an original image dimension. E.g. for a 640
   * x 480 image, `.resize(320, 'orig')` yields a 320 x 480 thumbnail.
   * @param  {number} width
   * @param  {number} height
   * @param  {boolean} flipVertically
   * @param  {boolean} flipHorizontally
   */
  resize(
    width: number,
    height: number,
    flipVertically = false,
    flipHorizontally = false
  ) {
    return this.addPart(
      `${flipVertically ? '-' : ''}${width}x${
        flipHorizontally ? '-' : ''
      }${height}`
    );
  }

  /**
   * Resize the image to fit in a box of the specified dimensions. Overrides
   * any previous call to `fitIn` or `resize`.
   * @param  {Int} width
   * @param  {Int} height
   */
  fitIn(width: number, height: number) {
    return this.addPart('fit-in').resize(width, height);
  }

  /**
   * Enables smart cropping with an optional value for forcing
   */
  smartCrop() {
    return this.addPart('smart');
  }

  /**
   * Specify horizontal alignment used if width is altered due to cropping
   * @param  {HAlign} vAlign 'left', 'center', 'right'
   */
  hAlign(hAlign: HAlign) {
    return this.addPart(hAlign);
  }

  /**
   * Specify vertical alignment used if height is altered due to cropping
   * @param  {VAlign} vAlign 'top', 'middle', 'bottom'
   */
  vAlign(vAlign: VAlign) {
    return this.addPart(vAlign);
  }

  /**
   * Specify that JSON metadata should be returned instead of the thumbnailed
   * image.
   */
  metaDataOnly() {
    return this.addPart('meta');
  }

  /**
   * Manually specify crop window.
   * @param {Integer} left
   * @param {Integer} top
   * @param {Integer} right
   * @param {Integer} bottom
   */
  crop(left: number, top: number, right: number, bottom: number) {
    return this.addPart(`${left}x${top}:${right}x${bottom}`);
  }

  /**
   * AutoMatically convert png to jpg.
   */
  autoJpg() {
    return this.addFilter('autoJpg()');
  }

  /**
   * The background_color filter sets the background layer
   * to the specified color. This is specifically useful when converting transparent
   * images (PNG) to JPEG
   * @param {string} color - Any rgb hex color
   */
  backgroundColor(color: string) {
    return this.addFilter(`background_color(${color})`);
  }

  /**
   * Applies a gaussian blur to the image.
   * @param {number} radius - Radius used in the gaussian function to generate a matrix, maximum value is 150. The bigger the radius more blurred will be the image.
   * @param {number} sigma - Optional. Defaults to the same value as the radius. Sigma used in the gaussian function.
   */
  blur(radius: number, sigma?: number) {
    return this.addFilter(`blur(${radius}, ${sigma || radius})`);
  }

  /**
   * Increases or decreases the image brightness
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  brightness(amount: number) {
    return this.addFilter(`brightness(${amount})`);
  }

  /**
   * Increases or decreases the image contrast
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  contrast(amount: number) {
    return this.addFilter(`contrast(${amount})`);
  }

  /**
   * Runs a convolution matrix (or kernel) on the image.
   * @param {number[]} items - An array of matrix items.
   * @param {number} columns - Number of columns in the matrix.
   * @param {boolean} normalize - Whether or not we should divide each matrix item by the sum of all items.
   */
  convolution(items: number[], columns: number, normalize = false) {
    return this.addFilter(
      `convolution(${items.join(';')}, ${columns}, ${normalize})`
    );
  }

  /**
   * Equalizes the color distribution in the image.
   */
  equalize() {
    return this.addFilter(`equalize()`);
  }

  /**
   * When cropping, thumbor uses focal points in the
   * image to direct the area of the image that matters most.
   * There are several ways of finding focal points.
   * To learn more about focal points, visit the Detection Algorithms.
   */
  extractFocal() {
    return this.addFilter(`extract_focal()`);
  }

  /**
   * This filter permit to return an image sized exactly as requested wherever
   * is its ratio by filling with chosen color the missing parts.
   * Usually used with “fit-in” or “adaptive-fit-in”
   * @param {string} color - Any rgb hex color
   * @param {boolean} fillTransparent - Whether transparent areas of the image should be filled or not.
   */
  fill(color: string, fillTransparent = false) {
    return this.addFilter(`fill(${color}, ${fillTransparent})`);
  }

  /**
   * Adds a focal point, which is used in later transforms.
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   */
  focal(left: number, top: number, right: number, bottom: number) {
    return this.addFilter(`focal(${left}x${top}:${right}x${bottom})`);
  }

  /**
   * Sets the format on the image
   * @param {string} format - Either: “webp”, “jpeg”, “gif” or “png”
   */
  format(format: Format) {
    return this.addFilter(`format(${format})`);
  }

  /**
   * Changes the image to grayscale.
   */
  grayscale() {
    return this.addFilter('grayscale()');
  }

  /**
   * This filter automatically degrades the quality of the image until
   * the image is under the specified amount of bytes.
   * @param {number} max
   */
  maxBytes(max: number) {
    return this.addFilter(`max_bytes(${max})`);
  }

  /**
   * Tells thumbor not to upscale your images.
   * This means that if an original image is 300px width by 200px height and
   * you ask for a 600x400 image, thumbor will still return a 300x200 image.
   */
  noUpscale() {
    return this.addFilter('no_upscale()');
  }

  /**
   * Adds noise to the image.
   * @param {number} amount - 0 to 100 The amount (in %) of noise to add to the image.
   */
  noise(amount: number) {
    return this.addFilter(`noise(${amount})`);
  }

  /**
   * This filter applies proportion to height and width
   * passed for cropping.
   * @param {number} amount - 0 to 1
   */
  proportion(amount: number) {
    return this.addFilter(`proportion(${amount})`);
  }

  /**
   * This filter changes the overall quality of the JPEG image
   * (does nothing for PNGs or GIFs).
   * @param {number} amount - 0 to 100 The quality level (in %) that the end image will feature.
   */
  quality(amount: number) {
    return this.addFilter(`quality(${amount})`);
  }

  /**
   * Changes the amount of color in each of the three channels.
   * @param {number} red - 0 to 100 the amount of redness in the image
   * @param {number} green - 0 to 100 the amount of greenness in the image
   * @param {number} blue - 0 to 100 the amount of blueness in the image
   */
  rgb(red: number, green: number, blue: number) {
    return this.addFilter(`rgb(${red}, ${green}, ${blue})`);
  }

  /**
   * Rotate the given image according to the angle value passed.
   * @param {number} angle - 0 to 359 The angle to rotate the image. Numbers greater or equal than 360 will be transformed to a equivalent angle between 0 and 359.
   */
  rotate(angle: number) {
    return this.addFilter(`rotate(${angle})`);
  }

  /**
   * Changes the amount of color in each of the three channels.
   * @param {number\|number[]} radius - Amount of pixels to use for the radius or an array containing the radius and the eclipse used.
   * @param {number} red - 0 to 100 the amount of redness in the image
   * @param {number} green - 0 to 100 the amount of greenness in the image
   * @param {number} blue - 0 to 100 the amount of blueness in the image
   * @param {boolean} transparent - Force transparent background on rounded corners
   */
  roundCorner(
    radius: number | [number, number],
    red: number,
    green: number,
    blue: number,
    transparent = false
  ) {
    return this.addFilter(
      `round_corner(${
        Array.isArray(radius) ? radius.join('|') : radius
      }, ${red}, ${green}, ${blue}, ${transparent})`
    );
  }

  /**
   * This filter enhances apparent sharpness of the image.
   * @param {number} amount - Typical values are between 0.0 and 10.0.
   * @param {number} radius - Typical values are between 0.0 and 2.0.
   * @param {boolean} luminanceOnly - Sharpen only luminance channel.
   */
  sharpen(amount: number, radius: number, luminanceOnly = false) {
    return this.addFilter(
      `sharpen(${amount}, ${radius}, ${luminanceOnly})`
    );
  }

  /**
   * Removes any Exif information in the resulting image.
   */
  stripExif() {
    return this.addFilter('strip_exif()');
  }

  private getHmac(operation: string): string {
    if (this.securityKey == null) return 'unsafe';
    const key = crypto.HmacSHA1(
      operation + this.imagePath,
      this.securityKey
    );

    const keyString = crypto.enc.Base64.stringify(key)
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return keyString;
  }

  /**
   * Combine image url and operations with secure and unsecure (unsafe) paths
   * @return {string}
   */
  buildUrl(): string {
    const operation = `${
      this.urlParts.length > 0 ? this.urlParts.join('/') : ''
    }${
      this.filters.length > 0
        ? `/filters:${this.filters.join(':')}`
        : ''
    }`;
    const hmac = this.getHmac(operation);
    return `${this.serverUrl}/${hmac}/${operation}${
      operation.length > 0 ? '/' : ''
    }${this.imagePath}`;
  }
}
