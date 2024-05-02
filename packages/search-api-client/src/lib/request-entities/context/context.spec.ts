import { Context } from './context';
import { ErrorMessages } from '../../const';

describe('context request data creation', () => {
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

  describe('validator', () => {
    it(`should not throw an error if all properties are correct`, () => {
      expect(() => new Context(context)).not.toThrow();
    });

    it(`should throw an error if one of the 'locale' properties (country, language) is set and the other is empty`, () => {
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

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0006);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0006);
    });

    it(`should not throw an error if the 'locale' object is empty`, () => {
      const validContext = {
        ...context,
        locale: {}
      };

      expect(() => new Context(validContext)).not.toThrow();
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

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0007);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0007);
      expect(() => new Context(invalidContext3)).toThrow(ErrorMessages.MV_0007);
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

      expect(() => new Context(invalidContext1)).toThrow(ErrorMessages.MV_0008);
      expect(() => new Context(invalidContext2)).toThrow(ErrorMessages.MV_0008);
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
