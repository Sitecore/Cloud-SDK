import { ErrorMessages } from '../consts';
import { EntityViewEvent } from './entity-view-event';
import type { SearchEventEntity } from './interfaces';

describe('conversion event class', () => {
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

  it('should return a conversionEvent object mapped to its DTO', () => {
    const expected = {
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
    };

    const conversionEventDTO = new EntityViewEvent(entityViewEventData).toDTO();

    expect(conversionEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidConversionEventData = {
      ...entityViewEventData,
      language: 'TEST'
    };

    expect(() => new EntityViewEvent(invalidConversionEventData)).toThrow(ErrorMessages.IV_0011);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidConversionEventData = {
      ...entityViewEventData,
      currency: 'TEST'
    };

    expect(() => new EntityViewEvent(invalidConversionEventData)).toThrow(ErrorMessages.IV_0015);
  });
});
