import crypto from 'crypto-js'

import { allGt0, sanitizeBase64 } from './util'

export type VAlign = 'top' | 'middle' | 'bottom';
export type HAlign = 'right' | 'center' | 'left';
export type Format = 'webp' | 'jpeg' | 'gif' | 'png';
export type Crop = Record<
  'left' | 'right' | 'top' | 'bottom',
  number
>;

export class Thumbor {
  private imagePath = '';
  private width = 0;
  private height = 0;
  private smart = false;
  private fitInFlag = false;
  private flipHorizontally = false;
  private flipVertically = false;
  private hAlignValue: HAlign | null = null;
  private vAlignValue: VAlign | null = null;
  private cropValues: Crop | null = null;
  private meta = false;
  private filters: string[] = [];
  constructor(
    private serverUrl: string,
    private securityKey?: string
  ) {
    this.serverUrl = serverUrl;
    this.securityKey = securityKey;
  }

  /**
   * Set path of image
   * @param {string} path
   */
  setPath(path: string) {
    this.imagePath = path.replace(/^\//g, '');
    return this;
  }

  /**
   * Set the security key of the instance
   * @param {string} key
   */
  setSecurityKey(key: string) {
    this.securityKey = key;
    return this;
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
   */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    return this;
  }

  /**
   * Resize the image to fit in a box of the specified dimensions. Overrides
   * any previous call to `fitIn` or `resize`.
   * @param  {Int} width
   * @param  {Int} height
   */
  fitIn(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.fitInFlag = true;
    return this;
  }

  /**
   * Enables smart cropping with an optional value for forcing
   */
  smartCrop() {
    this.smart = true;
    return this;
  }

  /**
   * Specify horizontal alignment used if width is altered due to cropping
   * @param  {HAlign} vAlign 'left', 'center', 'right'
   */
  hAlign(hAlign: HAlign) {
    this.hAlignValue = hAlign;
    return this;
  }

  /**
   * Specify vertical alignment used if height is altered due to cropping
   * @param  {VAlign} vAlign 'top', 'middle', 'bottom'
   */
  vAlign(vAlign: VAlign) {
    this.vAlignValue = vAlign;
    return this;
  }

  /**
   * Specify that JSON metadata should be returned instead of the thumbnailed
   * image.
   */
  metaDataOnly() {
    this.meta = true;
    return this;
  }

  /**
   * Manually specify crop window.
   * @param {Integer} left
   * @param {Integer} top
   * @param {Integer} right
   * @param {Integer} bottom
   */
  crop(left: number, top: number, right: number, bottom: number) {
    if (allGt0(left, top, right, bottom)) {
      this.cropValues = {
        left: left,
        top: top,
        right: right,
        bottom: bottom
      };
    }
    return this;
  }

  /**
   * AutoMatically convert png to jpg.
   */
  autoJpg() {
    this.filters.push('autoJpg()');
    return this;
  }

  /**
   * The background_color filter sets the background layer
   * to the specified color. This is specifically useful when converting transparent
   * images (PNG) to JPEG
   * @param {string} color - Any rgb hex color
   */
  backgroundColor(color: string) {
    this.filters.push(`background_color(${color})`);
    return this;
  }

  /**
   * Applies a gaussian blur to the image.
   * @param {number} radius - Radius used in the gaussian function to generate a matrix, maximum value is 150. The bigger the radius more blurred will be the image.
   * @param {number} sigma - Optional. Defaults to the same value as the radius. Sigma used in the gaussian function.
   */
  blur(radius: number, sigma?: number) {
    this.filters.push(`blur(${radius}, ${sigma || radius})`);
    return this;
  }

  /**
   * Increases or decreases the image brightness
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  brightness(amount: number) {
    this.filters.push(`brightness(${amount})`);
    return this;
  }

  /**
   * Increases or decreases the image contrast
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  contrast(amount: number) {
    this.filters.push(`contrast(${amount})`);
    return this;
  }

  /**
   * Runs a convolution matrix (or kernel) on the image.
   * @param {number[]} items - An array of matrix items.
   * @param {number} columns - Number of columns in the matrix.
   * @param {boolean} normalize - Whether or not we should divide each matrix item by the sum of all items.
   */
  convolution(
    items: number[],
    columns: number,
    normalize: boolean = false
  ) {
    this.filters.push(
      `convolution(${items.join(';')}, ${columns}, ${normalize})`
    );
    return this;
  }

  /**
   * Equalizes the color distribution in the image.
   */
  equalize() {
    this.filters.push('equalize()');
    return this;
  }

  /**
   * When cropping, thumbor uses focal points in the
   * image to direct the area of the image that matters most.
   * There are several ways of finding focal points.
   * To learn more about focal points, visit the Detection Algorithms.
   */
  extractFocal() {
    this.filters.push('extract_focal()');
    return this;
  }

  /**
   * This filter permit to return an image sized exactly as requested wherever
   * is its ratio by filling with chosen color the missing parts.
   * Usually used with “fit-in” or “adaptive-fit-in”
   * @param {string} color - Any rgb hex color
   * @param {boolean} fillTransparent - Whether transparent areas of the image should be filled or not.
   */
  fill(color: string, fillTransparent: boolean = false) {
    this.filters.push(`fill(${color}, ${fillTransparent})`);
    return this;
  }

  /**
   * Adds a focal point, which is used in later transforms.
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   */
  focal(left: number, top: number, right: number, bottom: number) {
    this.filters.push(`focal(${left}x${top}:${right}x${bottom})`);
  }

  /**
   * Sets the format on the image
   * @param {string} format - Either: “webp”, “jpeg”, “gif” or “png”
   */
  format(format: Format) {
    this.filters.push(`format(${format})`);
    return this;
  }

  /**
   * Changes the image to grayscale.
   */
  grayscale() {
    this.filters.push('grayscale()');
    return this;
  }

  /**
   * This filter automatically degrades the quality of the image until
   * the image is under the specified amount of bytes.
   * @param {number} max
   */
  maxBytes(max: number) {
    this.filters.push(`max_bytes(${max})`);
    return this;
  }

  /**
   * Tells thumbor not to upscale your images.
   * This means that if an original image is 300px width by 200px height and
   * you ask for a 600x400 image, thumbor will still return a 300x200 image.
   */
  noUpscale() {
    this.filters.push('no_upscale()');
    return this;
  }

  /**
   * Adds noise to the image.
   * @param {number} amount - 0 to 100 The amount (in %) of noise to add to the image.
   */
  noise(amount: number) {
    this.filters.push(`noise(${amount})`);
    return this;
  }

  /**
   * This filter applies proportion to height and width
   * passed for cropping.
   * @param {number} amount - 0 to 1
   */
  proportion(amount: number) {
    this.filters.push(`proportion(${amount})`);
    return this;
  }

  /**
   * This filter changes the overall quality of the JPEG image
   * (does nothing for PNGs or GIFs).
   * @param {number} amount - 0 to 100 The quality level (in %) that the end image will feature.
   */
  quality(amount: number) {
    this.filters.push(`quality(${amount})`);
    return this;
  }

  /**
   * Changes the amount of color in each of the three channels.
   * @param {number} red - 0 to 100 the amount of redness in the image
   * @param {number} green - 0 to 100 the amount of greenness in the image
   * @param {number} blue - 0 to 100 the amount of blueness in the image
   */
  rgb(red: number, green: number, blue: number) {
    this.filters.push(`rgb(${red}, ${green}, ${blue})`);
    return this;
  }

  /**
   * Rotate the given image according to the angle value passed.
   * @param {number} angle - 0 to 359 The angle to rotate the image. Numbers greater or equal than 360 will be transformed to a equivalent angle between 0 and 359.
   */
  rotate(angle: number) {
    this.filters.push(`rotate(${angle})`);
    return this;
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
    transparent: boolean = false
  ) {
    this.filters.push(
      `round_corner(${
        Array.isArray(radius) ? radius.join('|') : radius
      }, ${red}, ${green}, ${blue}, ${transparent})`
    );
    return this;
  }

  /**
   * This filter enhances apparent sharpness of the image.
   * @param {number} amount - Typical values are between 0.0 and 10.0.
   * @param {number} radius - Typical values are between 0.0 and 2.0.
   * @param {boolean} luminanceOnly - Sharpen only luminance channel.
   */
  sharpen(
    amount: number,
    radius: number,
    luminanceOnly: boolean = false
  ) {
    this.filters.push(
      `sharpen(${amount}, ${radius}, ${luminanceOnly})`
    );
    return this;
  }

  /**
   * Removes any Exif information in the resulting image.
   */
  stripExif() {
    this.filters.push('strip_exif()');
    return this;
  }

  getHmac(operation: string): string {
    if (this.securityKey) {
      const hash = crypto.HmacSHA1(
        operation + this.imagePath,
        this.securityKey
      );
      return sanitizeBase64(crypto.enc.Base64.stringify(hash));
    }
    return 'unsafe';
  }

  /**
   * Combine image url and operations with secure and unsecure (unsafe) paths
   * @return {string}
   */
  buildUrl(): string {
    const operation = this.getOperationPath();
    const hmac = this.getHmac(operation);
    return `${this.serverUrl}/${hmac}/${operation}${this.imagePath}`;
  }

  /**
   * Converts operation array to string
   * @return {string}
   */
  private getOperationPath(): string {
    var parts = this.urlParts();

    if (parts.length === 0) {
      return '';
    }

    return parts.join('/') + '/';
  }

  /**
   * Build operation array
   *
   * @TODO Should be refactored so that strings are generated in the
   * commands as opposed to in 1 massive function
   *
   * @return {string[]}
   */
  urlParts(): string[] {
    if (!this.imagePath) {
      throw new Error("The image url can't be null or empty.");
    }

    let parts: string[] = [];

    if (this.meta === true) {
      parts.push('meta');
    }

    if (this.cropValues != null) {
      const { left, top, right, bottom } = this.cropValues;
      parts.push(`${left}x${top}:${right}x${bottom}`);
    }

    if (this.fitInFlag === true) {
      parts.push('fit-in');
    }

    if (
      this.width ||
      this.height ||
      this.flipHorizontally ||
      this.flipVertically
    ) {
      const dashIf = (item: any) => (!!item ? '-' : '');

      const sizeString = `${dashIf(this.flipHorizontally)}${
        this.width
      }x${dashIf(this.flipVertically)}${this.height}`;
      parts.push(sizeString);
    }

    if (this.hAlignValue != null) {
      parts.push(this.hAlignValue);
    }

    if (this.vAlignValue != null) {
      parts.push(this.vAlignValue);
    }

    if (this.smart === true) {
      parts.push('smart');
    }

    if (this.filters.length > 0) {
      parts.push('filters:' + this.filters.join(':'));
    }

    return parts;
  }
}
