import * as core from '@sitecore-cloudsdk/core/internal';
import * as eventsBrowserModule from '@sitecore-cloudsdk/events/browser';
import * as initializerModule from '../../init/browser/initializer';
import type { SearchEventEntity } from '../../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/browser';
import { sendConversionEvent } from './send-conversion-event';

jest.mock('@sitecore-cloudsdk/events/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn().mockResolvedValue(null),
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

describe('sendConversionEvent', () => {
  jest.spyOn(core, 'getBrowserId').mockReturnValue('test_id');

  const eventEntityData: SearchEventEntity = {
    attributes: {
      author: 'ABC'
    },
    entity: 'category',
    entityType: 'subcat',
    id: '123',
    sourceId: '534',
    uri: 'https://www.sitecore.com/products/content-cloud3333333'
  };

  const conversionEventData = {
    currency: 'EUR',
    entity: eventEntityData,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud'
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
  });

  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);

    const response = await sendConversionEvent(conversionEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_sub_type: 'conversion',
        value: {
          context: {
            page: {
              uri: conversionEventData.pathname
            }
          },
          entities: [
            {
              attributes: conversionEventData.entity.attributes,
              entity_subtype: conversionEventData.entity.entityType,
              entity_type: conversionEventData.entity.entity,
              id: conversionEventData.entity.id,
              source_id: conversionEventData.entity.sourceId,
              uri: conversionEventData.entity.uri
            }
          ]
        }
      },
      type: 'VIEW'
    });
  });
  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);

    const response = await sendConversionEvent(conversionEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_sub_type: 'conversion',
        value: {
          context: {
            page: {
              uri: conversionEventData.pathname
            }
          },
          entities: [
            {
              attributes: conversionEventData.entity.attributes,
              entity_subtype: conversionEventData.entity.entityType,
              entity_type: conversionEventData.entity.entity,
              id: conversionEventData.entity.id,
              source_id: conversionEventData.entity.sourceId,
              uri: conversionEventData.entity.uri
            }
          ]
        }
      },
      type: 'VIEW'
    });
  });
});
