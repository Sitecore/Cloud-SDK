import { ErrorMessages } from '../consts';
import { WidgetNavigationClickEvent } from './widget-navigation-click-event';

describe('widget navigation event class', () => {
  const widgetNavigationEventData = {
    channel: 'WEB',
    currency: 'EUR',
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    widgetId: '12345'
  };

  it('should return a widgetItemEvent object mapped to its DTO', () => {
    const expected = {
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
    };

    const widgetNavigationEventDTO = new WidgetNavigationClickEvent(widgetNavigationEventData).toDTO();

    expect(widgetNavigationEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgetNavigationEventData,
      language: 'TEST'
    };

    expect(() => new WidgetNavigationClickEvent(invalidWidgetNavigationEventData)).toThrow(ErrorMessages.IV_0011);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgetNavigationEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetNavigationClickEvent(invalidWidgetNavigationEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgetNavigationEventData,
      language: undefined
    };

    expect(() => new WidgetNavigationClickEvent(invalidWidgetNavigationEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgetNavigationEventData,
      currency: undefined
    };

    expect(() => new WidgetNavigationClickEvent(invalidWidgetNavigationEventData)).not.toThrow();
  });
});
