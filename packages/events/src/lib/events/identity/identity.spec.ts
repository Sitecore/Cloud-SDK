import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../../initializer/browser/initializer';
import { IdentityEvent } from './identity-event';
import { identity } from './identity';
import { sendEvent } from '../send-event/sendEvent';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('./identity-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IdentityEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse'))
      };
    })
  };
});

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

const getSettingsSpy = jest.spyOn(core, 'getSettings');
const id = 'test_id';
const identityData = {
  channel: 'WEB',
  currency: 'EUR',
  identifiers: [
    {
      expiryDate: undefined,
      id,
      provider: 'email'
    }
  ],
  language: 'EN',
  page: 'identity'
};

const extensionData = { extKey: 'extValue' };

afterEach(() => {
  jest.clearAllMocks();
});

describe('identity', () => {
  it('should send an IdentityEvent to the server', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

    getSettingsSpy.mockReturnValue({
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

    const response = await identity({ ...identityData, extensionData });

    expect(IdentityEvent).toHaveBeenCalledWith({
      id,
      identityData: { ...identityData, extensionData },
      sendEvent,
      settings: expect.objectContaining({})
    });
    expect(response).toBe('mockedResponse');
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', async () => {
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await identity({ ...identityData, extensionData })).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});
