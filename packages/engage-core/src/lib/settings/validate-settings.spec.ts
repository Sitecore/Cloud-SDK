import { validateSettings } from './validate-settings';

describe('validateSettings', () => {
  it('should throw errors when provided mandatory settings with falsy values', () => {
    expect(() => {
      validateSettings({
        clientKey: '',
        contextId: '',
        cookieDomain: '',
        siteId: '',
      });
    }).toThrowError(`[MV-0001] "clientKey" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        contextId: '',
        cookieDomain: '',
        pointOfSale: ' ',
        siteId: '',
      });
    }).toThrowError(`[MV-0009] "pointOfSale" cannot be empty.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        contextId: '',
        cookieDomain: '',
        pointOfSale: 'test',
        siteId: '',
      });
    }).toThrowError(`[MV-0001] "contextId" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        contextId: ' ',
        cookieDomain: '',
        pointOfSale: 'test',
        siteId: '',
      });
    }).toThrowError(`[MV-0001] "contextId" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        contextId: '1234',
        cookieDomain: '',
        pointOfSale: 'test',
        siteId: '',
      });
    }).toThrowError(`[MV-0002] "siteId" is required.`);

    expect(() => {
      validateSettings({
        clientKey: 'key',
        contextId: '1234',
        cookieDomain: '',
        pointOfSale: 'test',
        siteId: ' ',
      });
    }).toThrowError(`[MV-0002] "siteId" is required.`);
  });
});
