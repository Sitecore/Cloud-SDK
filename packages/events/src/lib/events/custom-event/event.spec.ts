import { event } from './event';
import { CustomEvent, ICustomEventInput } from './custom-event';
import * as init from '../../initializer/browser/initializer';
import { EventApiClient } from '../../cdp/EventApiClient';
import { EventQueue } from '../../eventStorage/eventStorage';

jest.mock('../../initializer/browser/initializer');
jest.mock('./custom-event');

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

  const eventApiClient = new EventApiClient('http://test.com', '123', '456');
  const eventQueue = new EventQueue(sessionStorage, eventApiClient);
  const settings = {
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
  const getServerDependenciesSpy = jest.spyOn(init, 'getDependencies').mockReturnValueOnce({
    eventApiClient: eventApiClient,
    eventQueue: eventQueue,
    id: '123',
    settings: settings,
  });

  it('should send a custom event to the server', async () => {
    await event(type, eventData, extensionData);

    expect(getServerDependenciesSpy).toHaveBeenCalled();
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
      id: '123',
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
    expect(CustomEvent).toHaveBeenCalledTimes(1);
  });
});
