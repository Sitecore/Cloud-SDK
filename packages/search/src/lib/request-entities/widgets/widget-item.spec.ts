import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import { WidgetItem } from './widget-item';

describe('widget item class', () => {
  const expected = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test'
  };

  const expectedWithSources = {
    entity: 'test',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: 'test',
    sources: ['source1']
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
        widgetId: 'test'
      };

      expect(() => new WidgetItem(validWidgetItem.entity, validWidgetItem.widgetId)).not.toThrow();
    });
    it(`should throw an error if the 'entity' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: '',
        widgetId: 'test'
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(ErrorMessages.MV_0010);
    });

    it(`should throw an error if the 'widgetId' property is empty string`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        widgetId: ''
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(ErrorMessages.MV_0011);
    });

    it(`should throw an error if the 'entity' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: '   ',
        widgetId: 'test'
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(ErrorMessages.MV_0010);
    });

    it(`should throw an error if the 'widgetId' property is a string with empty spaces`, () => {
      const invalidWidgetItem = {
        entity: 'test',
        widgetId: '   '
      };

      expect(() => new WidgetItem(invalidWidgetItem.entity, invalidWidgetItem.widgetId)).toThrow(ErrorMessages.MV_0011);
    });
  });

  describe('constructor with sources', () => {
    it('should create widget item with sources when provided', () => {
      const sources = ['source1', 'source2'] as ArrayOfAtLeastOne<string>;
      const widgetItem = new WidgetItem('test', 'test', sources);

      expect(widgetItem.sources).toEqual(sources);
      expect(widgetItem.entity).toBe('test');
      expect(widgetItem.widgetId).toBe('test');
    });

    it('should create widget item with undefined sources when not provided', () => {
      const widgetItem = new WidgetItem('test', 'test');

      expect(widgetItem.sources).toBeUndefined();
      expect(widgetItem.entity).toBe('test');
      expect(widgetItem.widgetId).toBe('test');
    });

    it('should create widget item with single source', () => {
      const sources = ['source1'] as ArrayOfAtLeastOne<string>;
      const widgetItem = new WidgetItem('test', 'test', sources);

      expect(widgetItem.sources).toEqual(sources);
    });
  });

  describe('mapper', () => {
    it('should return the original widget item mapped', () => {
      const validWidgetItem = {
        entity: 'test',
        widgetId: 'test'
      };

      const result = new WidgetItem(validWidgetItem.entity, validWidgetItem.widgetId).toDTO();

      expect(result).toStrictEqual(expected);
    });

    it('should return the widget item mapped with sources when provided', () => {
      const sources = ['source1'] as ArrayOfAtLeastOne<string>;
      const widgetItem = new WidgetItem('test', 'test', sources);

      const result = widgetItem.toDTO();

      expect(result).toStrictEqual(expectedWithSources);
    });

    it('should return the widget item mapped with multiple sources', () => {
      const sources: ArrayOfAtLeastOne<string> = ['source1', 'source2', 'source3'];
      const widgetItem = new WidgetItem('test', 'test', sources);

      const result = widgetItem.toDTO();

      expect(result).toStrictEqual({
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test',
        sources: ['source1', 'source2', 'source3']
      });
    });

    it('should not include sources in DTO when sources is undefined', () => {
      const widgetItem = new WidgetItem('test', 'test');

      const result = widgetItem.toDTO();

      expect(result).toStrictEqual(expected);
      expect(result).not.toHaveProperty('sources');
    });
  });

  describe('setters', () => {
    it('should set the entity', () => {
      const widgetItem = new WidgetItem('test', 'test');
      widgetItem.entity = 'test2';
      widgetItem.widgetId = 'test2';

      expect(widgetItem.toDTO()).toEqual({ entity: 'test2', rfk_id: 'test2' });
    });

    it('should set the sources', () => {
      const widgetItem = new WidgetItem('test', 'test');
      const sources = ['source1', 'source2'] as ArrayOfAtLeastOne<string>;

      widgetItem.sources = sources;

      expect(widgetItem.sources).toEqual(sources);
      expect(widgetItem.toDTO()).toEqual({
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test',
        sources: sources
      });
    });

    it('should reset the sources', () => {
      const widgetItem = new WidgetItem('test', 'test');
      const sources = ['source1', 'source2'] as ArrayOfAtLeastOne<string>;

      widgetItem.sources = sources;
      widgetItem.resetSources();
      expect(widgetItem.sources).toEqual(undefined);
      expect(widgetItem.toDTO()).toEqual({
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test'
      });
    });

    it('should update sources when changed', () => {
      const initialSources: ArrayOfAtLeastOne<string> = ['source1'];
      const newSources: ArrayOfAtLeastOne<string> = ['source2', 'source3'];
      const widgetItem = new WidgetItem('test', 'test', initialSources);

      widgetItem.sources = newSources;

      expect(widgetItem.sources).toEqual(newSources);
      expect(widgetItem.toDTO()).toEqual({
        entity: 'test',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rfk_id: 'test',
        sources: newSources
      });
    });
  });

  describe('WidgetItem getters', () => {
    it('should get all properties', () => {
      const entity = 'content';
      const widgetId = 'rfkid';

      const widgetItem = new WidgetItem(entity, widgetId);

      expect(widgetItem.entity).toBe(entity);
      expect(widgetItem.widgetId).toBe(widgetId);
    });

    it('should get all properties including sources', () => {
      const entity = 'content';
      const widgetId = 'rfkid';
      const sources = ['source1', 'source2'] as ArrayOfAtLeastOne<string>;

      const widgetItem = new WidgetItem(entity, widgetId, sources);

      expect(widgetItem.entity).toBe(entity);
      expect(widgetItem.widgetId).toBe(widgetId);
      expect(widgetItem.sources).toEqual(sources);
    });

    it('should return undefined for sources when not provided', () => {
      const entity = 'content';
      const widgetId = 'rfkid';

      const widgetItem = new WidgetItem(entity, widgetId);

      expect(widgetItem.entity).toBe(entity);
      expect(widgetItem.widgetId).toBe(widgetId);
      expect(widgetItem.sources).toBeUndefined();
    });
  });
});
