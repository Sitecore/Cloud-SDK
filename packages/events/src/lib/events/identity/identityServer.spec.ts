import { identityServer } from './identityServer'; // Import the function to be tested
import * as core from '@sitecore-cloudsdk/core';
import { IdentityEventAttributesInput, IdentityEvent } from './identity-event';
import { sendEvent } from '../send-event/sendEvent';

jest.mock('../../initializer/server/initializer');
jest.mock('./identity-event');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('eventServer', () => {
  let eventData: IdentityEventAttributesInput;

  const extensionData = { extKey: 'extValue' };
  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      identifiers: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          expiryDate: undefined,
          id: '',
          provider: 'email',
        },
      ],
      language: 'EN',
      page: 'identity',
    };
  });

  const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValueOnce('1234');

  it('should send a custom event to the server', async () => {
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    await identityServer(eventData, req, extensionData);

    expect(getBrowserIdFromRequestSpy).toHaveBeenCalled();
    expect(IdentityEvent).toHaveBeenCalledTimes(1);
    expect(IdentityEvent).toHaveBeenCalledWith({
      eventData: {
        channel: 'WEB',
        currency: 'EUR',
        identifiers: [
          {
            expiryDate: undefined,
            id: '',
            provider: 'email',
          },
        ],
        language: 'EN',
        page: 'identity',
      },
      extensionData: {
        extKey: 'extValue',
      },
      id: '1234',
      sendEvent,
      settings: {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      },
    });
  });
});
