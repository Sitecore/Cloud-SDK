import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import type { SearchRuleOptions } from './interfaces';
import { RuleWidgetItem } from './rule-widget-item';

describe('RuleWidgetItem class', () => {
  describe('constructor', () => {
    it('should initialize without rule', () => {
      const widgetItem = new RuleWidgetItem('test', 'test');
      expect(widgetItem['_rule']).toBeUndefined();
    });

    it('should initialize with valid rule', () => {
      const rule: SearchRuleOptions = { behaviors: true };
      const widgetItem = new RuleWidgetItem('test', 'test', rule);
      expect(widgetItem['_rule']).toBe(rule);
    });

    it('should validate rule during construction', () => {
      const invalidRule: SearchRuleOptions = {
        pin: [{ id: '', slot: 1 }]
      };
      expect(() => new RuleWidgetItem('test', 'test', invalidRule)).toThrow(ErrorMessages.IV_0027);
    });
  });

  describe('rule validation', () => {
    it('should do validation when rule is defined', () => {
      const widgetItem = new RuleWidgetItem('test', 'test', { pin: [{ id: 'test', slot: 1 }] });
      widgetItem.rule = true as any;
      expect(widgetItem['_rule']).toBeDefined();
      expect(() => widgetItem['_validateRule'](widgetItem['_rule'])).not.toThrow();
    });

    it('should skip validation when rule is undefined', () => {
      const widgetItem = new RuleWidgetItem('test', 'test');
      expect(() => widgetItem['_validateRule'](undefined)).not.toThrow();
      expect(() => widgetItem['_validateRule']({})).not.toThrow();
      expect(widgetItem['_rule']).toBeUndefined();
    });

    it('should skip validation when rule is boolean', () => {
      expect(new RuleWidgetItem('test', 'test', true as any).rule).toBe(true);
      expect(new RuleWidgetItem('test', 'test', false as any).rule).toBe(undefined);
    });

    it('should skip validation when rule is a string', () => {
      expect(new RuleWidgetItem('test', 'test', 'stringRule' as any).rule).toBe('stringRule');
    });

    it('should skip validation when rule is a number', () => {
      expect(new RuleWidgetItem('test', 'test', 123 as any).rule).toBe(123);
    });

    it('should skip validation when rule is an object without required properties', () => {
      const rule = { someProperty: 'value' } as any;
      expect(new RuleWidgetItem('test', 'test', rule).rule).toBe(rule);
    });

    describe('pin validation', () => {
      it('should validate pin id', () => {
        const widgetItem = new RuleWidgetItem('test', 'test');
        expect(() =>
          widgetItem['_validateRule']({
            pin: [{ id: '', slot: 1 }]
          })
        ).toThrow(ErrorMessages.IV_0027);

        expect(() =>
          widgetItem['_validateRule']({
            pin: [{ id: ' ', slot: 1 }]
          })
        ).toThrow(ErrorMessages.IV_0027);
      });

      it('should validate pin slot', () => {
        const widgetItem = new RuleWidgetItem('test', 'test');
        expect(() =>
          widgetItem['_validateRule']({
            pin: [{ id: 'test', slot: -1 }]
          })
        ).toThrow(ErrorMessages.IV_0028);
      });
    });

    describe('boost validation', () => {
      it('should validate boost slots', () => {
        const widgetItem = new RuleWidgetItem('test', 'test');
        expect(() =>
          widgetItem['_validateRule']({
            boost: [
              {
                filter: new ComparisonFilter('test', 'eq', 'value'),
                slots: [-1]
              }
            ]
          })
        ).toThrow(ErrorMessages.IV_0028);
      });

      it('should handle undefined boost slots', () => {
        const widgetItem = new RuleWidgetItem('test', 'test');
        expect(() =>
          widgetItem['_validateRule']({
            boost: [
              {
                filter: new ComparisonFilter('test', 'eq', 'value')
              }
            ]
          })
        ).not.toThrow();
      });
    });

    describe('include validation', () => {
      it('should validate include slots', () => {
        const widgetItem = new RuleWidgetItem('test', 'test');
        expect(() =>
          widgetItem['_validateRule']({
            include: [
              {
                filter: new ComparisonFilter('test', 'eq', 'value'),
                slots: [-1] as any
              }
            ]
          })
        ).toThrow(ErrorMessages.IV_0028);
      });
    });
  });

  describe('DTO conversion', () => {
    let widgetItem: RuleWidgetItem;

    beforeEach(() => {
      widgetItem = new RuleWidgetItem('test', 'test');
    });

    it('should convert boost rules to DTO', () => {
      const filter = new ComparisonFilter('test', 'eq', 'value');
      const result = widgetItem['_convertToBoostRuleDTO']([
        {
          filter,
          slots: [1],
          weight: 2
        }
      ]);

      expect(result).toEqual([
        {
          filter: filter.toDTO(),
          slots: [1],
          weight: 2
        }
      ]);
    });

    it('should convert include rules to DTO', () => {
      const filter = new ComparisonFilter('test', 'eq', 'value');
      const result = widgetItem['_convertToIncludeRuleDTO']([
        {
          filter,
          slots: [1]
        }
      ]);

      expect(result).toEqual([
        {
          filter: filter.toDTO(),
          slots: [1]
        }
      ]);
    });

    it('should handle undefined rule in ruleToDTO', () => {
      expect(widgetItem['_ruleToDTO'](undefined)).toBeUndefined();
    });

    it('should convert complete rule to DTO', () => {
      const filter = new ComparisonFilter('test', 'eq', 'value');
      const rule: SearchRuleOptions = {
        behaviors: true,
        blacklist: { filter },
        boost: [{ filter, slots: [1], weight: 2 }],
        bury: { filter },
        include: [{ filter, slots: [2] }],
        pin: [{ id: 'test', slot: 3 }]
      };

      const dto = widgetItem['_ruleToDTO'](rule);
      expect(dto).toEqual({
        behaviors: true,
        blacklist: { filter: filter.toDTO() },
        boost: [{ filter: filter.toDTO(), slots: [1], weight: 2 }],
        bury: { filter: filter.toDTO() },
        include: [{ filter: filter.toDTO(), slots: [2] }],
        pin: [{ id: 'test', slot: 3 }]
      });
    });

    it('should convert partial rule to DTO', () => {
      const dto = widgetItem['_ruleToDTO']({
        behaviors: true
      });
      expect(dto).toEqual({
        behaviors: true
      });
    });
  });

  describe('accessors', () => {
    let widgetItem: RuleWidgetItem;

    beforeEach(() => {
      widgetItem = new RuleWidgetItem('test', 'test');
    });

    it('should set and get rule', () => {
      const rule: SearchRuleOptions = { behaviors: true };
      widgetItem.rule = rule;
      expect(widgetItem.rule).toBe(rule);
    });

    it('should reset rule', () => {
      widgetItem.rule = { behaviors: true };
      widgetItem.resetRule();
      expect(widgetItem.rule).toBeUndefined();
    });

    it('should validate rule in setter', () => {
      expect(() => {
        widgetItem.rule = {
          pin: [{ id: '', slot: 1 }]
        };
      }).toThrow(ErrorMessages.IV_0027);
    });
  });

  describe('toDTO', () => {
    it('should convert to DTO', () => {
      const widgetItem = new RuleWidgetItem('test', 'test', {
        behaviors: true
      });
      expect(widgetItem.toDTO()).toEqual({
        entity: 'test',
        rfk_id: 'test'
      });
    });
  });
});
