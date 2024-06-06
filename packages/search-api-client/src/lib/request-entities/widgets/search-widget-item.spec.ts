import { ErrorMessages } from '../../const';
import { SearchWidgetItem } from './search-widget-item';

describe('search widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test'
  };

  describe('max validator', () => {
    it(`should throw an error if the 'max' property is less than 1`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      expect(() => new SearchWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId, { max: 0 })).toThrow(
        ErrorMessages.IV_0014
      );
    });

    it(`should not throw an error if the 'max' property is 100`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      expect(() => new SearchWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId, { max: 100 })).not.toThrow(
        ErrorMessages.IV_0014
      );
    });

    it(`should throw an error if the 'max' property is more than 100`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      expect(() => new SearchWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId, { max: 101 })).toThrow(
        ErrorMessages.IV_0014
      );
    });
  });

  describe('mapper', () => {
    it('should return the original widget item mapped', () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      const result = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId).toDTO();

      expect(result).toEqual(expected);
    });

    it('should return the original widget item mapped with only all value', () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      const result = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId, { all: true }).toDTO();

      const expected = {
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test',
        search: {
          facet: {
            all: true
          }
        }
      };

      expect(result).toEqual(expected);
      expect(result.search?.facet?.max).toBeUndefined();
    });

    it('should return the original widget item mapped with max and all values', () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      const result = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId, { all: true, max: 1 }).toDTO();

      const expected = {
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test',
        search: {
          facet: {
            all: true,
            max: 1
          }
        }
      };

      expect(result).toEqual(expected);
    });
  });
});
