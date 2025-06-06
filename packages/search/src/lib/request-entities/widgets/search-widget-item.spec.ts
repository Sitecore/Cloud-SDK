import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import { ComparisonFacetFilter } from '../filters/facet/comparison-facet-filter';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import { LogicalFilter } from '../filters/logical-filter';
import type {
  FacetOptions,
  FacetOptionsDTO,
  SearchPersonalizationOptions,
  SearchPersonalizationOptionsDto,
  SearchRankingOptions,
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

    it('should set the facet with a valid types name and filterOptions property', () => {
      const variants = [
        {
          dto: ['hard_filters', 'other_facet_values'],
          filteringOptions: 'Dynamic OR'
        },
        {
          dto: ['hard_filters', 'other_facet_values', 'own_values'],
          filteringOptions: 'Dynamic AND'
        },
        {
          dto: ['hard_filters'],
          filteringOptions: 'Static'
        }
      ];

      variants.forEach((variant) => {
        const data: FacetOptions = {
          types: [
            {
              filteringOptions: variant.filteringOptions as any,
              name: 'type'
            }
          ]
        };
        const expected: FacetOptionsDTO = {
          types: [
            {
              filtering_options: variant.dto as any,
              name: 'type'
            }
          ]
        };

        widgetItem.facet = data;

        const result = widgetItem.toDTO();

        expect(result.search?.facet).toEqual(expected);
      });
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
        content: { attributes: ['test'] },
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

  describe('Personalization Testing Suite', () => {
    const validPersonalization1: SearchPersonalizationOptions = {
      algorithm: 'affinity',
      attributes: ['somefield']
    };

    const validPersonalization1Result: SearchPersonalizationOptionsDto = {
      algorithm: 'affinity',
      fields: ['somefield']
    };

    const validPersonalization2: SearchPersonalizationOptions = {
      algorithm: 'mlt',
      attributes: ['somefield'],
      ids: ['someid']
    };

    const validPersonalization2Result: SearchPersonalizationOptionsDto = {
      algorithm: 'mlt',
      fields: ['somefield'],
      ids: ['someid']
    };
    const validPersonalization3: SearchPersonalizationOptions = {
      algorithm: 'mlt',
      attributes: ['somefield'],
      ids: ['someid']
    };

    const validPersonalization3Result: SearchPersonalizationOptionsDto = {
      algorithm: 'mlt',
      fields: ['somefield'],
      ids: ['someid']
    };

    const invalidPersonalization1: SearchPersonalizationOptions = {
      algorithm: 'mlt',
      attributes: ['somefield', ''],
      ids: ['someid']
    };

    const invalidPersonalization2: SearchPersonalizationOptions = {
      algorithm: 'mlt',
      attributes: ['somefield', ' '],
      ids: ['someid']
    };
    const invalidPersonalization3: SearchPersonalizationOptions = {
      algorithm: 'mlt',
      attributes: ['somefield'],
      ids: ['']
    };

    describe('from constructor', () => {
      it('should return valid personalization if valid personalization is given', () => {
        const searchWidgetItem1 = new SearchWidgetItem('test', 'test', { personalization: validPersonalization1 });
        const actual1 = searchWidgetItem1.toDTO();

        expect(actual1.search?.personalization).toEqual(validPersonalization1Result);

        const searchWidgetItem2 = new SearchWidgetItem('test', 'test', { personalization: validPersonalization2 });
        const actual2 = searchWidgetItem2.toDTO();
        expect(actual2.search?.personalization).toEqual(validPersonalization2Result);

        const searchWidgetItem3 = new SearchWidgetItem('test', 'test', { personalization: validPersonalization3 });
        const actual3 = searchWidgetItem3.toDTO();
        expect(actual3.search?.personalization).toEqual(validPersonalization3Result);
      });
      it('should not throw error when valid personalization is given', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: validPersonalization1 });
        }).not.toThrow();
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: validPersonalization2 });
        }).not.toThrow();
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: validPersonalization3 });
        }).not.toThrow();
      });
      it('should return undefined if no personalization is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', {});
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.personalization).toBeUndefined();
      });
      it('should return undefined if undefined personalization is passed', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { personalization: undefined });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.personalization).toBeUndefined();
      });
      it('should throw error when invalid personalization is given', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: invalidPersonalization1 });
        }).toThrow(ErrorMessages.IV_0030);
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: invalidPersonalization2 });
        }).toThrow(ErrorMessages.IV_0030);
        expect(() => {
          new SearchWidgetItem('test', 'test', { personalization: invalidPersonalization3 });
        }).toThrow(ErrorMessages.IV_0031);
      });
      it('should reset personalization property', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { personalization: validPersonalization1 });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.personalization).toEqual(validPersonalization1Result);
        searchWidgetItem.resetPersonalization();
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.personalization).toBeUndefined();
      });
    });

    describe('from setter', () => {
      let searchWidgetItem: SearchWidgetItem;

      beforeEach(() => {
        searchWidgetItem = new SearchWidgetItem('test', 'test');
      });

      it('should return valid personalization if valid personalization is given', () => {
        searchWidgetItem.personalization = validPersonalization1;
        const actual1 = searchWidgetItem.toDTO();
        expect(actual1.search?.personalization).toEqual(validPersonalization1Result);

        searchWidgetItem.personalization = validPersonalization2;
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.personalization).toEqual(validPersonalization2Result);

        searchWidgetItem.personalization = validPersonalization3;
        const actual3 = searchWidgetItem.toDTO();
        expect(actual3.search?.personalization).toEqual(validPersonalization3Result);
      });
      it('should not throw error when valid personalization is given', () => {
        expect(() => {
          searchWidgetItem.personalization = validPersonalization1;
        }).not.toThrow();
        expect(() => {
          searchWidgetItem.personalization = validPersonalization2;
        }).not.toThrow();
        expect(() => {
          searchWidgetItem.personalization = validPersonalization3;
        }).not.toThrow();
      });

      it('should throw error when invalid personalization is given', () => {
        expect(() => {
          searchWidgetItem.personalization = invalidPersonalization1;
        }).toThrow(ErrorMessages.IV_0030);
        expect(() => {
          searchWidgetItem.personalization = invalidPersonalization2;
        }).toThrow(ErrorMessages.IV_0030);
        expect(() => {
          searchWidgetItem.personalization = invalidPersonalization3;
        }).toThrow(ErrorMessages.IV_0031);
      });
      it('should reset personalization property', () => {
        searchWidgetItem.personalization = validPersonalization1;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.personalization).toEqual(validPersonalization1Result);
        searchWidgetItem.resetPersonalization();
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.personalization).toBeUndefined();
      });
    });
  });

  describe('Ranking Testing Suite', () => {
    const validRanking1: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename',
        weight: 1.3
      }
    ];
    const validRanking2: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename'
      }
    ];
    const validRanking3: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename',
        weight: 0.1
      }
    ];
    const validRanking4: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename',
        weight: 100
      }
    ];

    const invalidRanking1: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: ''
      }
    ];
    const invalidRanking2: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename',
        weight: 111
      }
    ];

    const invalidRanking3: ArrayOfAtLeastOne<SearchRankingOptions> = [
      {
        name: 'somename',
        weight: 0
      }
    ];

    describe('from constructor', () => {
      it('should return valid ranking if valid ranking is given', () => {
        const searchWidgetItem1 = new SearchWidgetItem('test', 'test', { ranking: validRanking1 });
        const actual1 = searchWidgetItem1.toDTO();
        expect(actual1.search?.ranking).toEqual(validRanking1);

        const searchWidgetItem2 = new SearchWidgetItem('test', 'test', { ranking: validRanking2 });
        const actual2 = searchWidgetItem2.toDTO();
        expect(actual2.search?.ranking).toEqual(validRanking2);
      });
      it('should not throw error when valid ranking is given', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: validRanking1 });
        }).not.toThrow();
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: validRanking2 });
        }).not.toThrow();
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: validRanking3 });
        }).not.toThrow();
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: validRanking4 });
        }).not.toThrow();
      });
      it('should return undefined if no ranking is given', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', {});
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.ranking).toBeUndefined();
      });
      it('should return undefined if undefined ranking is passed', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { ranking: undefined });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.ranking).toBeUndefined();
      });
      it('should throw error when invalid ranking is given', () => {
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: invalidRanking1 });
        }).toThrow(ErrorMessages.IV_0016);
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: invalidRanking2 });
        }).toThrow(ErrorMessages.IV_0029);
        expect(() => {
          new SearchWidgetItem('test', 'test', { ranking: invalidRanking3 });
        }).toThrow(ErrorMessages.IV_0029);
      });
      it('should reset ranking property', () => {
        const searchWidgetItem = new SearchWidgetItem('test', 'test', { ranking: validRanking1 });
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.ranking).toEqual(validRanking1);
        searchWidgetItem.resetRanking();
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.ranking).toBeUndefined();
      });
    });

    describe('from setter', () => {
      let searchWidgetItem: SearchWidgetItem;

      beforeEach(() => {
        searchWidgetItem = new SearchWidgetItem('test', 'test');
      });

      it('should return valid ranking if valid ranking is given', () => {
        searchWidgetItem.ranking = validRanking1;
        const actual1 = searchWidgetItem.toDTO();
        expect(actual1.search?.ranking).toEqual(validRanking1);

        searchWidgetItem.ranking = validRanking2;
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.ranking).toEqual(validRanking2);

        searchWidgetItem.ranking = validRanking3;
        const actual3 = searchWidgetItem.toDTO();
        expect(actual3.search?.ranking).toEqual(validRanking3);
      });
      it('should not throw error when valid ranking is given', () => {
        expect(() => {
          searchWidgetItem.ranking = validRanking1;
        }).not.toThrow();
      });

      it('should throw error when invalid ranking is given', () => {
        expect(() => {
          searchWidgetItem.ranking = invalidRanking1;
        }).toThrow(ErrorMessages.IV_0016);
        expect(() => {
          searchWidgetItem.ranking = invalidRanking2;
        }).toThrow(ErrorMessages.IV_0029);
        expect(() => {
          searchWidgetItem.ranking = invalidRanking3;
        }).toThrow(ErrorMessages.IV_0029);
      });
      it('should reset ranking property', () => {
        searchWidgetItem.ranking = validRanking1;
        const actual = searchWidgetItem.toDTO();
        expect(actual.search?.ranking).toEqual(validRanking1);
        searchWidgetItem.resetRanking();
        const actual2 = searchWidgetItem.toDTO();
        expect(actual2.search?.ranking).toBeUndefined();
      });
    });
  });

  describe('DisableGrouping', () => {
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

    it('should set the disableGrouping when given valid values', () => {
      widgetItem.disableGrouping = true;

      expect(
        new SearchWidgetItem('test', 'test', { disableGrouping: widgetItem.disableGrouping }).toDTO().search
          ?.disable_grouping
      ).toEqual(true);

      widgetItem.disableGrouping = false;

      expect(
        new SearchWidgetItem('test', 'test', { disableGrouping: widgetItem.disableGrouping }).toDTO().search
          ?.disable_grouping
      ).toEqual(false);
    });

    it('should reflect the disableGrouping as undefined when not set', () => {
      widgetItem.disableGrouping = undefined as unknown as boolean;
      expect(widgetItem.disableGrouping).toBe(undefined);
    });

    it('should reflect the disable_grouping (DTO) as undefined when not set', () => {
      expect(widgetItem.toDTO().search?.disable_grouping).toBe(undefined);
    });

    it('should set the disableGrouping when provided in constructor', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', { disableGrouping: true });

      expect(widgetItem.toDTO().search?.disable_grouping).toBe(true);
    });

    it('should reset the disableGrouping', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', { disableGrouping: true });

      expect(widgetItem.toDTO().search?.disable_grouping).toBe(true);

      widgetItem.resetDisableGrouping();

      expect(widgetItem.toDTO().search?.disable_grouping).toBeUndefined();
    });
  });

  describe('ResponseContext', () => {
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

    it('should set the responseContext when given valid values', () => {
      widgetItem.responseContext = true;

      expect(
        new SearchWidgetItem('test', 'test', { responseContext: widgetItem.responseContext }).toDTO().search
          ?.response_context
      ).toEqual({});

      widgetItem.responseContext = false;

      expect(
        new SearchWidgetItem('test', 'test', { responseContext: widgetItem.responseContext }).toDTO().search
          ?.response_context
      ).toBeUndefined();
    });

    it('should reflect the responseContext as undefined when not set', () => {
      widgetItem.responseContext = undefined as unknown as boolean;
      expect(widgetItem.responseContext).toBe(undefined);
    });

    it('should reflect the response_context (DTO) as undefined when not set', () => {
      expect(widgetItem.toDTO().search?.response_context).toBe(undefined);
    });

    it('should set the responseContext when provided in constructor', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', { responseContext: true });

      expect(widgetItem.toDTO().search?.response_context).toEqual({});
    });

    it('should not include response_context in DTO when responseContext is false', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', { responseContext: false });

      expect(widgetItem.toDTO().search?.response_context).toBeUndefined();
    });

    it('should reset the responseContext', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', { responseContext: true });

      expect(widgetItem.toDTO().search?.response_context).toEqual({});

      widgetItem.resetResponseContext();

      expect(widgetItem.toDTO().search?.response_context).toBeUndefined();
    });

    it('should update responseContext when changed via setter', () => {
      const widgetItem = new SearchWidgetItem('test', 'test');

      // Initially undefined
      expect(widgetItem.responseContext).toBeUndefined();
      expect(widgetItem.toDTO().search?.response_context).toBeUndefined();

      // Set to true
      widgetItem.responseContext = true;
      expect(widgetItem.responseContext).toBe(true);
      expect(widgetItem.toDTO().search?.response_context).toEqual({});

      // Set to false
      widgetItem.responseContext = false;
      expect(widgetItem.responseContext).toBe(false);
      expect(widgetItem.toDTO().search?.response_context).toBeUndefined();
    });

    it('should work correctly with other search options', () => {
      const widgetItem = new SearchWidgetItem('test', 'test', {
        offset: 10,
        query: { keyphrase: 'test query' },
        responseContext: true
      });

      const dto = widgetItem.toDTO();

      expect(dto.search?.response_context).toEqual({});
      expect(dto.search?.query).toEqual({ keyphrase: 'test query' });
      expect(dto.search?.offset).toBe(10);
    });
  });

  describe('SearchWidgetItem getters', () => {
    it('should get all properties', () => {
      const query = { keyphrase: 'test' };
      const offset = 10;
      const facet = { all: true };
      const personalization: SearchPersonalizationOptions = {
        algorithm: 'mlt',
        attributes: ['color'],
        ids: ['someid']
      };
      const ranking: ArrayOfAtLeastOne<SearchRankingOptions> = [
        {
          name: 'somename',
          weight: 1.0
        }
      ];
      const sort: SearchSortOptions = { choices: true, value: [{ name: 'test' }] };
      const suggestion: ArrayOfAtLeastOne<SearchSuggestionOptions> = [{ name: 'test' }];
      const disableGrouping = true;
      const responseContext = true;

      const widgetItem = new SearchWidgetItem('content', 'rfkid_qa', {
        disableGrouping,
        facet,
        offset,
        personalization,
        query,
        ranking,
        responseContext,
        sort,
        suggestion
      });

      expect(widgetItem.query).toEqual(query);
      expect(widgetItem.offset).toBe(offset);
      expect(widgetItem.facet).toEqual(facet);
      expect(widgetItem.personalization).toEqual(personalization);
      expect(widgetItem.ranking).toEqual(ranking);
      expect(widgetItem.sort).toEqual(sort);
      expect(widgetItem.suggestion).toEqual(suggestion);
      expect(widgetItem.disableGrouping).toEqual(disableGrouping);
      expect(widgetItem.responseContext).toEqual(responseContext);
    });
  });
});
