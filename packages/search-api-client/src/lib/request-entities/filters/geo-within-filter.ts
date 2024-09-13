// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ArrayOfAtLeastThree, GeoWithinFilterDTO, GeoWithinFilterData, LocationDTO } from './interfaces';
import { BaseFilter } from './base-filter';
import { ErrorMessages } from '../../consts';
import type { LocationData } from '../context/interfaces';
import { isValidLocation } from '@sitecore-cloudsdk/utils';

export const GEO_FILTER_TYPE = 'geoWithin';

/**
 * Creates a GeoWithinFilter object which denotes the base of each filter.
 */
export class GeoWithinFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param geoWithinFilterData - The geo within filter data. Array of location objects.
   */
  constructor(attributeName: string, geoWithinFilterData: GeoWithinFilterData) {
    super(GEO_FILTER_TYPE, geoWithinFilterData);

    geoWithinFilterData.forEach((location) => this._validateLocation(location));

    this._attributeName = attributeName;
  }

  private _validateLocation(location: LocationData) {
    const result = isValidLocation(location);

    if (!result.latitude) throw new Error(ErrorMessages.IV_0012);

    if (!result.longitude) throw new Error(ErrorMessages.IV_0013);
  }

  /**
   * @returns The DTO representation of the filter.
   */
  toDTO(): GeoWithinFilterDTO {
    const dto: GeoWithinFilterDTO = {
      coordinates: (this.value as GeoWithinFilterData).map((location) => ({
        lat: location.latitude,
        lon: location.longitude
      })) as ArrayOfAtLeastThree<LocationDTO>,
      name: this._attributeName,
      type: GEO_FILTER_TYPE
    };

    return dto;
  }
}
