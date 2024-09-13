import { ErrorMessages } from '../../consts';
import type { Facet } from './interfaces';
import { SearchWidgetItem } from './search-widget-item';

describe('search widget item class', () => {
  describe('constructor', () => {
    it('should early return if passed an empty object', () => {
      const widgetItem = new SearchWidgetItem('content', 'rfkid_7', {});

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });

    it('should set the facet when given only all value', () => {
      const expected = { all: true };

      const widgetItem = new SearchWidgetItem('content', 'rfkid_7', expected);

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given only max value', () => {
      const expected = { max: 50 };

      const widgetItem = new SearchWidgetItem('content', 'rfkid_7', expected);

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should be undefined if not set', () => {
      const widgetItem = new SearchWidgetItem('content', 'rfkid_7');
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toBeUndefined();
    });

    it('should ignore if bypassed by typescript', () => {
      expect(() => {
        new SearchWidgetItem('content', 'rfkid_7', { max: null as unknown as number });
      }).not.toThrow(ErrorMessages.IV_0014);
    });

    it('should remove the facet', () => {
      const expected: Facet = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'count',
          order: 'asc'
        }
      };
      const widgetItem = new SearchWidgetItem('content', 'rfkid_7', expected);
      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);

      widgetItem.removeFacet();
      const result2 = widgetItem.toDTO();

      expect(result2.search?.facet).toBeUndefined();
    });
  });

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
      const expected: Facet = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        }
      };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });
  });

  describe('max validator', () => {
    it('should ignore if bypassed by typescript', () => {
      expect(() => {
        const widgetItem = new SearchWidgetItem('test', 'test');
        widgetItem.facet = { max: null as unknown as number };
      }).not.toThrow(ErrorMessages.IV_0014);
    });

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
});
