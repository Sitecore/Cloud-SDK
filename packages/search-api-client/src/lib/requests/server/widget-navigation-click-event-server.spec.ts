import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventServerModule from '@sitecore-cloudsdk/events/server';
import { event } from '@sitecore-cloudsdk/events/server';
import { widgetNavigationClickServer } from './widget-navigation-click-event-server';

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

describe('widgetNavigationClickServer', () => {
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
    widgetId: '12345'
  };
  const initEventsSpy = jest.spyOn(eventServerModule, 'init');

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' })
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue(undefined);

    await widgetNavigationClickServer(httpRequest, widgetNavigationEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
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

          rfk_id: widgetNavigationEventData.widgetId
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    });
  });

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await widgetNavigationClickServer(httpRequest, widgetNavigationEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
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

          rfk_id: widgetNavigationEventData.widgetId
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    });
  });
});
