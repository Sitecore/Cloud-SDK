import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type { ContentOptions, SearchRuleOptions } from './interfaces';
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
        widgetId: 'test'
      };

      expect(() => new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId)).not.toThrow();
    });
    it(`should throw an error if the 'entity' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: '',
        widgetId: 'test'
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(
        ErrorMessages.MV_0010
      );
    });

    it(`should throw an error if the 'widgetId' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        widgetId: ''
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(
        ErrorMessages.MV_0011
      );
    });

    it(`should throw an error if the 'entity' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: '   ',
        widgetId: 'test'
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(
        ErrorMessages.MV_0010
      );
    });

    it(`should throw an error if the 'widgetId' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        widgetId: '   '
      };

      expect(() => new ResultsWidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(
        ErrorMessages.MV_0011
      );
    });
  });
  describe('mapper', () => {
    it('should return the original widget item mapped', () => {
      const validWidgetItem = {
        entity: 'test',
        widgetId: 'test'
      };
      const result = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId).toDTO();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('set limit', () => {
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
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
      widgetId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    });

    it('should set content to attributes array when provided an array', () => {
      widgetItem.content = { attributes: ['name', 'description'] };
      expect(widgetItem['_content']).toEqual({ attributes: ['name', 'description'] });
      expect(widgetItem['_resultsToDTO']().content).toEqual({ fields: ['name', 'description'] });
    });

    it('should set content to empty object when provided an empty object', () => {
      widgetItem.content = {};
      expect(widgetItem?.['_content']).toStrictEqual({});
    });

    it('should overwrite previous content with empty object', () => {
      widgetItem.content = {};
      const attributesArray: ArrayOfAtLeastOne<string> = ['name', 'description'];
      widgetItem.content = { attributes: attributesArray };
      expect(widgetItem?.['_content']).toEqual({ attributes: attributesArray });
    });
  });

  describe('resetSearchContent', () => {
    let widgetItem: ResultsWidgetItem;
    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };
    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
      widgetItem.content = { attributes: ['item1', 'item2'] };
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
      widgetId: 'test'
    };

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
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
      widgetId: 'test'
    };

    const comparisonFilter = new ComparisonFilter('price', 'lt', 100);
    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
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

  describe('set rule', () => {
    let widgetItem: ResultsWidgetItem;

    const validWidgetItem = {
      entity: 'test',
      widgetId: 'test'
    };

    const validRule = {
      behaviors: false,
      blacklist: { filter: new ComparisonFilter('title', 'eq', 'title1') },
      boost: [
        {
          filter: new ComparisonFilter('title', 'eq', 'title1'),
          slots: [5],
          weight: 4
        }
      ],
      bury: { filter: new ComparisonFilter('title', 'eq', 'title1') },
      include: [{ filter: new ComparisonFilter('title', 'eq', 'title1'), slots: [2] }],
      pin: [
        {
          id: '2',
          slot: 4
        }
      ]
    } as SearchRuleOptions;

    beforeEach(() => {
      widgetItem = new ResultsWidgetItem(validWidgetItem.entity, validWidgetItem.widgetId);
    });

    it(`should update the 'rule' property`, () => {
      widgetItem.rule = validRule;

      expect(widgetItem['_rule']).toBe(validRule);
    });

    it(`should reflect the 'rule' as undefined when it is not set or reset`, () => {
      widgetItem.rule = undefined as unknown as SearchRuleOptions;
      expect(widgetItem.rule).toBeUndefined();

      widgetItem.rule = validRule;
      widgetItem.resetRule();
      expect(widgetItem['_resultsToDTO']().rule).toBeUndefined();
    });

    describe('_contentToDTO', () => {
      it('should return undefined if no content is passed', () => {
        const widgetItem = new ResultsWidgetItem('test', 'test');
        const result = widgetItem['_contentToDTO']();
        expect(result).toBeUndefined();
      });
    });

    describe('_resultsToDTO', () => {
      it('should include rule in DTO when _rule is set', () => {
        const widgetItem = new ResultsWidgetItem('test', 'test');
        widgetItem['_rule'] = { behaviors: true };
        const dto = widgetItem['_resultsToDTO']();
        expect(dto.rule).toStrictEqual(widgetItem['_rule']);
      });
    });

    // eslint-disable-next-line max-len
    it('should throw an error if an invalid value for boost.slots, include.slots, pin.slot and pin.id are set via constructor', () => {
      const scenarios = [
        {
          error: ErrorMessages.IV_0028,
          rule: { boost: [{ filter: new ComparisonFilter('price', 'lt', 100), slots: [-2, 3], weight: 3 }] }
        },
        {
          error: ErrorMessages.IV_0028,
          rule: { include: [{ filter: new ComparisonFilter('price', 'lt', 100), slots: [-2, 3] }] }
        },
        { error: ErrorMessages.IV_0028, rule: { pin: [{ id: '1', slot: -2 }] } },
        { error: ErrorMessages.IV_0027, rule: { pin: [{ id: '', slot: 2 }] } }
      ];

      scenarios.forEach((scenario) => {
        expect(() => {
          new ResultsWidgetItem('content', 'rfkid_7', {
            rule: scenario.rule as SearchRuleOptions
          });
        }).toThrow(scenario.error);
      });
    });

    it('should handle rule.include being null', () => {
      const validatePositiveIntegerSpy = jest.spyOn(ResultsWidgetItem.prototype as any, '_validatePositiveInteger');

      const rule = { ...validRule, include: null as any } as SearchRuleOptions;
      new ResultsWidgetItem('content', 'rfkid_7', { rule });

      expect(validatePositiveIntegerSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle rule.boost.slots being undefined', () => {
      const validatePositiveIntegerSpy = jest.spyOn(ResultsWidgetItem.prototype as any, '_validatePositiveInteger');

      const rule = {
        ...validRule,
        boost: [{ filter: new ComparisonFilter('title', 'eq', 'title1') }]
      } as SearchRuleOptions;
      new ResultsWidgetItem('content', 'rfkid_7', { rule });

      expect(validatePositiveIntegerSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ResultsWidgetItem getters', () => {
    it('should get all properties', () => {
      const limit = 10;
      const content: ContentOptions = { attributes: ['test'] };
      const filter = new ComparisonFilter('test', 'eq', 'te');
      const groupBy = 'groupBy';
      const rule: SearchRuleOptions = {
        behaviors: false,
        blacklist: { filter: new ComparisonFilter('test', 'eq', 'te') },
        boost: [{ filter: new ComparisonFilter('test', 'eq', 'te'), slots: [1], weight: 10 }],
        bury: { filter: new ComparisonFilter('test', 'eq', 'te') },
        include: [{ filter: new ComparisonFilter('test', 'eq', 'te'), slots: [1] }],
        pin: [{ id: '123', slot: 1 }]
      };

      const widgetItem = new ResultsWidgetItem('content', 'rfkid_qa', {
        content,
        filter,
        groupBy,
        limit,
        rule
      });

      expect(widgetItem.content).toEqual(content);
      expect(widgetItem.filter).toEqual(filter);
      expect(widgetItem.groupBy).toBe(groupBy);
      expect(widgetItem.limit).toBe(limit);
      expect(widgetItem.rule).toEqual(rule);
    });
  });
});
