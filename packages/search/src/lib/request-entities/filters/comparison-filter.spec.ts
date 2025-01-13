import { ComparisonFilter } from './comparison-filter';

describe('ComparisonFilter', () => {
  describe('FilterEqual', () => {
    it('should generate the filter properly', () => {
      const filterEqual = new ComparisonFilter('title', 'eq', 'title1');
      expect(filterEqual.toDTO()).toEqual({
        name: 'title',
        type: 'eq',
        value: 'title1'
      });
    });
  });

  describe('FilterGreaterOrEqualThan', () => {
    it('should generate the filter properly', () => {
      const filterGreaterOrEqualThan = new ComparisonFilter('title', 'gte', 5);
      expect(filterGreaterOrEqualThan.toDTO()).toEqual({
        name: 'title',
        type: 'gte',
        value: 5
      });
    });
  });

  describe('FilterLessOrEqualThan', () => {
    it('should generate the filter properly', () => {
      const filterLessOrEqualThan = new ComparisonFilter('title', 'lte', 5);
      expect(filterLessOrEqualThan.toDTO()).toEqual({
        name: 'title',
        type: 'lte',
        value: 5
      });
    });
  });

  describe('FilterLessThan', () => {
    it('should generate the filter properly', () => {
      const filterLessThan = new ComparisonFilter('title', 'lt', 5);
      expect(filterLessThan.toDTO()).toEqual({
        name: 'title',
        type: 'lt',
        value: 5
      });
    });
  });

  describe('FilterGreaterThan', () => {
    it('should generate the filter properly', () => {
      const filterGreaterThan = new ComparisonFilter('title', 'gt', 5);
      expect(filterGreaterThan.toDTO()).toEqual({
        name: 'title',
        type: 'gt',
        value: 5
      });
    });
  });
});
