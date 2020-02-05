export type VAlign = 'top' | 'middle' | 'bottom';
export type HAlign = 'right' | 'center' | 'left';
export type Format = 'webp' | 'jpeg' | 'gif' | 'png';
type Side = 'left' | 'right' | 'top' | 'bottom';
export type Crop = Record<Side, number>;
export type Modifiers<T = string> = Record<
  string,
  (...a: unknown[]) => T
>;

export type Filters<T = string> = Readonly<{
  /**
   * AutoMatically convert png to jpg.
   */
  autoJpg: () => T;

  /**
   * The background_color filter sets the background layer
   * to the specified color. This is specifically useful when converting transparent
   * images (PNG) to JPEG
   * @param {string} color - Any rgb hex color
   */
  backgroundColor: (color: string) => T;

  /**
   * Applies a gaussian blur to the image.
   * @param {number} radius - Radius used in the gaussian function to generate a matrix, maximum value is 150. The bigger the radius more blurred will be the image.
   * @param {number} sigma - Optional. Defaults to the same value as the radius. Sigma used in the gaussian function.
   */
  blur: (radius: number, sigma?: number) => T;

  /**
   * Increases or decreases the image brightness
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  brightness: (amount: number) => T;

  /**
   * Increases or decreases the image contrast
   * @param {number} amount - 100 to 100 - The amount (in %) to change the image brightness
   */
  contrast: (amount: number) => T;

  /**
   * Runs a convolution matrix (or kernel) on the image.
   * @param {number[]} items - An array of matrix items.
   * @param {number} columns - Number of columns in the matrix.
   * @param {boolean} normalize - Whether or not we should divide each matrix item by the sum of all items.
   */
  convolution: (
    items: number[],
    columns: number,
    normalize?: boolean
  ) => T;

  /**
   * Equalizes the color distribution in the image.
   */
  equalize: () => T;

  /**
   * When cropping, thumbor uses focal points in the
   * image to direct the area of the image that matters most.
   * There are several ways of finding focal points.
   * To learn more about focal points, visit the Detection Algorithms.
   */
  extractFocal: () => T;

  /**
   * This filter permit to return an image sized exactly as requested wherever
   * is its ratio by filling with chosen color the missing parts.
   * Usually used with “fit-in” or “adaptive-fit-in”
   * @param {string} color - Any rgb hex color
   * @param {boolean} fillTransparent - Whether transparent areas of the image should be filled or not.
   */
  fill: (color: string, fillTransparent?: boolean) => T;

  /**
   * Adds a focal point, which is used in later transforms.
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   */
  focal: (
    left: number,
    top: number,
    right: number,
    bottom: number
  ) => T;

  /**
   * Sets the format on the image
   * @param {string} format - Either: “webp”, “jpeg”, “gif” or “png”
   */
  format: (format: Format) => T;

  /**
   * Changes the image to grayscale.
   */
  grayscale: () => T;

  /**
   * This filter automatically degrades the quality of the image until
   * the image is under the specified amount of bytes.
   * @param {number} max
   */
  maxBytes: (max: number) => T;

  /**
   * Tells thumbor not to upscale your images.
   * This means that if an original image is 300px width by 200px height and
   * you ask for a 600x400 image, thumbor will still return a 300x200 image.
   */
  noUpscale: () => T;

  /**
   * Adds noise to the image.
   * @param {number} amount - 0 to 100 The amount (in %) of noise to add to the image.
   */
  noise: (amount: number) => T;

  /**
   * This filter applies proportion to height and width
   * passed for cropping.
   * @param {number} amount - 0 to 1
   */
  proportion: (amount: number) => T;

  /**
   * This filter changes the overall quality of the JPEG image
   * (does nothing for PNGs or GIFs).
   * @param {number} amount - 0 to 100 The quality level (in %) that the end image will feature.
   */
  quality: (amount: number) => T;

  /**
   * Changes the amount of color in each of the three channels.
   * @param {number} red - 0 to 100 the amount of redness in the image
   * @param {number} green - 0 to 100 the amount of greenness in the image
   * @param {number} blue - 0 to 100 the amount of blueness in the image
   */
  rgb: (red: number, green: number, blue: number) => T;

  /**
   * Rotate the given image according to the angle value passed.
   * @param {number} angle - 0 to 359 The angle to rotate the image. Numbers greater or equal than 360 will be transformed to a equivalent angle between 0 and 359.
   */
  rotate: (angle: number) => T;

  /**
   * Changes the amount of color in each of the three channels.
   * @param {number\|number[]} radius - Amount of pixels to use for the radius or an array containing the radius and the eclipse used.
   * @param {number} red - 0 to 100 the amount of redness in the image
   * @param {number} green - 0 to 100 the amount of greenness in the image
   * @param {number} blue - 0 to 100 the amount of blueness in the image
   * @param {boolean} transparent - Force transparent background on rounded corners
   */
  roundCorner: (
    radius: number | [number, number],
    red: number,
    green: number,
    blue: number,
    transparent?: boolean
  ) => T;

  /**
   * This filter enhances apparent sharpness of the image.
   * @param {number} amount - Typical values are between 0.0 and 10.0.
   * @param {number} radius - Typical values are between 0.0 and 2.0.
   * @param {boolean} luminanceOnly - Sharpen only luminance channel.
   */
  sharpen: (
    amount: number,
    radius: number,
    luminanceOnly?: boolean
  ) => T;

  /**
   * Removes any Exif information in the resulting image.
   */
  stripExif: () => T;
}>;

export type Manipulations<T = string> = Readonly<{
  /**
   * Resize the image to the specified dimensions. Overrides any previous call
   * to `fitIn` or `resize`.
   *
   * Use a value of 0 for proportional resizing. E.g. for a 640 x 480 image,
   * `.resize(320, 0)` yields a 320 x 240 thumbnail.
   *
   * Use a value of 'orig' to use an original image dimension. E.g. for a 640
   * x 480 image, `.resize(320, 'orig')` yields a 320 x 480 thumbnail.
   * @param  {number\|string} width
   * @param  {number\|string} height
   * @param  {boolean} flipVertically
   * @param  {boolean} flipHorizontally
   */
  resize: (
    width: number | 'orig',
    height: number | 'orig',
    flipVertically?: boolean,
    flipHorizontally?: boolean
  ) => T;

  /**
   * Resize the image to fit in a box of the specified dimensions. Overrides
   * any previous call to `fitIn` or `resize`.
   * @param  {Int} width
   * @param  {Int} height
   */
  fitIn: (width: number, height: number) => T;

  /**
   * Enables smart cropping with an optional value for forcing
   */
  smartCrop: () => T;

  /**
   * Specify horizontal alignment used if width is altered due to cropping
   * @param  {HAlign} vAlign 'left', 'center', 'right'
   */
  hAlign: (hAlign: HAlign) => T;

  /**
   * Specify vertical alignment used if height is altered due to cropping
   * @param  {VAlign} vAlign 'top', 'middle', 'bottom'
   */
  vAlign: (vAlign: VAlign) => T;

  /**
   * Specify that JSON metadata should be returned instead of the thumbnailed
   * image.
   */
  metaDataOnly: () => T;

  /**
   * Manually specify crop window.
   * @param {Integer} left
   * @param {Integer} top
   * @param {Integer} right
   * @param {Integer} bottom
   */
  crop: (
    left: number,
    top: number,
    right: number,
    bottom: number
  ) => T;
}>;

export interface Thumbor
  extends Filters<Thumbor>,
    Manipulations<Thumbor> {
  /**
   * Set path of image
   * @param {string} path
   */
  readonly setPath: (path: string) => Thumbor;

  /**
   * Set the security key of the instance
   * @param {string} securityKey
   */
  readonly setSecurityKey: (securityKey: string) => Thumbor;

  /**
   * Combine image url and operations with secure and unsecure (unsafe) paths
   * @returns {string} - The built url
   */
  readonly buildUrl: () => string;
}
