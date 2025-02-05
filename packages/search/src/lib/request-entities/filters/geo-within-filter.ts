// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { isValidLocation } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../consts';
import type { LocationData } from '../context/interfaces';
import { BaseFilter } from './base-filter';
import type { ArrayOfAtLeastThree, GeoWithinFilterData, GeoWithinFilterDTO, LocationDTO } from './interfaces';

export const GEO_FILTER_TYPE = 'geoWithin';

/**
 * Creates a GeoWithinFilter object which denotes the base of each filter.
 */
export class GeoWithinFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param geoWithinFilterData - The {@link GeoWithinFilterData}. Array of location objects.
   */
  constructor(attributeName: string, geoWithinFilterData: GeoWithinFilterData) {
    super(GEO_FILTER_TYPE, geoWithinFilterData);

    geoWithinFilterData.forEach((location) => this._validateLocation(location));

    this._attributeName = attributeName;
  }

  /**
   * Throws an error if latitude or longitude are not present.
   *
   * @param location - {@link LocationData}
   * @throws - {@link ErrorMessages.IV_0012} | {@link ErrorMessages.IV_0013}
   */
  private _validateLocation(location: LocationData) {
    const result = isValidLocation(location);

    if (!result.latitude) throw new Error(ErrorMessages.IV_0012);

    if (!result.longitude) throw new Error(ErrorMessages.IV_0013);
  }

  /**
   * @returns The DTO representation of the filter {@link GeoWithinFilterDTO}.
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
