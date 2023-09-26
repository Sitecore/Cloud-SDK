import { getPointOfSale } from './get-point-of-sale';

describe('getPointOfSale', () => {
  it('should throw error if pointOfSale is undefined', () => {
    const pointOfSale = undefined;
    const pointOfSaleError = `[MV-0003] "pointOfSale" is required.`;
    expect(() => getPointOfSale(pointOfSale)).toThrowError(pointOfSaleError);
  });

  it('should throw error if pointOfSale is empty string', () => {
    const pointOfSale = '';
    const pointOfSaleError = `[MV-0003] "pointOfSale" is required.`;
    expect(() => getPointOfSale(pointOfSale)).toThrowError(pointOfSaleError);
  });

  it('should throw error if pointOfSale is empty space string', () => {
    const pointOfSale = ' ';
    const pointOfSaleError = `[MV-0003] "pointOfSale" is required.`;
    expect(() => getPointOfSale(pointOfSale)).toThrowError(pointOfSaleError);
  });

  it('should return the given pointOfSale value', () => {
    const pointOfSale = 'spinair.com';
    expect(getPointOfSale(pointOfSale)).toBe('spinair.com');
  });
});
