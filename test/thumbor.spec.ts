import Thumbor from '../src';

describe('thumbor', () => {
  const image = Thumbor({
    serverUrl: 'https://thumbor',
    imagePath: 'example.png'
  });

  it('Generates urls', () => {
    expect(image.buildUrl()).toMatchSnapshot();
  });

  it('Removes duplicates', () => {
    expect(
      image
        .grayscale()
        .grayscale()
        .grayscale()
        .buildUrl()
    ).toMatchSnapshot();
  });

  it('Works with resize', () => {
    expect(image.resize(30, 30).buildUrl()).toMatchSnapshot();
  });

  it('Works with crop', () => {
    expect(image.crop(10, 10, 30, 30).buildUrl()).toMatchSnapshot();
  });

  it('Properly flips images', () => {
    expect(
      image.resize(30, 30, true, true).buildUrl()
    ).toMatchSnapshot();
  });

  it('Works with filter', () => {
    expect(image.quality(80).buildUrl()).toMatchSnapshot();
  });

  it('Works with many filters', () => {
    expect(
      image
        .quality(80)
        .autoJpg()
        .format('webp')
        .buildUrl()
    ).toMatchSnapshot();
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
