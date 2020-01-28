import Thumbor from '../src';

describe('thumbor', () => {
  const serverUrl = 'http://localhost';
  const unsafeUrl = `${serverUrl}/unsafe`;
  const imagePath = 'react-day-picker.png';
  const image = Thumbor({ serverUrl, imagePath });

  it('Generates urls', () => {
    expect(image.buildUrl()).toBe(`${unsafeUrl}/${imagePath}`);
  });

  it('Removes duplicates', () => {
    expect(
      image
        .grayscale()
        .grayscale()
        .grayscale()
        .buildUrl()
    ).toBe(`${unsafeUrl}/filters:grayscale()/${imagePath}`);
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
    ['quality(80)', 'format(webp)', 'autoJpg()'].forEach(
      expect(
        image
          .quality(80)
          .autoJpg()
          .format('webp')
          .buildUrl()
      ).toContain
    );
  });

  it('Works with security keys', () => {
    expect(
      image
        .setSecurityKey('12345')
        .resize(30, 30)
        .buildUrl()
    ).toMatchSnapshot();
  });
});
