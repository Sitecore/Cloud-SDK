// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { GeoFilterDTO, GeoFilterData } from './interfaces';
import { BaseFilter } from './base-filter';
import { ErrorMessages } from '../../consts';
import type { LocationData } from '../context/interfaces';
import { isValidLocation } from '@sitecore-cloudsdk/utils';

export const GEO_FILTER_TYPE = 'geoDistance';

/**
 * Creates a GeoFilter object which denotes the base of each filter.
 */
export class GeoFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param geoFilterData - The geo filter data like location and distance.
   */
  constructor(attributeName: string, geoFilterData?: GeoFilterData) {
    super(GEO_FILTER_TYPE, geoFilterData);

    if (geoFilterData?.location) this._validateLocation(geoFilterData.location);

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
