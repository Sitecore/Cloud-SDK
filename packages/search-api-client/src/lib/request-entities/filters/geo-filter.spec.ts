import * as utils from '@sitecore-cloudsdk/utils';
import { GEO_FILTER_TYPE, GeoFilter } from './geo-filter';
import { ErrorMessages } from '../../const';

jest.mock('@sitecore-cloudsdk/utils', () => ({
  isValidLocation: jest.fn()
}));

describe('GeoFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should have the correct value for the type', () => {
    expect(GEO_FILTER_TYPE).toEqual('geoDistance');
  });

  it('should generate the filter properly with minimum params', () => {
    const filter = new GeoFilter('location');

    const result = filter.toDTO();

    const expected = {
      name: 'location',
      type: GEO_FILTER_TYPE
    };

    expect(result).toEqual(expected);
  });

  it('should generate the filter properly if empty geoFilterData is provided', () => {
    const filter = new GeoFilter('location', {});

    const result = filter.toDTO();

    const expected = {
      name: 'location',
      type: GEO_FILTER_TYPE
    };

    expect(result).toEqual(expected);
  });

  it('should generate the filter properly with distance param', () => {
    const filter = new GeoFilter('location', { distance: '122km' });

    const result = filter.toDTO();

    const expected = {
      distance: '122km',
      name: 'location',
      type: GEO_FILTER_TYPE
    };

    expect(result).toEqual(expected);
  });

  it('should generate the filter properly with location param', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: true });

    const filter = new GeoFilter('location', { location: { latitude: 90, longitude: 90 } });

    const result = filter.toDTO();

    const expected = {
      lat: 90,
      lon: 90,
      name: 'location',
      type: GEO_FILTER_TYPE
    };

    expect(result).toEqual(expected);
  });

  it('should throw error if invalid latitude is provided', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValue({ latitude: false, longitude: true });
    expect(() => {
      new GeoFilter('location', { location: { latitude: 900, longitude: 90 } });
    }).toThrow(ErrorMessages.IV_0012);
  });

  it('should throw error if invalid longitude is provided', () => {
    jest.spyOn(utils, 'isValidLocation').mockReturnValueOnce({ latitude: true, longitude: false });
    expect(() => {
      new GeoFilter('location', { location: { latitude: 90, longitude: 900 } });
    }).toThrow(ErrorMessages.IV_0013);
  });
});
