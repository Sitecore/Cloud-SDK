import { ComparisonFacetFilter } from './comparison-facet-filter';

describe('ComparisonFacetFilter', () => {
  describe('FilterEqual', () => {
    it('should generate the filter properly', () => {
      const filterEqual = new ComparisonFacetFilter('eq', 'title1');
      expect(filterEqual.toDTO()).toEqual({
        type: 'eq',
        value: 'title1'
      });
    });
  });

  describe('FilterGreaterOrEqualThan', () => {
    it('should generate the filter properly', () => {
      const filterGreaterOrEqualThan = new ComparisonFacetFilter('gte', 'test');
      expect(filterGreaterOrEqualThan.toDTO()).toEqual({
        type: 'gte',
        value: 'test'
      });
    });
  });

  describe('FilterLessOrEqualThan', () => {
    it('should generate the filter properly', () => {
      const filterLessOrEqualThan = new ComparisonFacetFilter('lte', 'test');
      expect(filterLessOrEqualThan.toDTO()).toEqual({
        type: 'lte',
        value: 'test'
      });
    });
  });

  describe('FilterLessThan', () => {
    it('should generate the filter properly', () => {
      const filterLessThan = new ComparisonFacetFilter('lt', 'test');
      expect(filterLessThan.toDTO()).toEqual({
        type: 'lt',
        value: 'test'
      });
    });
  });

  describe('FilterGreaterThan', () => {
    it('should generate the filter properly', () => {
      const filterGreaterThan = new ComparisonFacetFilter('gt', 'test');
      expect(filterGreaterThan.toDTO()).toEqual({
        type: 'gt',
        value: 'test'
      });
    });
  });
});
