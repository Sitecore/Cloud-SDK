import { ErrorMessages } from '../../const';
import { WidgetItem } from './widget-item';

describe('widget item class', () => {
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
      const expected = {
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test'
      };

      const result = new WidgetItem(validWidgetItem.entity, validWidgetItem.rfkId).toDTO();

      expect(result).toStrictEqual(expected);
    });
  });
});
