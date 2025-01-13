import { ComparisonFacetFilter } from './comparison-facet-filter';
import { LogicalFacetFilter } from './logical-facet-filter';
import { NotFacetFilter } from './not-facet-filter';

describe('NotFacetFilter', () => {
  it('should generate the filter properly when value is a string', () => {
    const notFacetFilter = new NotFacetFilter('facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoicHJvZHVjdCIsInZhbHVlIjoiQ0RQIn0=');
    expect(notFacetFilter.toDTO()).toEqual({
      filter: 'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoicHJvZHVjdCIsInZhbHVlIjoiQ0RQIn0=',
      type: 'not'
    });
  });

  it('should generate the filter properly when value is a ComparisonFacetFilter object', () => {
    const comparisonFacetFilter = new ComparisonFacetFilter('eq', 'test');
    const notFacetFilter = new NotFacetFilter(comparisonFacetFilter);
    expect(notFacetFilter.toDTO()).toEqual({
      filter: {
        type: 'eq',
        value: 'test'
      },
      type: 'not'
    });
  });

  it('should generate the filter properly when value is another NotFacetFilter object', () => {
    const innerNotFacetFilter = new NotFacetFilter(
      'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoicHJvZHVjdCIsInZhbHVlIjoiQ0RQIn0='
    );
    const outerNotFacetFilter = new NotFacetFilter(innerNotFacetFilter);
    expect(outerNotFacetFilter.toDTO()).toEqual({
      filter: {
        filter: 'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoicHJvZHVjdCIsInZhbHVlIjoiQ0RQIn0=',
        type: 'not'
      },
      type: 'not'
    });
  });

  it('should generate the filter properly when value is a LogicalFacetFilter object with "and" operator', () => {
    const logicalFacetFilter = new LogicalFacetFilter('and', [new ComparisonFacetFilter('eq', 'test')]);
    const notFacetFilter = new NotFacetFilter(logicalFacetFilter);
    expect(notFacetFilter.toDTO()).toEqual({
      filter: {
        filters: [
          {
            type: 'eq',
            value: 'test'
          }
        ],
        type: 'and'
      },
      type: 'not'
    });
  });

  it('should generate the filter properly when value is a LogicalFacetFilter object with "or" operator', () => {
    const logicalFacetFilter = new LogicalFacetFilter('or', [new ComparisonFacetFilter('eq', 'test')]);
    const notFacetFilter = new NotFacetFilter(logicalFacetFilter);
    expect(notFacetFilter.toDTO()).toEqual({
      filter: {
        filters: [
          {
            type: 'eq',
            value: 'test'
          }
        ],
        type: 'or'
      },
      type: 'not'
    });
  });
});
