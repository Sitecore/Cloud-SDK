import { isFacetFilter } from './utils';

describe('isFacetFilter', () => {
  it('should return false when filters are strings', () => {
    const filters = ['filter1', 'filter2'] as any;

    expect(isFacetFilter(filters)).toBe(false);
  });

  it('should return true when filters are facet filters', () => {
    const filters = [
      { field: 'field1', value: 'value1' },
      { field: 'field2', value: 'value2' }
    ] as any;

    expect(isFacetFilter(filters)).toBe(true);
  });
});
