// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { isValidLocation } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../consts';
import type { LocationData } from '../context/interfaces';
import { BaseFilter } from './base-filter';
import type { GeoFilterData, GeoFilterDTO } from './interfaces';

export const GEO_FILTER_TYPE = 'geoDistance';

/**
 * Creates a GeoFilter object which denotes the base of each filter.
 */
export class GeoFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param geoFilterData - The {@link GeoFilterData} like location and distance.
   */
  constructor(attributeName: string, geoFilterData?: GeoFilterData) {
    super(GEO_FILTER_TYPE, geoFilterData);

    if (geoFilterData?.location) this._validateLocation(geoFilterData.location);

    this._attributeName = attributeName;
  }

  /**
   * Throws an error if latitude or longitude are not present.
   * @param location - {@link LocationData}
   * @throws - {@link ErrorMessages.IV_0012} | {@link ErrorMessages.IV_0013}
   */
  private _validateLocation(location: LocationData) {
    const result = isValidLocation(location);

    if (!result.latitude) throw new Error(ErrorMessages.IV_0012);

    if (!result.longitude) throw new Error(ErrorMessages.IV_0013);
  }

  /**
   * @returns The DTO representation of the filter {@link GeoFilterDTO}.
   */
  toDTO(): GeoFilterDTO {
    const dto: GeoFilterDTO = {
      name: this._attributeName,
      type: GEO_FILTER_TYPE
    };

    if (this.value && (this.value as GeoFilterData).distance) dto.distance = (this.value as GeoFilterData).distance;

    if (this.value && (this.value as GeoFilterData).location) {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      dto.lat = (this.value as GeoFilterData).location!.latitude;
      dto.lon = (this.value as GeoFilterData).location!.longitude;
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }

    return dto;
  }
}
