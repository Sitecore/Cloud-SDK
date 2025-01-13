import { ComparisonFacetFilter } from './comparison-facet-filter';
import { LogicalFacetFilter } from './logical-facet-filter';

describe('LogicalFacetFilter', () => {
  const mock = {
    toDTO: () => ({
      test: 'a'
    })
  } as any;

  it('should set the facet with filter object and logical filter (and case)', () => {
    const logicalFacetFilter = new LogicalFacetFilter('and', [mock]);

    expect(logicalFacetFilter.toDTO()).toEqual({
      filters: [
        {
          test: 'a'
        }
      ],
      type: 'and'
    });
  });

  it('should set the facet with filter object and logical filter (or case)', () => {
    const logicalFacetFilter = new LogicalFacetFilter('or', [mock]);

    expect(logicalFacetFilter.toDTO()).toEqual({
      filters: [
        {
          test: 'a'
        }
      ],
      type: 'or'
    });
  });

  it('should set the facet with filter object and logical filter with comparison filter', () => {
    const logicalFacetFilter = new LogicalFacetFilter('or', [new ComparisonFacetFilter('eq', 'test')]);

    expect(logicalFacetFilter.toDTO()).toEqual({
      filters: [
        {
          type: 'eq',
          value: 'test'
        }
      ],
      type: 'or'
    });
  });
});
