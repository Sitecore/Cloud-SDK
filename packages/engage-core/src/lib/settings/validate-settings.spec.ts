import { validateSettings } from './validate-settings';

describe('validateSettings', () => {
  it('should throw errors when provided mandatory settings with falsy values', () => {
    expect(() => {
      validateSettings({
        clientKey: '',
        cookieDomain: '',
        targetURL: '',
      });
    }).toThrowError(`[MV-0001] "clientKey" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        cookieDomain: '',
        targetURL: '',
      });
    }).toThrowError(`[MV-0002] "targetURL" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        cookieDomain: '',
        pointOfSale: ' ',
        targetURL: 'http://www.api.com',
      });
    }).toThrowError(`[MV-0009] "pointOfSale" cannot be empty.`);
  });

  it('should not throw error when the string provided for targetURL corresponds to a valid url', () => {
    expect(() => {
      validateSettings({
        clientKey: 'key',
        cookieDomain: 'cDomain',
        targetURL: 'http://www.api.com',
      });
    }).not.toThrowError(`[IV-0001] Incorrect value for "targetURL". Set the value to a valid URL string.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        cookieDomain: 'cDomain',
        targetURL: 'https://www.api.com',
      });
    }).not.toThrowError(`[IV-0001] Incorrect value for "targetURL". Set the value to a valid URL string.`);
  });

  it("should throw error when the string provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        clientKey: 'key',
        cookieDomain: 'cDomain',
        targetURL: 'www.api.com',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "targetURL". Set the value to a valid URL string.`);
  });
});
