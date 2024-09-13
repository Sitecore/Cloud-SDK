import { ErrorMessages } from '../consts';
import { WidgetNavigationEvent } from './widget-navigation-event';

describe('widget navigaiton event class', () => {
  const widgeNavigationEventData = {
    channel: 'WEB',
    currency: 'EUR',
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    widgetIdentifier: '12345'
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
              uri: widgeNavigationEventData.pathname
            }
          },
          index: widgeNavigationEventData.itemPosition,
          rfk_id: widgeNavigationEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    };

    const widgetNavigationEventDTO = new WidgetNavigationEvent(widgeNavigationEventData).toDTO();

    expect(widgetNavigationEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgeNavigationEventData,
      language: 'TEST'
    };

    expect(() => new WidgetNavigationEvent(invalidWidgetNavigationEventData)).toThrow(ErrorMessages.MV_0007);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgeNavigationEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetNavigationEvent(invalidWidgetNavigationEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgeNavigationEventData,
      language: undefined
    };

    expect(() => new WidgetNavigationEvent(invalidWidgetNavigationEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetNavigationEventData = {
      ...widgeNavigationEventData,
      currency: undefined
    };

    expect(() => new WidgetNavigationEvent(invalidWidgetNavigationEventData)).not.toThrow();
  });
});
