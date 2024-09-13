import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventServerModule from '@sitecore-cloudsdk/events/server';
import type { SearchEventEntity } from '../../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';
import { sendConversionEventServer } from './send-conversion-event-server';

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
    event: jest.fn().mockResolvedValue(null),
    init: jest.fn().mockResolvedValue(() => '')
  };
});

describe('sendConversionEventServer', () => {
  const httpRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn()
    }
  };

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

    await sendConversionEventServer(httpRequest, conversionEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
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
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await sendConversionEventServer(httpRequest, conversionEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
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
