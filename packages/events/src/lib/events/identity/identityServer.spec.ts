import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages } from '../../consts';
// Import the function to be tested
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';
import { identityServer } from './identityServer';

jest.mock('../../init/server/initializer');
jest.mock('./identity-event');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn()
  };
});

jest.mock('@sitecore-cloudsdk/core/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('identityServer', () => {
  let identityData: IdentityData;

  const extensionData = { extKey: 'extValue' };
  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined
    },
    headers: {
      get: () => '',
      host: ''
    },
    ip: undefined,
    url: ''
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    identityData = {
      channel: 'WEB',
      currency: 'EUR',
      identifiers: [
        {
          expiryDate: undefined,
          id: '',
          provider: 'email'
        }
      ],
      language: 'EN',
      page: 'identity'
    };
  });

  describe('old init', () => {
    const getCookieValueFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');
    const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = null;
    });

    it('should send a custom event to the server', async () => {
      getSettingsServerSpy.mockReturnValue({
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
          cookiePath: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      });

      await identityServer(req, { ...identityData, extensionData });

      expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
      expect(IdentityEvent).toHaveBeenCalledTimes(1);
      expect(IdentityEvent).toHaveBeenCalledWith({
        id: '1234',
        identityData: { ...identityData, extensionData },
        sendEvent,
        settings: {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
            cookiePath: '/'
          },
          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: ''
        }
      });
    });

    it('should throw error if settings have not been configured properly', async () => {
      getSettingsServerSpy.mockImplementation(() => {
        throw new Error(ErrorMessages.IE_0008);
      });

      await expect(async () => await identityServer(req, { ...identityData, extensionData })).rejects.toThrow(
        ErrorMessages.IE_0015
      );
    });
  });

  describe('new init', () => {
    const newSettings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    };

    const getCookieValueFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = {};
    });

    it('should send a custom event to the server', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

      await identityServer(req, { ...identityData, extensionData });

      expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
      expect(IdentityEvent).toHaveBeenCalledTimes(1);
      expect(IdentityEvent).toHaveBeenCalledWith({
        id: '1234',
        identityData: { ...identityData, extensionData },
        sendEvent,
        settings: newSettings
      });
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await expect(async () => await identityServer(req, { ...identityData, extensionData })).rejects.toThrow(
        'Test error'
      );
    });
    it('should throw error new init used but events not initialized', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(
        () =>
          ({
            cookieSettings: { names: { browserId: 'test' } }
          } as any)
      );

      await expect(async () => await identityServer(req, { ...identityData, extensionData })).rejects.toThrow(
        ErrorMessages.IE_0015
      );

      expect(IdentityEvent).not.toHaveBeenCalled();
    });
  });
});
