import { ErrorMessages } from '../consts';
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
        sitecoreEdgeUrl: ''
      });
    }).toThrow(ErrorMessages.MV_0001);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: ' ',
        sitecoreEdgeUrl: ''
      });
    }).toThrow(ErrorMessages.MV_0001);

    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ''
      });
    }).toThrow(ErrorMessages.MV_0002);
  });

  it("should throw error when the string provided for siteId doesn't correspond to a valid id", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: ' ',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test'
      });
    }).toThrow(ErrorMessages.MV_0002);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test'
      });
    }).toThrow(ErrorMessages.IV_0001);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ' '
      });
    }).toThrow(ErrorMessages.IV_0001);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: 'test'
      });
    }).toThrow(ErrorMessages.IV_0001);
  });

  it("should throw error when the sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url", () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ' '
      });
    }).toThrow(ErrorMessages.IV_0001);
  });

  it('should throw error when the sitecoreEdgeUrl provided for targetURL is empty string', () => {
    expect(() => {
      validateSettings({
        cookieDomain: '',
        siteName: '456',
        sitecoreEdgeContextId: '1234',
        sitecoreEdgeUrl: ''
      });
    }).toThrow(ErrorMessages.IV_0001);
  });
});
