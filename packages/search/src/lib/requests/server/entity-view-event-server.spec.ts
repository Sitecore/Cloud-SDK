import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { event } from '@sitecore-cloudsdk/events/server';
import type { SearchEventEntity } from '../../events/interfaces';
import { entityViewServer } from './entity-view-event-server';

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

describe('entityViewEventServer', () => {
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

  const entityViewEventData = {
    currency: 'EUR',
    entity: eventEntityData,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud'
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
  });

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await entityViewServer(httpRequest, entityViewEventData);

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        value: {
          context: {
            page: {
              uri: entityViewEventData.pathname
            }
          },
          entities: [
            {
              attributes: entityViewEventData.entity.attributes,
              entity_subtype: entityViewEventData.entity.entityType,
              entity_type: entityViewEventData.entity.entity,
              id: entityViewEventData.entity.id,
              source_id: entityViewEventData.entity.sourceId,
              uri: entityViewEventData.entity.uri
            }
          ]
        }
      },
      type: 'VIEW'
    });
  });
});
