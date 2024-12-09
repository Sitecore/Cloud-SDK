import { ErrorMessages } from '../../consts';
import { WidgetItem } from './widget-item';

describe('widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('protected validators', () => {
    describe('_validateNonEmptyString', () => {
      it.each([undefined, 't', 't'.repeat(100)])(`should not throw an error if valid value is passed`, (s) => {
        const widgetItem = new WidgetItem('e', 'r');

        expect(() => {
          widgetItem['_validateNonEmptyString']('test' as any, s);
        }).not.toThrow();
      });

      it.each(['', '  '])(`should throw an error if invalid values is passed`, (s) => {
        const widgetItem = new WidgetItem('e', 'r');

        expect(() => {
          widgetItem['_validateNonEmptyString']('test' as any, s as any);
        }).toThrow('test');
      });
    });
    describe('_validateStringLengthInRange1To100', () => {
      it.each([undefined, 't', 't'.repeat(100)])(`should not throw an error if valid value is passed`, (s) => {
        const widgetItem = new WidgetItem('e', 'r');

        expect(() => {
          widgetItem['_validateStringLengthInRange1To100']('test' as any, s);
        }).not.toThrow();
      });

      it.each(['', '  ', 't'.repeat(101)])(`should throw an error if invalid values is passed`, (s) => {
        const widgetItem = new WidgetItem('e', 'r');

        expect(() => {
          widgetItem['_validateStringLengthInRange1To100']('test' as any, s as any);
        }).toThrow('test');
      });
    });
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

  describe('setters', () => {
    it('should set the entity', () => {
      const widgetItem = new WidgetItem('test', 'test');
      widgetItem.entity = 'test2';
      widgetItem.rfkid = 'test2';

      expect(widgetItem.toDTO()).toEqual({ entity: 'test2', rfk_id: 'test2' });
    });
  });

  describe('WidgetItem getters', () => {
    it('should get all properties', () => {
      const entity = 'content';
      const rfkId = 'rfkid';

      const widgetItem = new WidgetItem(entity, rfkId);

      expect(widgetItem.entity).toBe(entity);
      expect(widgetItem.rfkid).toBe(rfkId);
    });
  });
});
