import { ListFacetFilter } from './list-facet-filter';

describe('ListFacetFilter', () => {
  describe('FilterAllOf', () => {
    it('should generate the filter properly', () => {
      const filterAllOf = new ListFacetFilter('allOf', ['title1', 'title2']);
      expect(filterAllOf.toDTO()).toEqual({
        type: 'allOf',
        values: ['title1', 'title2']
      });
    });
  });

  describe('FilterAnyOf', () => {
    it('should generate the filter properly', () => {
      const filterAnyOf = new ListFacetFilter('anyOf', ['title1', 'title2']);
      expect(filterAnyOf.toDTO()).toEqual({
        type: 'anyOf',
        values: ['title1', 'title2']
      });
    });
  });
});
