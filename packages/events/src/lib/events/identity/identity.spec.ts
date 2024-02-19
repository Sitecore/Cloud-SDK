import { identity } from './identity';
import * as core from '@sitecore-cloudsdk/core';
import { IdentityEvent } from './identity-event';
import { sendEvent } from '../send-event/sendEvent';
import * as initializerModule from '../../initializer/browser/initializer';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('./identity-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IdentityEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
  };
});

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

const getSettingsSpy = jest.spyOn(core, 'getSettings');
const id = 'test_id';
const eventData = {
  channel: 'WEB',
  currency: 'EUR',
  identifiers: [
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiryDate: undefined,
      id,
      provider: 'email',
    },
  ],
  language: 'EN',
  page: 'identity',
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
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    const response = await identity(eventData, extensionData);

    expect(IdentityEvent).toHaveBeenCalledWith({
      eventData,
      extensionData,
      id,
      sendEvent,
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await identity(eventData, extensionData)).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});
