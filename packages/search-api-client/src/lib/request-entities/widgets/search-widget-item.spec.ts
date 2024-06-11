import { ErrorMessages } from '../../const';
import { SearchWidgetItem } from './search-widget-item';

describe('search widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test'
  };

  describe('set facet', () => {
    let widgetItem: SearchWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new SearchWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it('should set the facet when given a full valid value', () => {
      const expected = { all: true, max: 50 };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given only all value', () => {
      const expected = { all: true };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given only max value', () => {
      const expected = { max: 50 };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should be undefined if not set', () => {
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });

    it('should be undefined if set with empty object', () => {
      widgetItem.facet = {};

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });

    it('should not throw error if undefined', () => {
      const expected = { max: undefined };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet?.max).toBeUndefined();
    });

    it('should ignore if bypassed by typescript', () => {
      expect(() => {
        widgetItem.facet = { max: null as unknown as number };
      }).not.toThrow(ErrorMessages.IV_0014);
    });

    it('should throw error if max is less than 1', () => {
      expect(() => {
        widgetItem.facet = { max: 0 };
      }).toThrow(ErrorMessages.IV_0014);
    });

    it('should throw error if max is greater than 100', () => {
      expect(() => {
        widgetItem.facet = { max: 101 };
      }).toThrow(ErrorMessages.IV_0014);
    });

    it('should not throw error if max is 1', () => {
      expect(() => {
        widgetItem.facet = { max: 1 };
      }).not.toThrow(ErrorMessages.IV_0014);
    });

    it('should not throw error if max is 100', () => {
      expect(() => {
        widgetItem.facet = { max: 100 };
      }).not.toThrow(ErrorMessages.IV_0014);
    });

    it('should remove the facet', () => {
      const expected = { all: true, max: 50 };
      widgetItem.facet = expected;
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);

      widgetItem.removeFacet();
      const result2 = widgetItem.toDTO();

      expect(result2.search?.facet).toBeUndefined();
    });

    it('should do nothing if no facet to remove', () => {
      widgetItem.removeFacet();
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });
  });

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
