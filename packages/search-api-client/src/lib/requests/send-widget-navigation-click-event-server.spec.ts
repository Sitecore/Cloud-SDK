import { event } from '@sitecore-cloudsdk/events/server';
import { sendWidgetNavigationClickEventServer } from './send-widget-navigation-click-event-server';

jest.mock('@sitecore-cloudsdk/events/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn(),
    init: jest.fn().mockResolvedValue(() => '')
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

describe('sendWidgetNavigationClickEventServer', () => {
  const httpRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn()
    }
  };

  const widgetNavigationEventData = {
    channel: 'WEB',
    currency: 'EUR',
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    widgetIdentifier: '12345'
  };

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' })
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Sends a custom event with the correct values', async () => {
    await sendWidgetNavigationClickEventServer(httpRequest, widgetNavigationEventData);

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'navigation',
        value: {
          context: {
            page: {
              uri: widgetNavigationEventData.pathname
            }
          },
          index: widgetNavigationEventData.itemPosition,

          rfk_id: widgetNavigationEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    });
  });
});
