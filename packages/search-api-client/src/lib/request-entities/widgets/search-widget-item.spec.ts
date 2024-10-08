import { ErrorMessages } from '../../consts';
import type { Facet, FacetDTO } from './interfaces';
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

    it('should set the facet when given only types value', () => {
      const expected = { types: [{ name: 'test' }] };

      const widgetItem = new SearchWidgetItem('content', 'rfkid_7', { types: [{ name: 'test' }] });

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
      const expected: FacetDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'count',
          order: 'asc'
        },
        types: [{ name: 'test' }]
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
      const expected: FacetDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test' }]
      };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet when given a partial valid value', () => {
      const expected: FacetDTO = {
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

    it('should set the facet with a valid types name and exclude property', () => {
      const expected: FacetDTO = {
        all: true,
        coverage: true,
        max: 50,
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ exclude: ['test'], name: 'test' }]
      };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();
      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and max property in types array', () => {
      const expected: FacetDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ max: 1, name: 'test' }]
      };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and keyphrase property in types array', () => {
      const expected: FacetDTO = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ keyphrase: 'test', name: 'test' }]
      };

      widgetItem.facet = expected;

      const result = widgetItem.toDTO();

      expect(result.search?.facet).toEqual(expected);
    });

    it('should set the facet with a valid types name and minCount property in types array', () => {
      const data: Facet = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ minCount: 1, name: 'test' }]
      };

      const expected: FacetDTO = {
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
      const data: Facet = {
        sort: {
          name: 'text',
          order: 'asc'
        },
        types: [{ name: 'test', sort: { name: 'text', order: 'asc' } }]
      };

      const expected: FacetDTO = {
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
        new SearchWidgetItem('test', 'test', { types: [{ name: '' }] });
      }).toThrow(ErrorMessages.IV_0016);
    });

    it('should throw error if name contains spaces', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ name: 'test test' }] });
      }).toThrow(ErrorMessages.IV_0016);
    });

    it('should not throw error if typescript bypassed for max ', () => {
      expect(() => {
        /**
         *  This is a way to pass a stryker mutant when it replaces the comparison to "true"
         *  if(typeof a === 'number')
         *  to
         *  if(true)
         *  */
        new SearchWidgetItem('test', 'test', { types: [{ max: null as unknown as number, name: 'test' }] });
      }).not.toThrow();
    });

    it('should not throw error if max is 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ max: 100, name: 'test' }] });
      }).not.toThrow(ErrorMessages.IV_0017);
    });

    it('should not throw error if max is 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ max: 1, name: 'test' }] });
      }).not.toThrow(ErrorMessages.IV_0017);
    });

    it('should throw error if max is an invalid number less than 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ max: 0, name: 'test' }] });
      }).toThrow(ErrorMessages.IV_0017);
    });
    it('should throw error if max is an invalid number greater than 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ max: 101, name: 'test' }] });
      }).toThrow(ErrorMessages.IV_0017);
    });

    it('it should not throw error if keyphrase is not empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ keyphrase: 'test', name: 'test' }] });
      }).not.toThrow(ErrorMessages.IV_0018);
    });

    it('should throw error if keyphrase is empty string', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ keyphrase: '', name: 'test' }] });
      }).toThrow(ErrorMessages.IV_0018);
    });

    it('should not throw error if typescript bypassed for minCount ', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ minCount: null as unknown as number, name: 'test' }] });
      }).not.toThrow();
    });

    it('should not throw error if minCount is 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ minCount: 100, name: 'test' }] });
      }).not.toThrow(ErrorMessages.IV_0019);
    });

    it('should not throw error if minCount is 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ minCount: 1, name: 'test' }] });
      }).not.toThrow(ErrorMessages.IV_0019);
    });

    it('should throw error if minCount is an invalid number less than 1', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ minCount: 0, name: 'test' }] });
      }).toThrow(ErrorMessages.IV_0019);
    });
    it('should throw error if minCount is an invalid number greater than 100', () => {
      expect(() => {
        new SearchWidgetItem('test', 'test', { types: [{ minCount: 101, name: 'test' }] });
      }).toThrow(ErrorMessages.IV_0019);
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
