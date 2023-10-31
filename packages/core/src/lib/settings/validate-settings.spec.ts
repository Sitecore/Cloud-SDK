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
      });
    }).toThrowError(`[MV-0001] "sitecoreEdgeContextId" is required.`);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: ' ',
      });
    }).toThrowError(`[MV-0001] "sitecoreEdgeContextId" is required.`);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: '1234',
      });
    }).toThrowError(`[MV-0002] "siteName" is required.`);
  });

  it("should throw error when the string provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: ' ',
        sitecoreEdgeContextId: '1234',
      });
    }).toThrowError(`[MV-0002] "siteName" is required.`);
  });
});
