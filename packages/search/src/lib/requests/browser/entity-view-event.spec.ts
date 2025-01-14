import * as browser from '@sitecore-cloudsdk/core/browser';
import * as core from '@sitecore-cloudsdk/core/internal';
import { event } from '@sitecore-cloudsdk/events/browser';
import type { SearchEventEntity } from '../../events/interfaces';
import * as initializerModule from '../../initializer/browser/initializer';
import { entityView } from './entity-view-event';

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

jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getBrowserId: jest.fn()
  };
});

describe('entityView', () => {
  jest.spyOn(browser, 'getBrowserId').mockReturnValue('test_id');

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

  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);

    const response = await entityView(entityViewEventData);

    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
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
  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);

    const response = await entityView(entityViewEventData);

    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
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
