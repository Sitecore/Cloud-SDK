import { validateSettings } from './validate-settings';

describe('validateSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw errors when provided mandatory settings with falsy values', () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: '',
        sitecoreEdgeUrl: '',
      });
    }).toThrowError(`[MV-0001] "sitecoreEdgeContextId" is required.`);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: ' ',
        sitecoreEdgeUrl: '',
      });
    }).toThrowError(`[MV-0001] "sitecoreEdgeContextId" is required.`);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: '',
      });
    }).toThrowError(`[MV-0002] "siteName" is required.`);
  });

  it("should throw error when the string provided for siteId doesn't correspond to a valid id", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: ' ',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test',
      });
    }).toThrowError(`[MV-0002] "siteName" is required.`);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ' ',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ' ',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`);
  });

  it('should throw error when the sitecoreEdgeUrl provided for targetURL is empty string', () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: '',
      });
    }).toThrowError(`[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`);
  });
});
