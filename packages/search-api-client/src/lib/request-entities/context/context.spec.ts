import { Context } from './context';
import { ErrorMessages } from '../../const';

describe('context request data creation', () => {
  let contextInstance: Context;

  const context = {
    locale: {
      country: 'us',
      language: 'us'
    },
    page: {
      custom: {
        test: '123'
      },
      uri: 'http://acbd.com'
    },
    store: {
      groupId: '1234',
      id: '123'
    }
  };

  beforeEach(() => {
    contextInstance = new Context({});
  });

  describe('campaign', () => {
    it(`should be undefined if not set`, () => {
      expect(contextInstance.campaign).toBeUndefined();
    });

    it(`should be present in dto if at least one attribute is set`, () => {
      contextInstance.campaign = { campaign: 'campaign' };

      expect(contextInstance.toDTO().campaign).toBeDefined();
    });

    it(`should include all set attributes in the dto`, () => {
      const expectedDTO = {
        utm_campaign: 'campaign',
        utm_content: 'content',
        utm_medium: 'medium',
        utm_source: 'source',
        utm_term: 'term'
      };

      contextInstance.campaign = {
        campaign: 'campaign',
        content: 'content',
        medium: 'medium',
        source: 'source',
        term: 'term'
      };

      const result = contextInstance.toDTO().campaign;

      expect(result).toStrictEqual(expectedDTO);
    });

    it(`should set the campaign to undefined when removeCampaign is called`, () => {
      contextInstance.campaign = {
        campaign: 'campaign',
        content: 'content',
        medium: 'medium',
        source: 'source',
        term: 'term'
      };

      contextInstance.removeCampaign();

      const result = contextInstance.toDTO().campaign;

      expect(result).toBeUndefined();
    });
  });

  describe('locale set and reset', () => {
    it(`should be undefined if not set`, () => {
      expect(contextInstance.locale).toBeUndefined();
    });

    it(`should locale object be present in dto if both attributes are set`, () => {
      contextInstance.locale = { country: 'US', language: 'us' };

      expect(contextInstance.toDTO().locale).toBeDefined();
    });

    it('should update locale object when country property is valid', () => {
      const newContext = new Context(context);
      newContext.locale = { country: 'EN', language: 'us' };

      expect(newContext.toDTO().locale?.country).toBe('EN');
      expect(newContext.toDTO().locale?.language).toBe('us');
    });

    it('should update locale object when language property is valid', () => {
      const newContext = new Context(context);
      newContext.locale = { country: 'EN', language: 'gr' };

      expect(newContext.toDTO().locale?.country).toBe('EN');
      expect(newContext.toDTO().locale?.language).toBe('gr');
    });

    it('should throw an error when locale object is updated with invalid country information', () => {
      const newContext = new Context(context);

      expect(() => (newContext.locale = { ...context.locale, country: 'ussss' })).toThrow(ErrorMessages.MV_0006);
    });

    it('should throw an error when locale object is updated with invalid language information', () => {
      const newContext = new Context(context);

      expect(() => (newContext.locale = { ...context.locale, language: 'ussss' })).toThrow(ErrorMessages.MV_0007);
    });

    it(`should set the locale to undefined when removeLocale is called`, () => {
      contextInstance.locale = { country: 'en', language: 'en' };
      contextInstance.removeLocale();

      const result = contextInstance.toDTO().locale;

      expect(result).toBeUndefined();
    });
  });

  describe('validator', () => {
    it(`should not throw an error if all properties are correct`, () => {
      expect(() => new Context(context)).not.toThrow();
    });

    it(`should throw an error if one of the 'locale' properties (country, language) is invalid`, () => {
      const invalidContext1 = {
        ...context,
        locale: {
          country: 'us',
          language: ''
        }
      };

      const invalidContext2 = {
        ...context,
        locale: {
          country: '',
          language: 'us'
        }
      };

      const invalidContext3 = {
        ...context,
        locale: {
          country: 'usss',
          language: 'us'
        }
      };

      const invalidContext4 = {
        ...context,
        locale: {
          country: 'us',
          language: 'us123'
        }
      };

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0007);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0006);
      expect(() => new Context(invalidContext3)).toThrow(ErrorMessages.MV_0006);
      expect(() => new Context(invalidContext4)).toThrow(ErrorMessages.MV_0007);
    });

    it(`should throw an error if one of the 'page' properties (custom, uri) is set (with valid value) and the other is empty`, () => {
      const invalidContext1 = {
        ...context,
        ...{
          page: {
            custom: {},
            uri: 'https://test.com'
          }
        }
      };

      const invalidContext2 = {
        ...context,
        ...{
          page: {
            custom: { test: 123 },
            uri: ''
          }
        }
      };

      const invalidContext3 = {
        ...context,
        ...{
          page: {
            custom: { test: 123 },
            uri: 'httpppp://test.com'
          }
        }
      };

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0008);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0008);
      expect(() => new Context(invalidContext3)).toThrow(ErrorMessages.MV_0008);
    });

    it(`should not throw an error if the 'page' object is empty`, () => {
      const validContext = {
        ...context,
        page: {}
      };

      expect(() => new Context(validContext)).not.toThrow();
    });

    it(`should throw an error if one of the 'store' properties (groupId, id) is set and the other is empty`, () => {
      const invalidContext1 = {
        ...context,
        ...{
          store: {
            groupId: '123',
            id: ''
          }
        }
      };

      const invalidContext2 = {
        ...context,
        ...{
          store: {
            groupId: '',
            id: '12'
          }
        }
      };

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0009);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0009);
    });

    it(`should not throw an error if the 'store' object is empty`, () => {
      const validContext = {
        ...context,
        store: {}
      };

      expect(() => new Context(validContext)).not.toThrow();
    });
  });

  describe('mapper', () => {
    it('should return the context object mapped', () => {
      const expected = {
        ...context,
        store: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          group_id: '1234',
          id: '123'
        }
      };
      const result = new Context(context).toDTO();
      expect(result).toEqual(expected);
    });
  });
});
