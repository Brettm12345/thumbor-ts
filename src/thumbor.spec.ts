import { Thumbor } from './thumbor'

describe('thumbor', () => {
  const serverUrl = 'http://localhost';
  const unsafeUrl = `${serverUrl}/unsafe`;
  const imagePath = '/react-day-picker.png';
  const thumbor = new Thumbor(serverUrl);
  const image = thumbor.setPath(imagePath);

  it('Generates urls', () => {
    expect(image.buildUrl()).toBe(`${unsafeUrl}${imagePath}`);
  });

  it('Works with resize', () => {
    expect(image.resize(30, 30).buildUrl()).toContain('30x30');
  });

  it('Works with crop', () => {
    expect(image.crop(10, 10, 30, 30).buildUrl()).toContain(
      '10x10:30x30'
    );
  });

  it('Works with filter', () => {
    expect(image.quality(80).buildUrl()).toContain('quality(80)');
  });

  it('Works with many filters', () => {
    const result = image
      .quality(80)
      .autoJpg()
      .format('webp')
      .buildUrl();
    expect(result).toContain('quality(80)');
    expect(result).toContain('format(webp)');
    expect(result).toContain('autoJpg()');
  });

  it('Works with security keys', () => {
    const secure = new Thumbor(serverUrl, '1234567890123456');
    const secureImg = secure.setPath(imagePath);
    expect(secureImg.resize(30, 30).buildUrl()).toMatchSnapshot();
  });
});
