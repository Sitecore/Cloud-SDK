import * as utils from '@sitecore-cloudsdk/utils';
import { Context } from './context';
import { ErrorMessages } from '../../const';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    __esModule: true,
    ...originalModule,
    isValidLocation: jest.fn()
  };
});

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

  describe('geo', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`should throw an error if invalid longitude`, () => {
      jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: false });

      expect(() => {
        new Context({ geo: { location: { latitude: 0, longitude: -999 } } });
      }).toThrow(ErrorMessages.IV_0013);
    });

    it(`should throw an error if invalid latitude`, () => {
      jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: false, longitude: true });

      expect(() => {
        new Context({ geo: { location: { latitude: -999, longitude: 0 } } });
      }).toThrow(ErrorMessages.IV_0012);
    });

    it(`should be set when used in during creation`, () => {
      jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: true });

      const expected = { ip: '1.1.1.1', location: { lat: -40, lon: 40 } };

      const context = new Context({ geo: { ip: '1.1.1.1', location: { latitude: -40, longitude: 40 } } });
      const result = context.toDTO().geo;

      expect(result).toEqual(expected);
    });
    it(`should set geo to undefined when removeGeo is called`, () => {
      jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: true });

      const context = new Context({});
      context.geo = { ip: '1.1.1.1', location: { latitude: -40, longitude: 40 } };

      context.removeGeo();

      const result = context.toDTO().geo;

      expect(result).toBeUndefined();
    });

    it(`should update geo`, () => {
      jest.spyOn(utils, 'isValidLocation').mockReturnValue({ latitude: true, longitude: true });

      const geo = { ip: '2.2.2.2', location: { lat: 20, lon: 20 } };

      const context = new Context({});
      context.geo = { ip: '1.1.1.1', location: { latitude: -40, longitude: 40 } };
      context.geo = { ip: '2.2.2.2', location: { latitude: 20, longitude: 20 } };

      const result = context.toDTO().geo;

      expect(result).toEqual(geo);
    });

    it(`should update geo without location`, () => {
      const isValidLocationSpy = jest
        .spyOn(utils, 'isValidLocation')
        .mockReturnValue({ latitude: true, longitude: true });

      const context = new Context({ geo: { ip: '1.1.1.1', location: { latitude: -40, longitude: 40 } } });
      context.geo = { ip: '2.2.2.2' };

      const result = context.toDTO().geo?.location;

      expect(result).toBeUndefined();
      expect(isValidLocationSpy).toHaveBeenCalledTimes(1);
    });

    describe('location', () => {
      let context: Context;
      const invalidLons = [-190, 190];
      const validLons = [-60, 60, -60.15, 60.15, -180, 180];
      const invalidLats = [-100, 100];
      const validLats = [-60, 60, -60.15, 60.15, 90, -90];

      beforeEach(() => {
        context = new Context({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`should be undefined if not set`, () => {
        const result = context.toDTO().geo?.location;

        expect(result).toBeUndefined();
      });

      it.each(validLons)(`should be present in the dto`, (lon) => {
        jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: true });

        const expected = { lat: 89.1234567, lon };

        context.geo = { location: { latitude: 89.1234567, longitude: lon } };
        const result = context.toDTO().geo?.location;

        expect(result).toEqual(expected);
      });

      it.each(invalidLons)(`should throw error if lon is invalid`, (lon) => {
        jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: false });

        expect(() => {
          context.geo = { location: { latitude: 60.11, longitude: lon } };
        }).toThrow(ErrorMessages.IV_0013);
      });

      it.each(validLats)(`should be present in the dto`, (lat) => {
        jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: true });

        const expected = { lat, lon: 100 };

        context.geo = { location: { latitude: lat, longitude: 100 } };
        const result = context.toDTO().geo?.location;

        expect(result).toEqual(expected);
      });
      it.each(invalidLats)(`should throw error if lat is invalid`, (lat) => {
        jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: false, longitude: true });

        expect(() => {
          context.geo = { location: { latitude: lat, longitude: 100 } };
        }).toThrow(ErrorMessages.IV_0012);
      });
    });

    describe('ip', () => {
      let context: Context;

      beforeEach(() => {
        context = new Context({});
      });

      it(`should be undefined if not set`, () => {
        const result = context.toDTO().geo?.ip;

        expect(result).toBeUndefined();
      });

      it(`should be present in the dto`, () => {
        const ip = '192.168.1.1';
        context.geo = { ip };

        const result = context.toDTO().geo?.ip;

        expect(result).toEqual(ip);
      });
    });
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
