import * as core from '@sitecore-cloudsdk/core';
import type { IdentityData} from './identity-event';
import { IdentityEvent } from './identity-event';
import { identityServer } from './identityServer'; // Import the function to be tested
import { sendEvent } from '../send-event/sendEvent';

jest.mock('../../initializer/server/initializer');
jest.mock('./identity-event');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
describe('eventServer', () => {
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

  const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValueOnce('1234');
  const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');

  it('should send a custom event to the server', async () => {
    getSettingsServerSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    });

    await identityServer(req, { ...identityData, extensionData });

    expect(getBrowserIdFromRequestSpy).toHaveBeenCalled();
    expect(IdentityEvent).toHaveBeenCalledTimes(1);
    expect(IdentityEvent).toHaveBeenCalledWith({
      id: '1234',
      identityData: { ...identityData, extensionData },
      sendEvent,
      settings: {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
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
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await identityServer(req, { ...identityData, extensionData })).rejects.toThrow(
      `[IE-0005] You must first initialize the "events/server" module. Run the "init" function.`
    );
  });
});
