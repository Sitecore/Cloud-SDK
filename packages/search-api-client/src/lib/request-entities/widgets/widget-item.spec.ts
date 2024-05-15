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
});
