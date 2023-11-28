import { eventServer } from './eventServer';
import { CustomEvent, ICustomEventInput } from './custom-event';
import * as init from '../../initializer/server/initializer';
import * as core from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../../ep/EventApiClient';

jest.mock('../../initializer/server/initializer');
jest.mock('./custom-event');

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
  let eventData: ICustomEventInput;
  const type = 'CUSTOM_TYPE';
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
      language: 'EN',
      page: 'races',
    };
  });

  const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValueOnce('1234');
  const eventApiClient = new EventApiClient('http://test.com', '123', '456');
  const settings: core.ISettings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };
  const getServerDependenciesSpy = jest.spyOn(init, 'getServerDependencies').mockReturnValueOnce({
    eventApiClient: eventApiClient,
    settings: settings,
  });

  it('should send a custom event to the server', async () => {
    await eventServer(type, eventData, req, extensionData);

    // Assert
    expect(getServerDependenciesSpy).toHaveBeenCalled();
    expect(getBrowserIdFromRequestSpy).toHaveBeenCalled();
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledWith({
      eventApiClient: new EventApiClient('http://test.com', '123', '456'),
      eventData: {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      },
      extensionData: {
        extKey: 'extValue',
      },
      id: '1234',
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
      type: 'CUSTOM_TYPE',
    });
  });
});
