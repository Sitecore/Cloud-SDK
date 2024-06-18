/* eslint-disable @typescript-eslint/naming-convention */
import * as createSettings from '../settings/create-settings';
import * as handleServer from '../cookie/handle-server-cookie';
import { getSettingsServer, initCoreServer, setCoreSettings } from './init-core-server';
import { CORE_NAMESPACE } from '../debug/namespaces';
import { ErrorMessages } from '../consts';
import type { ServerSettings } from '../settings/interfaces';
import debug from 'debug';

jest.mock('../cookie/handle-server-cookie');

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn(() => jest.fn(() => jest.fn())))
  };
});

describe('core-server', () => {
  const handleServerSpy = jest.spyOn(handleServer, 'handleServerCookie');
  let settingsInput: ServerSettings = {
    cookieDomain: 'cDomain',
    enableServerCookie: undefined,
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  };
  const createSettingsSpy = jest.spyOn(createSettings, 'createSettings').mockReturnValue({
    cookieSettings: {
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookieNames: { browserId: '', guestId: '' },
      cookiePath: '/path'
    },
    siteName: '4567',
    sitecoreEdgeContextId: '0123',
    sitecoreEdgeUrl: ''
  });

  beforeEach(() => {
    setCoreSettings(null as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettingsServer', () => {
    it('should throw an error when getSettingsServer are not initialized', () => {
      expect(() => getSettingsServer()).toThrow(ErrorMessages.IE_0008);
    });

    it('should return valid settings when they are initialized', async () => {
      expect(async () => {
        await initCoreServer(settingsInput, {} as any, {} as any);

        const _settings = getSettingsServer();
        expect(_settings).toBeDefined();
        expect(_settings?.sitecoreEdgeContextId).toBe('0123');
        expect(handleServerSpy).toHaveBeenCalledTimes(0);
        expect(handleServerSpy).not.toHaveBeenCalled();
      }).not.toThrow(ErrorMessages.IE_0008);
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
        timeout: 500
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
          cookieNames: { browserId: '', guestId: '' },
          cookiePath: '/path'
        },
        siteName: '4567',
        sitecoreEdgeContextId: '0123',
        sitecoreEdgeUrl: ''
      };

      await initCoreServer(settingsInput, request, response);

      const result = getSettingsServer();

      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSettings);

      await initCoreServer(settingsInput, request, response);
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:test' as a namespace`, async () => {
    const request = {} as any;
    const response = {} as any;

    const debugMock = debug as unknown as jest.Mock;

    await initCoreServer(settingsInput, request, response);

    expect(debugMock).toHaveBeenCalledTimes(1);
    expect(debugMock).toHaveBeenCalledWith(CORE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('initializing %o');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe('initCoreServer initialized');
  });
});
