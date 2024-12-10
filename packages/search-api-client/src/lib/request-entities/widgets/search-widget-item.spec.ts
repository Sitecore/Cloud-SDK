import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import { ComparisonFacetFilter } from '../filters/facet/comparison-facet-filter';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import { LogicalFilter } from '../filters/logical-filter';
import type {
  FacetOptions,
  FacetOptionsDTO,
  SearchSortOptions,
  SearchSortOptionsDTO,
  SearchSuggestionOptions,
  SearchSuggestionOptionsDTO
} from './interfaces';
import { SearchWidgetItem } from './search-widget-item';
import * as utilsModule from './utils';

describe('search widget item class', () => {
  const validWidgetItem = {
    entity: 'test',
    widgetId: 'test'
  };

  describe('constructor', () => {
    it('should early return if passed an empty object', () => {
      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId, {});

      const result = widgetItem.toDTO();

      expect(result.search).toBeUndefined();
    });

    it('should set the facet when given only all value', () => {
      const expected = { all: true };
      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId, { facet: expected });

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given only types value', () => {
      const expected = { types: [{ name: 'test' }] };

      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId, {
        facet: { types: [{ name: 'test' }] }
      });

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given only max value', () => {
      const expected = { max: 50 };

      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId, { facet: expected });

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should be undefined if not set', () => {
      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });

    it('should remove the facet', () => {
      const expected: FacetOptionsDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'count',
          order: 'asc'
        },
        types: [{ name: 'test' }]
      };

      const data: FacetOptions = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'count',
          order: 'asc'
        },
        types: [{ name: 'test' }]
      };

      const widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId, { facet: data });
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);

      widgetItem.resetFacet();
      const result2 = widgetItem.toDTO();

      expect(result2.search?.facet).toBeUndefined();
    });
  });

  describe('set facet', () => {
    let widgetItem: SearchWidgetItem;

    beforeEach(() => {
      widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should set the facet when given a full valid value', () => {
      const expected: FacetOptionsDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test' }]
      };

      const data: FacetOptions = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test' }]
      };

      widgetItem.facet = data;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given a partial valid value', () => {
      const expected: FacetOptionsDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        }
      };

      const data: FacetOptions = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        }
      };

      widgetItem.facet = data;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and exclude property', () => {
      const expected: FacetOptionsDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ exclude: ['test'], name: 'test' }]
      };

      const data: FacetOptions = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ exclude: ['test'], name: 'test' }]
      };

      widgetItem.facet = data;

      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and max property in types array', () => {
      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ max: 1, name: 'test' }]
      };

      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ max: 1, name: 'test' }]
      };

      widgetItem.facet = data;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and keyphrase property in types array', () => {
      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ keyphrase: 'test', name: 'test' }]
      };

      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ keyphrase: 'test', name: 'test' }]
      };

      widgetItem.facet = data;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and minCount property in types array', () => {
      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ minCount: 1, name: 'test' }]
      };

      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ min_count: 1, name: 'test' }]
      };

      widgetItem.facet = data;
      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and sort property', () => {
      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test', sort: { name: 'text', order: 'asc' } }]
      };

      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test', sort: { name: 'text', order: 'asc' } }]
      };

      widgetItem.facet = data;
      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and filter property when array contains filters', () => {
      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [
          {
            filter: {
              type: 'and',
              values: [new ComparisonFacetFilter('eq', 'test1'), new ComparisonFacetFilter('lt', 'test2')]
            },
            name: 'type'
          }
        ]
      };
      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [
          {
            filter: {
              type: 'and',
              values: [
                { type: 'eq', value: 'test1' },
                { type: 'lt', value: 'test2' }
              ]
            },
            name: 'type'
          }
        ]
      };

      const isFacetFilterSpy = jest.spyOn(utilsModule, 'isFacetFilter').mockReturnValueOnce(true);

      widgetItem.facet = data;
      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
      expect(isFacetFilterSpy).toHaveBeenCalledTimes(1);
    });

    it('should set the facet with a valid types name and filter property when array contains strings', () => {
      const data: FacetOptions = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [
          {
            filter: {
              type: 'and',
              values: ['test1', 'test2']
            },
            name: 'type'
          }
        ]
      };
      const expected: FacetOptionsDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [
          {
            filter: {
              type: 'and',
              values: ['test1', 'test2']
            },
            name: 'type'
          }
        ]
      };

      const isFacetFilterSpy = jest.spyOn(utilsModule, 'isFacetFilter').mockReturnValueOnce(false);

      widgetItem.facet = data;
      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
      expect(isFacetFilterSpy).toHaveBeenCalledTimes(1);
      expect(isFacetFilterSpy).toHaveBeenCalledWith(['test1', 'test2']);
    });
  });

  describe('facet types validator', () => {
    it('should ignore if bypassed by typescript as null', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { types: null as any };
      }).not.toThrow(ErrorMessages.IV_0016);
    });

    it('should throw error if name is empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ name: '' }] } });
      }).toThrow(ErrorMessages.IV_0016);
    });

    it('should throw error if name contains spaces', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ name: 'test test' }] } });
      }).toThrow(ErrorMessages.IV_0016);
    });

    it('should not throw error if max is 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ max: 100, name: 'test' }] } });
      }).not.toThrow(ErrorMessages.IV_0017);
    });

    it('should not throw error if max is 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ max: 1, name: 'test' }] } });
      }).not.toThrow(ErrorMessages.IV_0017);
    });

    it('should throw error if max is an invalid number less than 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ max: 0, name: 'test' }] } });
      }).toThrow(ErrorMessages.IV_0017);
    });
    it('should throw error if max is an invalid number greater than 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ max: 101, name: 'test' }] } });
      }).toThrow(ErrorMessages.IV_0017);
    });

    it('it should not throw error if keyphrase is not empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ keyphrase: 'test', name: 'test' }] } });
      }).not.toThrow(ErrorMessages.IV_0018);
    });

    it('should throw error if keyphrase is empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ keyphrase: '', name: 'test' }] } });
      }).toThrow(ErrorMessages.IV_0018);
    });

    it('should not throw error if minCount is 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ minCount: 100, name: 'test' }] } });
      }).not.toThrow(ErrorMessages.IV_0019);
    });

    it('should not throw error if minCount is 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ minCount: 1, name: 'test' }] } });
      }).not.toThrow(ErrorMessages.IV_0019);
    });

    it('should throw error if minCount is an invalid number less than 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ minCount: 0, name: 'test' }] } });
      }).toThrow(ErrorMessages.IV_0019);
    });
    it('should throw error if minCount is an invalid number greater than 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { facet: { types: [{ minCount: 101, name: 'test' }] } });
      }).toThrow(ErrorMessages.IV_0019);
    });

    it('should throw error if sort.after property is empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', {
          facet: { types: [{ name: 'test', sort: { after: '', name: 'text', order: 'asc' } }] }
        });
      }).toThrow(ErrorMessages.IV_0020);
    });

    it('should throw error if sort.after property is not empty string but it has spaces', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', {
          facet: { types: [{ name: 'test', sort: { after: '  ', name: 'text', order: 'asc' } }] }
        });
      }).toThrow(ErrorMessages.IV_0020);
    });

    it('should throw error if sort.after property is valid but sort.name is not "text"', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', {
          facet: { types: [{ name: 'test', sort: { after: 'valid', name: 'count', order: 'asc' } }] }
        });
      }).toThrow(ErrorMessages.IV_0021);
    });

    it('should not throw error if sort.after is valid and sort.name is text', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', {
          facet: { types: [{ name: 'test', sort: { after: 'valid', name: 'text', order: 'asc' } }] }
        });
      }).not.toThrow();
    });
  });

  describe('max validator', () => {
    it('should throw error if max is less than 1', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { max: 0 };
      }).toThrow(ErrorMessages.IV_0014);
    });

    it('should throw error if max is greater than 100', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { max: 101 };
      }).toThrow(ErrorMessages.IV_0014);
    });

    it('should not throw error if max is 1', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { max: 1 };
      }).not.toThrow(ErrorMessages.IV_0014);
    });

    it('should not throw error if max is 100', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { max: 100 };
      }).not.toThrow(ErrorMessages.IV_0014);
    });
  });

  describe('Offset', () => {
    let widgetItem: SearchWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };

    beforeEach(() => {
      widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should set the offset when given a valid value', () => {
      const validOffset = [10, 0, 50];
      validOffset.forEach((offset) => {
        widgetItem.offset = offset;
        expect(widgetItem.toDTO().search?.offset).toEqual(offset);
      });

      validOffset.forEach((offset) => {
        expect(new SearchWidgetItem('test', 'test', { offset }).toDTO().search?.offset).toEqual(offset);
      });
    });

    it('should reflect the offset as undefined when it is reset or not set', () => {
      widgetItem.offset = undefined as unknown as number;
      expect(widgetItem.offset).toBeUndefined();
    });

    it('should throw an error if the offset is less than 0', () => {
      const invalidOffset = -1;
      expect(() => {
        widgetItem.offset = invalidOffset;
      }).toThrow(ErrorMessages.IV_0008);

      expect(() => {
        new SearchWidgetItem('test', 'test', { offset: invalidOffset });
      }).toThrow(ErrorMessages.IV_0008);
    });

    it('should set the offset when provided in constructor', () => {
      const uut = new SearchWidgetItem('test', 'test', { offset: 10 });

      expect(uut.toDTO().search?.offset).toBe(10);
    });

    it('should not set the offset when not provided in constructor', () => {
      const uut = new SearchWidgetItem('test', 'test', {});

      expect(uut.toDTO().search?.offset).toBeUndefined();
    });

    it('should reset the offset', () => {
      const uut = new SearchWidgetItem('test', 'test', { offset: 10 });

      expect(uut.toDTO().search?.offset).toBe(10);

      uut.resetOffset();

      expect(uut.toDTO().search?.offset).toBeUndefined();
    });
  });

  describe('Query', () => {
    let widgetItem: SearchWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };
    beforeEach(() => {
      widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    });

    describe('keyphrase constructor', () => {
      it('should set the keyphrase when provided in constructor', () => {
        const uut = new SearchWidgetItem('test', 'test', { query: { keyphrase: 'test' } });

        expect(uut.toDTO().search?.query?.keyphrase).toBe('test');
      });

      it('should not set the keyphrase when not provided in constructor', () => {
        const uut = new SearchWidgetItem('test', 'test');

        expect(uut.toDTO().search?.query).toBeUndefined();
      });
    });

    describe('keyphrase setter', () => {
      it('should set the keyphrase when a valid keyphrase is provided', () => {
        const validKeyphrase = 'Example Keyphrase';
        widgetItem.query = { keyphrase: validKeyphrase };
        expect(widgetItem.toDTO().search?.query?.keyphrase).toBe(validKeyphrase);
      });

      it('should throw an error if the keyphrase length is less than 1', () => {
        expect(() => {
          widgetItem.query = { keyphrase: '' };
        }).toThrow(ErrorMessages.IV_0009);
      });

      it('should throw an error if the keyphrase length is more than 100 characters', () => {
        const longKeyphrase = 'a'.repeat(101);
        expect(() => {
          widgetItem.query = { keyphrase: longKeyphrase };
        }).toThrow(ErrorMessages.IV_0009);
      });

      it('does not throw error for edge case length of 100', () => {
        expect(() => (widgetItem.query = { keyphrase: 'a'.repeat(100) })).not.toThrow();
      });

      it('does not throw error for edge case length of 1', () => {
        expect(() => (widgetItem.query = { keyphrase: 'a' })).not.toThrow();
      });

      it('keyphrase should return undefined if query is not defined', () => {
        expect(widgetItem['_query']?.keyphrase).toBeUndefined();
      });

      it('keyphrase should return actual keyphrase if query is defined', () => {
        widgetItem.query = {
          keyphrase: 'example keyphrase'
        };
        expect(widgetItem['_query']?.keyphrase).toBe('example keyphrase');
      });
    });

    describe('operator setter', () => {
      it('should set the operator when a valid operator is provided', () => {
        const validOperator = 'and';
        widgetItem.query = { keyphrase: 'test', operator: validOperator };
        expect(widgetItem['_query']?.operator).toBe(validOperator);
        expect(widgetItem['_query']?.keyphrase).toBe('test');
        expect(widgetItem.toDTO().search?.query?.operator).toBe(validOperator);
      });
    });

    describe('reset Query', () => {
      let widgetItem: SearchWidgetItem;
      const validWidgetItem = {
        entity: 'test',
        widgetId: 'test'
      };

      beforeEach(() => {
        widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
        widgetItem.query = { keyphrase: 'example', operator: 'and' };
      });
      it('resetSearchQuery should set the query property to undefined', () => {
        widgetItem.resetQuery();
        expect(widgetItem['_query']).toBeUndefined();
        expect(widgetItem.toDTO().search?.query).toBeUndefined();
      });
    });
  });

  describe('results data', () => {
    it('should set all the results properties when given a valid value', () => {
      const uut = new SearchWidgetItem('test', 'test', {
        content: { fields: ['test'] },
        filter: new LogicalFilter('not', new ComparisonFilter('test', 'eq', 'te')),
        groupBy: 'groupBy',
        limit: 10
      });

      expect(uut.toDTO()).toEqual({
        entity: 'test',
        rfk_id: 'test',
        search: {
          content: { fields: ['test'] },
          filter: { filter: { name: 'test', type: 'eq', value: 'te' }, type: 'not' },
          group_by: 'groupBy',
          limit: 10
        }
      });
    });
  });

  describe('Sort Testing Suite', () => {
    const invalidSort: SearchSortOptions = {
      choices: true,
      value: [
        {
          name: 'color'
        },
        {
          name: ' '
        }
      ]
    };
    const validSort: SearchSortOptions = {
      choices: true,
      value: [{ name: 'color', order: 'asc' }]
    };
    const expectedSort: SearchSortOptionsDTO = {
      choices: true,
      value: [{ name: 'color', order: 'asc' }]
    };

    describe('From Constructor', () => {
      it('should return valid sort if valid sort is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { sort: validSort });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual(expectedSort);
      });

      it('should set the sort property to undefined', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { sort: validSort });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual(expectedSort);
        searchWidgetItem.resetSort();
        const actualAfterReset = searchWidgetItem.toDTO();
        expect(actualAfterReset.search?.sort).toBeUndefined();
      });

      it('should return empty object if empty object is passed', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { sort: {} });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual({});
      });
      it('should return undefined if we pass undefined', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { sort: undefined });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toBeUndefined();
      });
      it('should throw an error if we pass invalid sort', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { sort: invalidSort });
        }).toThrow(ErrorMessages.IV_0026);
      });

      it('should not throw an error if we pass valid sort', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { sort: validSort });
        }).not.toThrow(ErrorMessages.IV_0026);
      });
      it('should be undefined if we do not pass sort options', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', {});
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toBeUndefined();
      });
      it.each([{}, validSort])('should not throw error with valid sort', (sort) => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { sort });
        }).not.toThrow();
      });
    });

    describe('From setter', () => {
      let searchWidgetItem: SearchWidgetItem;
      const invalidSort: SearchSortOptions = {
        choices: true,
        value: [
          {
            name: 'color'
          },
          {
            name: ''
          }
        ]
      };
      const validSort: SearchSortOptions = {
        choices: true,
        value: [{ name: 'color', order: 'asc' }]
      };
      const expectedSort: SearchSortOptionsDTO = {
        choices: true,
        value: [{ name: 'color', order: 'asc' }]
      };

      beforeEach(() => {
        searchWidgetItem = new SearchWidgetItem('test', 'test');
      });

      it('should return valid sort if valid sort is given', () => {
        searchWidgetItem.sort = validSort;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual(expectedSort);
      });

      it('should set the sort property to undefined', () => {
        searchWidgetItem.sort = validSort;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual(expectedSort);
        searchWidgetItem.resetSort();
        const actualAfterReset = searchWidgetItem.toDTO();
        expect(actualAfterReset.search?.sort).toBeUndefined();
      });

      it('should return empty object if empty object is passed', () => {
        searchWidgetItem.sort = {};
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toEqual({});
      });
      it('should return undefined if we pass undefined', () => {
        searchWidgetItem.sort = undefined as any;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.sort).toBeUndefined();
      });
      it('should throw an error if we pass invalid sort', () => {
        expect(() => {
          searchWidgetItem.sort = invalidSort;
        }).toThrow(ErrorMessages.IV_0026);
      });

      it.each([validSort, {}, undefined])('should not throw an error if we pass valid sort', () => {
        expect(() => {
          searchWidgetItem.sort = validSort;
        }).not.toThrow(ErrorMessages.IV_0026);
      });
    });
  });

  describe('Suggestion testing Suite', () => {
    const validSuggestion: ArrayOfAtLeastOne<SearchSuggestionOptions> = [
      {
        exclude: ['test', 'test2'],
        keyphraseFallback: true,
        max: 2,
        name: 'something'
      },
      {
        max: 5,
        name: 'something_else'
      }
    ];

    const expectedSuggestionDTO: SearchSuggestionOptionsDTO[] = [
      {
        exclude: ['test', 'test2'],
        keyphrase_fallback: true,
        max: 2,
        name: 'something'
      },
      {
        max: 5,
        name: 'something_else'
      }
    ];

    const invalidSuggestion1: ArrayOfAtLeastOne<SearchSuggestionOptions> = [
      {
        exclude: ['test', 'test2'],
        keyphraseFallback: true,
        max: 0,
        name: 'something'
      }
    ];

    const invalidSuggestion2: ArrayOfAtLeastOne<SearchSuggestionOptions> = [
      {
        exclude: ['test', 'test2'],
        keyphraseFallback: true,
        max: 1,
        name: 'something '
      }
    ];

    const invalidSuggestion3: ArrayOfAtLeastOne<SearchSuggestionOptions> = [
      {
        keyphraseFallback: true,
        max: 1,
        name: ' '
      }
    ];

    describe('From Constructor', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('should return valid suggestions if valid suggestion is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { suggestion: validSuggestion });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toEqual(expectedSuggestionDTO);
      });

      it('should return undefined suggestion in the DTO if no suggestion is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test');
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toBeUndefined();
      });

      it('should return undefined suggestion in the DTO if no suggestion is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test');
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toBeUndefined();
      });

      it('should not call the validateSuggestion if we do not pass suggestion', () => {
        const searchWidgetItemSpy = jest.spyOn(SearchWidgetItem.prototype as any, '_validateSuggestion');
        new SearchWidgetItem('test', 'test');
        expect(searchWidgetItemSpy).toHaveBeenCalledTimes(0);
      });

      it('should not throw an error if we pass empty object', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', {});
        }).not.toThrow();
      });

      it('should throw error if we pass invalid suggestion', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { suggestion: invalidSuggestion1 });
        }).toThrow(ErrorMessages.IV_0014);
        expect(() => {
          new SearchWidgetItem('test', 'test', { suggestion: invalidSuggestion2 });
        }).toThrow(ErrorMessages.IV_0016);
        expect(() => {
          new SearchWidgetItem('test', 'test', { suggestion: invalidSuggestion3 });
        }).toThrow(ErrorMessages.IV_0016);
      });

      it('should be undefined after the reset function is called', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { suggestion: validSuggestion });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toEqual(expectedSuggestionDTO);

        searchWidgetItem.resetSuggestion();
        const actualAfterReset = searchWidgetItem.toDTO();
        expect(actualAfterReset.search?.suggestion).toBeUndefined();
      });
    });

    describe('From Setter', () => {
      let searchWidgetItem: SearchWidgetItem;
      beforeEach(() => {
        searchWidgetItem = new SearchWidgetItem('test', 'test');
      });

      it('should return valid suggestions if valid suggestion is given', () => {
        searchWidgetItem.suggestion = validSuggestion;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toEqual(expectedSuggestionDTO);
      });

      it('should return undefined suggestion in the DTO if no suggestion is given', () => {
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toBeUndefined();
      });

      it('should throw error if we pass invalid suggestion', () => {
        expect(() => {
          searchWidgetItem.suggestion = invalidSuggestion1;
        }).toThrow(ErrorMessages.IV_0014);
        expect(() => {
          searchWidgetItem.suggestion = invalidSuggestion2;
        }).toThrow(ErrorMessages.IV_0016);
        expect(() => {
          searchWidgetItem.suggestion = invalidSuggestion3;
        }).toThrow(ErrorMessages.IV_0016);
      });

      it('should be undefined after the reset function is called', () => {
        searchWidgetItem.suggestion = validSuggestion;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.suggestion).toEqual(expectedSuggestionDTO);

        searchWidgetItem.resetSuggestion();
        const actualAfterReset = searchWidgetItem.toDTO();
        expect(actualAfterReset.search?.suggestion).toBeUndefined();
      });
    });
  });

  describe('SearchWidgetItem getters', () => {
    it('should get all properties', () => {
      const query = { keyphrase: 'test' };
      const offset = 10;
      const facet = { all: true };
      const sort: SearchSortOptions = { choices: true, value: [{ name: 'test' }] };
      const suggestion: ArrayOfAtLeastOne<SearchSuggestionOptions> = [{ name: 'test' }];

      const widgetItem = new SearchWidgetItem('content', 'rfkid_qa', {
        facet,
        offset,
        query,
        sort,
        suggestion
      });

      expect(widgetItem.query).toEqual(query);
      expect(widgetItem.offset).toBe(offset);
      expect(widgetItem.facet).toEqual(facet);
      expect(widgetItem.sort).toEqual(sort);
      expect(widgetItem.suggestion).toEqual(suggestion);
    });
  });
});
