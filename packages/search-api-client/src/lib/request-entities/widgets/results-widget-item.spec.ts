import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import { ResultsWidgetItem } from './results-widget-item';

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

      expect(() => new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId)).not.toThrow();
    });
    it(`should throw an error if the 'entity' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: '',
        rfkId: 'test'
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(
        ErrorMessages.MV_0010
      );
    });

    it(`should throw an error if the 'rfkId' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: ''
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(
        ErrorMessages.MV_0011
      );
    });

    it(`should throw an error if the 'entity' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: '   ',
        rfkId: 'test'
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(
        ErrorMessages.MV_0010
      );
    });

    it(`should throw an error if the 'rfkId' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        rfkId: '   '
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.rfkId)).toThrow(
        ErrorMessages.MV_0011
      );
    });
  });
  describe('mapper', () => {
    it('should return the original widget item mapped', () => {
      const validWidgetItem = {
        entity: 'test',
        rfkId: 'test'
      };

      const result = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId).toDTO();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('set limit', () => {
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it('should set the limit when given a valid value', () => {
      expect(widgetItem.limit).toBeUndefined();
      const validLimits = [1, 2, 50, 99, 100];
      validLimits.forEach((limit) => {
        widgetItem.limit = limit;

        expect(widgetItem['_limit']).toBe(limit);
        expect(widgetItem).toBe(widgetItem);
        expect(widgetItem['_resultsToDTO']()).toStrictEqual({
          limit
        });
      });
    });

    it('should reflect the limit as undefined when it is reset or not set', () => {
      widgetItem.limit = undefined as unknown as number;
      expect(widgetItem.limit).toBeUndefined();

      widgetItem.limit = 1;
      widgetItem.resetLimit();

      expect(widgetItem['_resultsToDTO']().limit).toBeUndefined();
    });

    it('should not set the limit if you do not provide one', () => {
      expect(widgetItem.limit).toBeUndefined();
      expect(widgetItem['_limit']).toBeUndefined();
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
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it('should set content to fields array when provided an array', () => {
      widgetItem.content = { fields: ['name', 'description'] };
      expect(widgetItem['_content']).toEqual({ fields: ['name', 'description'] });
      expect(widgetItem['_resultsToDTO']().content).toEqual({ fields: ['name', 'description'] });
    });

    it('should set content to empty object when provided an empty object', () => {
      widgetItem.content = {};
      expect(widgetItem?.['_content']).toStrictEqual({});
    });

    it('should overwrite previous content with empty object', () => {
      widgetItem.content = {};
      const fieldsArray: ArrayOfAtLeastOne<string> = ['name', 'description'];
      widgetItem.content = { fields: fieldsArray };
      expect(widgetItem?.['_content']).toEqual({ fields: fieldsArray });
    });
  });

  describe('resetSearchContent', () => {
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };
    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
      widgetItem.content = { fields: ['item1', 'item2'] };
    });
    it('should reset the content if resetSearchContent is called', () => {
      widgetItem.resetContent();
      expect(widgetItem['_content']).toBeUndefined();
    });
  });

  describe('set group by', () => {
    let widgetItem: ResultsWidgetItem;

    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it(`should update the 'groupBy' search property`, () => {
      widgetItem.groupBy = 'initial';

      expect(widgetItem['_groupBy']).toBe('initial');

      widgetItem.groupBy = 'type';

      expect(widgetItem['_resultsToDTO']()).toEqual({
        filter: undefined,
        group_by: 'type'
      });

      const dto = widgetItem['_resultsToDTO']();
      expect(dto.group_by).toEqual('type');
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it(`should reflect the 'groupBy' as undefined when it is not set or reset`, () => {
      widgetItem.groupBy = undefined as unknown as string;
      expect(widgetItem.groupBy).toBeUndefined();

      widgetItem.groupBy = 'type';
      widgetItem.resetGroupBy();
      expect(widgetItem['_resultsToDTO']().group_by).toBeUndefined();
    });

    it('should throw an error if an invalid value is set via constructor', () => {
      expect(() => {
        new ResultsWidgetItem('content', 'rfkid_7', { groupBy: '' });
      }).toThrow(ErrorMessages.IV_0022);
    });

    it('should throw an error if an invalid value is set via setter', () => {
      expect(() => {
        new ResultsWidgetItem('content', 'rfkid_7').groupBy = ' ';
      }).toThrow(ErrorMessages.IV_0022);
    });
  });

  describe('filter', () => {
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      rfkId: 'test'
    };

    const comparisonFilter = new ComparisonFilter('price', 'lt', 100);
    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.rfkId);
    });

    it('should get the current filter', () => {
      const filterEqual = new ComparisonFilter('title', 'eq', 'title1');
      widgetItem.filter = filterEqual;
      const dto = widgetItem['_resultsToDTO']();
      expect(dto.filter).toEqual(filterEqual.toDTO());
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it('filter should be undefined if you dont have a filter', () => {
      expect(widgetItem.filter).toBeUndefined();
      expect(widgetItem['_filter']).toBeUndefined();
    });

    it('should reset the filter to undefined', () => {
      widgetItem.filter = comparisonFilter;
      widgetItem.resetFilter();
      expect(widgetItem['_filter']).toBeUndefined();
    });

    it('resetSearchFilter should set the filter property to undefined', () => {
      widgetItem.resetFilter();
      expect(widgetItem['_filter']).toBeUndefined();
      expect(widgetItem['_resultsToDTO']().filter).toBeUndefined();
      const dto = widgetItem['_resultsToDTO']();

      expect(dto.filter).toBeUndefined();
      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });

    it('toDTO returns correct DTO when _search is empty', () => {
      const dto = widgetItem['_resultsToDTO']();

      expect(dto.content).toBeUndefined();
      expect(dto.group_by).toBeUndefined();
      expect(dto.limit).toBeUndefined();
      expect(dto.filter).toBeUndefined();

      expect(mockFilter.toDTO).not.toHaveBeenCalled();
    });
  });
});
