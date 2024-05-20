import { ErrorMessages } from '../../const';
import { WidgetItem } from './widget-item';

describe('widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test',
    search: undefined
  };
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

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0009);
    });

    it(`should throw an error if the 'rfkId' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: ''
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0010);
    });

    it(`should throw an error if the 'entity' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: '   ',
        rfkId: 'test'
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0009);
    });

    it(`should throw an error if the 'rfkId' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: '   '
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(ErrorMessages.MV_0010);
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
      const fieldsArray = ['name', 'description'];
      widgetItem.content = fieldsArray;
      expect(widgetItem['_search']?.content).toStrictEqual({ fields: fieldsArray });
    });

    it('should set content to empty object when provided an empty object', () => {
      widgetItem.content = {};
      expect(widgetItem['_search']?.content).toStrictEqual({});
    });

    it('should overwrite previous content with empty object', () => {
      widgetItem.content = {};
      const fieldsArray = ['name', 'description'];
      widgetItem.content = fieldsArray;
      expect(widgetItem['_search']?.content).toStrictEqual({ fields: fieldsArray });
    });

    it('should maintain the integrity of the content structure', () => {
      widgetItem.content = ['item1', 'item2'];
      widgetItem.content = {};
      expect(widgetItem['_search']?.content).toStrictEqual({});
    });

    it('should not set the limit if you do not provide one', () => {
      expect(widgetItem.content).toBeUndefined();
      expect(widgetItem['_search']?.content).toBeUndefined();
      expect(widgetItem).toBe(widgetItem);
      expect(widgetItem.toDTO()).toStrictEqual({
        ...expected
      });
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
      widgetItem.content = {
        query: { keyphrase: 'example', operator: 'and' }
      };
    });

    it('resetSearchQuery should set the query property to undefined', () => {
      widgetItem.resetSearchQuery();
      expect(widgetItem['_search']).toStrictEqual({ content: {}, query: undefined });
      expect(widgetItem['_search']?.content).toStrictEqual({});
      expect(widgetItem['_search']?.query).toBeUndefined();
      expect(widgetItem.toDTO().search?.query).toBeUndefined();
    });
  });
});
