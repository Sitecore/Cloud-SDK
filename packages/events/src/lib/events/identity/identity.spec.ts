import { identity } from './identity';
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

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('identity', () => {
  it('should send an IdentityEvent to the server', async () => {
    const eventData = {
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
      pointOfSale: 'spinair.com',
    };

    const extensionData = { extKey: 'extValue' };

    const response = await identity(eventData, extensionData);

    expect(getDependencies).toHaveBeenCalled();
    expect(IdentityEvent).toHaveBeenCalledWith({
      eventApiClient: 'mockedEventApiClient',
      eventData,
      extensionData,
      id: 'mockedId',
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
  });
});
