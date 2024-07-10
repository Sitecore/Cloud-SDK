import { ConversionEvent } from './conversion-event';
import { ErrorMessages } from '../const';
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

  const conversionEventData = {
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
    };

    const conversionEventDTO = new ConversionEvent(conversionEventData).toDTO();

    expect(conversionEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidConversionEventData = {
      ...conversionEventData,
      language: 'TEST'
    };

    expect(() => new ConversionEvent(invalidConversionEventData)).toThrow(ErrorMessages.MV_0007);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidConversionEventData = {
      ...conversionEventData,
      currency: 'TEST'
    };

    expect(() => new ConversionEvent(invalidConversionEventData)).toThrow(ErrorMessages.IV_0015);
  });
});
