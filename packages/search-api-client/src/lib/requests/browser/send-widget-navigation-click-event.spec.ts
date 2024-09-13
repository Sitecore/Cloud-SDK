import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventsBrowserModule from '@sitecore-cloudsdk/events/browser';
import * as initializerModule from '../../init/browser/initializer';
import { event } from '@sitecore-cloudsdk/events/browser';
import { sendWidgetNavigationClickEvent } from './send-widget-navigation-click-event';

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

describe('sendWidgetNavigationClickEvent', () => {
  jest.spyOn(coreInternalModule, 'getBrowserId').mockReturnValue('test_id');

  const widgetNavigationEventData = {
    channel: 'WEB',
    currency: 'EUR',
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    widgetIdentifier: '12345'
  };
  const initEventsSpy = jest.spyOn(eventsBrowserModule, 'init');

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
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue(undefined);

    await sendWidgetNavigationClickEvent(widgetNavigationEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
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
          rfk_id: widgetNavigationEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    });
  });

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);

    await sendWidgetNavigationClickEvent(widgetNavigationEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
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
          rfk_id: widgetNavigationEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    });
  });
});
