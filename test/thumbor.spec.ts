import Thumbor from '../src';

describe('thumbor', () => {
  const serverUrl = 'http://localhost';
  const unsafeUrl = `${serverUrl}/unsafe`;
  const imagePath = 'react-day-picker.png';
  const thumbor = Thumbor({ serverUrl });
  const image = thumbor.setPath(imagePath);

  it('Generates urls', () => {
    expect(image.buildUrl()).toBe(`${unsafeUrl}/${imagePath}`);
  });

  it('Should fail with no url set', () => {
    expect(thumbor.buildUrl()).toEqual(
      'Error building url. No path set'
    );
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
    const url = image
      .quality(80)
      .autoJpg()
      .format('webp')
      .buildUrl();
    ['quality(80)', 'format(webp)', 'autoJpg()'].forEach(
      expect(url).toContain
    );
  });

  it('Works with security keys', () => {
    const secureThumbor = Thumbor({
      serverUrl,
      securityKey: '12345'
    });
    expect(
      secureThumbor
        .setPath(imagePath)
        .resize(30, 30)
        .buildUrl()
    ).toMatchSnapshot();
  });
});
