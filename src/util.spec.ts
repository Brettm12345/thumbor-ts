import { allGt0 } from './util'

describe('All greater than 0', () => {
  it('Returns true when all numbers are greater than 0', () => {
    const result = allGt0(5, 10, 34, 50, 123, 52);
    expect(result).toBe(true);
  });
  it('Returns false when some numbers are less than 0', () => {
    const result = allGt0(5, 10, 34, 50, -123, 52, -20, 30);
    expect(result).toBe(false);
  });
});
