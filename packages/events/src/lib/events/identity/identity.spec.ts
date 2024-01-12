import { identity } from './identity';
import * as core from '@sitecore-cloudsdk/core';
import { getDependencies } from '../../initializer/browser/initializer';
import { IdentityEvent } from './identity-event';

jest.mock('../../initializer/browser/initializer', () => {
  return {
    getDependencies: jest.fn(() => {
      return {
        eventApiClient: 'mockedEventApiClient',
        id: 'mockedId',
        settings: {},
      };
    }),
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

describe('identity', () => {
  it('should send an IdentityEvent to the server', async () => {
    const id = 'test_id';

    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
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

    const response = await identity(eventData, extensionData);

    expect(getDependencies).toHaveBeenCalled();
    expect(IdentityEvent).toHaveBeenCalledWith({
      eventApiClient: 'mockedEventApiClient',
      eventData,
      extensionData,
      id,
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });
});
