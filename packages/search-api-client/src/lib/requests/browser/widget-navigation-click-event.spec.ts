import { event } from '@sitecore-cloudsdk/events/browser';
import * as initializerModule from '../../initializer/browser/initializer';
import { widgetNavigationClick } from './widget-navigation-click-event';

jest.mock('@sitecore-cloudsdk/events/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn(),
    init: jest.fn()
  };
});

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn()
  };
});

describe('widgetNavigationClick', () => {
  const widgetNavigationEventData = {
    channel: 'WEB',
    currency: 'EUR',
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    widgetId: '12345'
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

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    await widgetNavigationClick(widgetNavigationEventData);

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
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
