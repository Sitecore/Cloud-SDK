import * as utils from '@sitecore-cloudsdk/utils';
import { GEO_FILTER_TYPE, GeoWithinFilter } from './geo-within-filter';
import { ErrorMessages } from '../../consts';

jest.mock('@sitecore-cloudsdk/utils', () => ({
  isValidLocation: jest.fn()
}));

describe('GeoWithinFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should have the correct value for the type', () => {
    expect(GEO_FILTER_TYPE).toEqual('geoWithin');
  });

  it('should generate the filter properly with 3 location objects', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValue({ latitude: true, longitude: true });

    const filter = new GeoWithinFilter('location', [
      { latitude: 40, longitude: 40 },
      { latitude: 50, longitude: 50 },
      { latitude: 60, longitude: 60 }
    ]);

    const result = filter.toDTO();

    const expected = {
      coordinates: [
        {
          lat: 40,
          lon: 40
        },
        {
          lat: 50,
          lon: 50
        },
        {
          lat: 60,
          lon: 60
        }
      ],
      name: 'location',
      type: GEO_FILTER_TYPE
    };

    expect(result).toEqual(expected);
  });

  it('should throw error if invalid latitude is provided', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValue({ latitude: false, longitude: true });
    expect(() => {
      new GeoWithinFilter('location', [
        { latitude: 999, longitude: 40 },
        { latitude: 50, longitude: 50 },
        { latitude: 60, longitude: 60 }
      ]);
    }).toThrow(ErrorMessages.IV_0012);
  });

  it('should throw error if invalid longitude is provided', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: false });
    expect(() => {
      new GeoWithinFilter('location', [
        { latitude: 40, longitude: 999 },
        { latitude: 50, longitude: 50 },
        { latitude: 60, longitude: 60 }
      ]);
    }).toThrow(ErrorMessages.IV_0013);
  });
});
