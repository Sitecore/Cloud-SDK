/* eslint-disable @typescript-eslint/naming-convention */
import { getSettingsServer, initCoreServer, setCoreSettings } from './init-core-server';
import { ISettingsParamsServer } from '../settings/interfaces';
import * as handleServer from '../cookie/handle-server-cookie';
import * as createSettings from '../settings/create-settings';

jest.mock('../cookie/handle-server-cookie');

describe('core-server', () => {
  const handleServerSpy = jest.spyOn(handleServer, 'handleServerCookie');
  let settingsInput: ISettingsParamsServer = {
    cookieDomain: 'cDomain',
    enableServerCookie: undefined,
    siteName: '456',
    sitecoreEdgeContextId: '123',
  };
  const createSettingsSpy = jest.spyOn(createSettings, 'createSettings').mockReturnValue({
    cookieSettings: {
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookieName: '',
      cookiePath: '/path',
    },
    siteName: '4567',
    sitecoreEdgeContextId: '0123',
  });

  beforeEach(() => {
    setCoreSettings(null as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettingsServer', () => {
    it('should throw an error when getSettingsServer are not initialized', () => {
      expect(() => getSettingsServer()).toThrow(
        '[IE-0005] You must first initialize the "core" module. Run the "initServer" function.'
      );
    });

    it('should return valid settings when they are initialized', async () => {
      expect(async () => {
        await initCoreServer(settingsInput, {} as any, {} as any);

        const _settings = getSettingsServer();
        expect(_settings).toBeDefined();
        expect(_settings?.sitecoreEdgeContextId).toBe('0123');
        expect(handleServerSpy).toHaveBeenCalledTimes(0);
        expect(handleServerSpy).not.toHaveBeenCalled();
      }).not.toThrow('[IE-0005] You must first initialize the "core" module. Run the "initServer" function.');
    });
  });
  describe('initCoreServer', () => {
    it('should create and initialize settings properly', async () => {
      const request = {} as any;
      const response = {} as any;

      await initCoreServer(settingsInput, request, response);
      const _settings = getSettingsServer();
      expect(_settings).toBeDefined();
      expect(_settings?.sitecoreEdgeContextId).toBe('0123');
      expect(handleServerSpy).toHaveBeenCalledTimes(0);
    });

    it('should call handle server cookie when enableServerCookie is true', async () => {
      settingsInput = {
        ...settingsInput,
        enableServerCookie: true,
        timeout: 500,
      };
      const request = {} as any;
      const response = {} as any;

      await initCoreServer(settingsInput, request, response);
      const _settings = getSettingsServer();
      expect(_settings).toBeDefined();
      expect(_settings?.sitecoreEdgeContextId).toBe('0123');
      expect(handleServerSpy).toHaveBeenCalledTimes(1);
      expect(handleServerSpy).toHaveBeenCalledWith(request, response, settingsInput.timeout);
    });

    it('should not call create settings if settings have a value', async () => {
      const request = {} as any;
      const response = {} as any;

      const mockSettings = {
        cookieSettings: {
          cookieDomain: 'domain',
          cookieExpiryDays: 40,
          cookieName: '',
          cookiePath: '/path',
        },
        siteName: '4567',
        sitecoreEdgeContextId: '0123',
      };

      await initCoreServer(settingsInput, request, response);

      const result = getSettingsServer();

      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSettings);

      await initCoreServer(settingsInput, request, response);
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
