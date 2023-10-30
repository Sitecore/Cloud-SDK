import { validateSettings } from './validate-settings';

describe('validateSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw errors when provided mandatory settings with falsy values', () => {
    expect(() => {
      validateSettings({
        contextId: '',
        cookieDomain: '',
        siteId: '',
      });
    }).toThrowError(`[MV-0001] "contextId" is required.`);

    expect(() => {
      validateSettings({
        contextId: ' ',
        cookieDomain: '',
        siteId: '',
      });
    }).toThrowError(`[MV-0001] "contextId" is required.`);

    expect(() => {
      validateSettings({
        contextId: '1234',
        cookieDomain: '',
        siteId: '',
      });
    }).toThrowError(`[MV-0002] "siteId" is required.`);
  });

  it("should throw error when the string provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        contextId: '1234',
        cookieDomain: '',
        siteId: ' ',
      });
    }).toThrowError(`[MV-0002] "siteId" is required.`);
  });
});
