import { ComparisonFilter } from './comparison-filter';
import { LogicalFilter } from './logical-filter';

describe('LogicalFilter', () => {
  const comparisonFilter = new ComparisonFilter('price', 'lt', 100);
  const comparisonFilter2 = new ComparisonFilter('price', 'gt', 50);
  describe('filter and', () => {
    it('should generate the filter properly', () => {
      const logicalFilter = new LogicalFilter('and', [comparisonFilter, comparisonFilter2]);
      expect(logicalFilter.toDTO()).toEqual({
        filters: [
          { name: 'price', type: 'lt', value: 100 },
          { name: 'price', type: 'gt', value: 50 }
        ],
        type: 'and'
      });
    });
  });

  describe('filter or', () => {
    it('should generate the filter properly', () => {
      const logicalFilter = new LogicalFilter('or', [comparisonFilter, comparisonFilter2]);
      const result = logicalFilter.toDTO();

      expect(result).toEqual({
        filters: [
          { name: 'price', type: 'lt', value: 100 },
          { name: 'price', type: 'gt', value: 50 }
        ],
        type: 'or'
      });
    });
  });

  describe('filter not', () => {
    it('should generate the filter properly', () => {
      const logicalFilter = new LogicalFilter('or', [comparisonFilter, comparisonFilter2]);
      const logicalNotFilter = new LogicalFilter('not', logicalFilter);

      expect(logicalNotFilter.toDTO()).toEqual({
        filter: {
          filters: [
            { name: 'price', type: 'lt', value: 100 },
            { name: 'price', type: 'gt', value: 50 }
          ],
          type: 'or'
        },
        type: 'not'
      });
    });
  });
});
