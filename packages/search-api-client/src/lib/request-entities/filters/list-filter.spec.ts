import { ListFilter } from './list-filter';

describe('ListFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('FilterAnyOf', () => {
    it('should generate the filter properly', () => {
      const filterAnyOf = new ListFilter('type', 'anyOf', ['a', 'b', 'c']);
      expect(filterAnyOf.toDTO()).toEqual({
        name: 'type',
        type: 'anyOf',
        values: ['a', 'b', 'c']
      });
    });
  });

  describe('FilterAllOf', () => {
    it('should generate the filter properly', () => {
      const filterAllOf = new ListFilter('type', 'allOf', ['one', 'two', 'three']);
      expect(filterAllOf.toDTO()).toEqual({
        name: 'type',
        type: 'allOf',
        values: ['one', 'two', 'three']
      });
    });
  });
});
