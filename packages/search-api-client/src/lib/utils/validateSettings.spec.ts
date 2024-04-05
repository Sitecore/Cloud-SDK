import { ErrorMessages } from '../const';
import { ServerSettings, BrowserSettings } from '../types';
import { validateSettings } from './validateSettings';
import * as core from '@sitecore-cloudsdk/core';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

let windowSpy: jest.SpyInstance;
describe('validateSettings', () => {
  global.window = {} as any;
  beforeEach(() => {
    windowSpy = jest.spyOn(globalThis, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
    jest.clearAllMocks();
  });
  jest.spyOn(core, 'validateSettings');

  it('does not throw error for valid settings when all settings are passed', () => {
    const settings = { siteName: 'TestSite', sitecoreEdgeContextId: '123', userId: 'User1' };
    expect(() => validateSettings(settings)).not.toThrow();
    expect(core.validateSettings).toHaveBeenCalledTimes(1);
  });
  it('does not throw error for valid settings when not all settings are passed', () => {
    const settings = { siteName: 'TestSite', sitecoreEdgeContextId: '123' };
    expect(() => validateSettings(settings as BrowserSettings)).not.toThrow();
  });

  describe('Server environment', () => {
    beforeEach(() => {
      windowSpy.mockImplementation(() => undefined);
    });
    it('throws an error when userId is missing in server environment', () => {
      const settings = { siteName: 'TestSite', sitecoreEdgeContextId: '123' };
      expect(() => validateSettings(settings as unknown as ServerSettings)).toThrow(ErrorMessages.MV_0005);
    });

    it('does not throw error for valid settings in server environment', () => {
      const settings = { siteName: 'TestSite', sitecoreEdgeContextId: '123', userId: 'User1' };
      expect(() => validateSettings(settings)).not.toThrow();
    });

    it('throws an error with correctly joined messages for multiple validation failures', () => {
      try {
        validateSettings({} as ServerSettings);
      } catch (error: any) {
        expect(error.message).toBe('[MV-0001] "sitecoreEdgeContextId" is required.');
      }
    });
  });
});
