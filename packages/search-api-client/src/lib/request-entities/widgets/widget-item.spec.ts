import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import { WidgetItem } from './widget-item';

describe('widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test'
  };
  const mockFilter = {
    toDTO: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validator', () => {
    it(`should not throw an error if all properties are correct`, () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      expect(() => new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId)).not.toThrow();
    });
    it(`should throw an error if the 'entity' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: '',
        rfkId: 'test'
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0010);
    });

    it(`should throw an error if the 'rfkId' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: ''
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0011);
    });

    it(`should throw an error if the 'entity' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: '   ',
        rfkId: 'test'
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0010);
    });

    it(`should throw an error if the 'rfkId' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: '   '
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0011);
    });
  });
  describe('mapper', () => {
    it('should return the original widget item mapped', () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      const result = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId).toDTO();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('set offset', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });
    it('should set the offset when given a valid value', () => {
      const validOffset = [10, 0, 50];
      validOffset.forEach((offset) => {
        widgetItem.offset = offset;
        expect(widgetItem['_search']?.offset).toBe(offset);
        expect(widgetItem).toBe(widgetItem);
        expect(widgetItem.toDTO()).toStrictEqual({
          ...expected,
          search: {
            filter: undefined,
            offset
          }
        });
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
    });

    it('should not set the offset if you do not provide one', () => {
      expect(widgetItem.offset).toBeUndefined();
      expect(widgetItem['_search']?.offset).toBeUndefined();
      expect(widgetItem).toBe(widgetItem);
      expect(widgetItem.toDTO()).toStrictEqual({
        ...expected
      });
    });
  });

  describe('set limit', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };
    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });
    it('should set the limit when given a valid value', () => {
      expect(widgetItem.limit).toBeUndefined();
      const validLimits = [1, 2, 50, 99, 100];
      validLimits.forEach((limit) => {
        widgetItem.limit = limit;

        expect(widgetItem['_search']?.limit).toBe(limit);
        expect(widgetItem).toBe(widgetItem);
        expect(widgetItem.toDTO()).toStrictEqual({
          ...expected,
          search: {
            filter: undefined,
            limit
          }
        });
      });
    });

    it('should reflect the limit as undefined when it is reset or not set', () => {
      widgetItem.limit = undefined as unknown as number;
      expect(widgetItem.limit).toBeUndefined();
    });

    it('should not set the limit if you do not provide one', () => {
      expect(widgetItem.limit).toBeUndefined();
      expect(widgetItem['_search']?.limit).toBeUndefined();
      expect(widgetItem).toBe(widgetItem);
      expect(widgetItem.toDTO()).toStrictEqual({
        ...expected
      });
    });

    it('should throw an error if the limit is less than 1 or greater than 100', () => {
      const invalidLimits = [0, 101];
      invalidLimits.forEach((limit) => {
        expect(() => {
          widgetItem.limit = limit;
        }).toThrow(ErrorMessages.IV_0007);
      });
    });
  });

  describe('set content', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };
    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });
    it('should set content to fields array when provided an array', () => {
      widgetItem.content = { fields: ['name', 'description'] };
      expect(widgetItem['_search']?.content).toEqual({ fields: ['name', 'description'] });
    });

    it('should set content to empty object when provided an empty object', () => {
      widgetItem.content = {};
      expect(widgetItem['_search']?.content).toStrictEqual({});
    });

    it('should overwrite previous content with empty object', () => {
      widgetItem.content = {};
      const fieldsArray: ArrayOfAtLeastOne<string> = ['name', 'description'];
      widgetItem.content = { fields: fieldsArray };
      expect(widgetItem['_search']?.content).toEqual({ fields: fieldsArray });
    });
  });

  describe('resetSearchContent', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };
    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
      widgetItem.content = { fields: ['item1', 'item2'] };
    });
    it('should reset the content if resetSearchContent is called', () => {
      widgetItem.resetSearchContent();
      expect(widgetItem['_search']).toStrictEqual({ content: undefined });
      expect(widgetItem['_search']?.content).toBeUndefined();
      expect(widgetItem.toDTO().search?.content).toEqual(undefined);
      expect(widgetItem.toDTO().search).toEqual(undefined);
    });
  });

  describe('set query', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };
    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    describe('keyphrase setter', () => {
      it('should set the keyphrase when a valid keyphrase is provided', () => {
        const validKeyphrase = 'Example Keyphrase';
        widgetItem.keyphrase = validKeyphrase;
        expect(widgetItem.toDTO().search?.query?.keyphrase).toBe(validKeyphrase);
      });

      it('should throw an error if the keyphrase length is less than 1', () => {
        expect(() => {
          widgetItem.keyphrase = '';
        }).toThrow(ErrorMessages.IV_0009);
      });

      it('should throw an error if the keyphrase length is more than 100 characters', () => {
        const longKeyphrase = 'a'.repeat(101);
        expect(() => {
          widgetItem.keyphrase = longKeyphrase;
        }).toThrow(ErrorMessages.IV_0009);
      });

      it('does not throw error for edge case length of 100', () => {
        expect(() => (widgetItem.keyphrase = 'a'.repeat(100))).not.toThrow();
      });

      it('does not throw error for edge case length of 1', () => {
        expect(() => (widgetItem.keyphrase = 'a')).not.toThrow();
      });

      it('keyphrase should return undefined if query is not defined', () => {
        expect(widgetItem.keyphrase).toBeUndefined();
      });

      it('keyphrase should handle missing query safely', () => {
        widgetItem['_search'] = {};
        expect(() => {
          widgetItem.keyphrase;
        }).not.toThrow();
        expect(widgetItem.keyphrase).toBeUndefined();
      });

      it('keyphrase should return actual keyphrase if query is defined', () => {
        widgetItem['_search'] = {
          query: {
            keyphrase: 'example keyphrase'
          }
        };
        expect(widgetItem['_search']?.query?.keyphrase).toBe('example keyphrase');
      });
    });

    describe('operator setter', () => {
      it('should set the operator when a valid operator is provided', () => {
        const validOperator = 'and';
        widgetItem.operator = validOperator;
        expect(widgetItem['_search']?.query?.operator).toBe(validOperator);
        expect(widgetItem['_search']?.query?.keyphrase).toBeUndefined();
        expect(widgetItem.toDTO().search?.query?.operator).toBe(validOperator);
      });

      it('should preserve the existing keyphrase when setting an operator', () => {
        const validKeyphrase = 'Valid Keyphrase';
        const validOperator = 'or';
        widgetItem.keyphrase = validKeyphrase;
        widgetItem.operator = validOperator;
        expect(widgetItem['_search']?.query).toEqual({
          keyphrase: validKeyphrase,
          operator: validOperator
        });
        expect(widgetItem.toDTO().search?.query).toEqual({
          keyphrase: validKeyphrase,
          operator: validOperator
        });
      });

      it('keyphrase should be undefined if you set an operator', () => {
        widgetItem['_search'] = {
          query: undefined
        };
        widgetItem.operator = 'or';
        expect(widgetItem['_search']?.query?.keyphrase).toBeUndefined();
      });
    });
  });

  describe('resetSearchQuery', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
      widgetItem.keyphrase = 'example';
      widgetItem.operator = 'and';
    });

    it('resetSearchQuery should set the query property to undefined', () => {
      widgetItem.resetSearchQuery();
      expect(widgetItem['_search']).toStrictEqual({ query: undefined });
      expect(widgetItem['_search']?.query).toBeUndefined();
      expect(widgetItem.toDTO().search?.query).toBeUndefined();
    });
  });

  describe('set group by', () => {
    let widgetItem: WidgetItem;

    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it(`should update the 'groupBy' search property`, () => {
      widgetItem.groupBy = 'initial';

      expect(widgetItem['_search']?.groupBy).toBe('initial');

      widgetItem.groupBy = 'type';

      expect(widgetItem.toDTO()).toEqual({
        ...expected,
        search: {
          filter: undefined,
          groupBy: 'type'
        }
      });

      const dto = widgetItem.toDTO();
      expect(JSON.stringify(dto.search)).toEqual('{"groupBy":"type"}');
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it(`should reflect the 'groupBy' as undefined when it is not set`, () => {
      widgetItem.groupBy = undefined as unknown as string;
      expect(widgetItem.groupBy).toBeUndefined();
    });
  });

  describe('filter', () => {
    let widgetItem: WidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    const comparisonFilter = new ComparisonFilter('price', 'lt', 100);
    beforeEach(() => {
      widgetItem = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it('should get the current filter', () => {
      const filterEqual = new ComparisonFilter('title', 'eq', 'title1');
      widgetItem.filter = filterEqual;
      const dto = widgetItem.toDTO();
      expect(JSON.stringify(dto.search)).toEqual('{"filter":{"name":"title","type":"eq","value":"title1"}}');
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it('filter should be undefined if you dont have a filter', () => {
      expect(widgetItem.filter).toBeUndefined();
      expect(widgetItem['_search']).toBeUndefined();
      expect(widgetItem['_search']?.filter).toBeUndefined();
    });

    it('should reset the filter to undefined', () => {
      widgetItem.filter = comparisonFilter;
      widgetItem.removeSearchFilter();
      expect(widgetItem.filter).toBeUndefined();
    });

    it('resetSearchFilter should set the filter property to undefined', () => {
      widgetItem.removeSearchFilter();
      expect(widgetItem['_search']).toStrictEqual({ filter: undefined });
      expect(widgetItem['_search']?.filter).toBeUndefined();
      expect(widgetItem.toDTO().search?.filter).toBeUndefined();
      const dto = widgetItem.toDTO();

      expect(JSON.stringify(dto.search)).toBeUndefined();
      expect(JSON.stringify(dto.search)).not.toEqual('');
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it('toDTO returns correct DTO when _search is empty', () => {
      widgetItem['_search'] = {};
      const dto = widgetItem.toDTO();

      expect(JSON.stringify(dto.search)).toBeUndefined();
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });
  });
});
