// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { FacetFilter } from '../../widgets/interfaces';
import type { FacetFilterBase, NotFacetFilterDTO } from './interfaces';

export class NotFacetFilter implements FacetFilterBase {
  private _value: string | FacetFilter;

  /**
   * @param value - the {@link FacetFilter} | string to check against to.
   */
  constructor(value: string | FacetFilter) {
    this._value = value;
  }

  /**
   *
   * @returns the DTO represantation of notFacetFilter {@link NotFacetFilterDTO}.
   */
  toDTO(): NotFacetFilterDTO {
    /**
     * If the value is a string, it probably means that it is a facet filter id.
     * Otherwise, it is a facet filter object, so we need to convert it to DTO.
     * @example facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoicHJvZHVjdCIsInZhbHVlIjoiQ0RQIn0=
     * @example \{"type": "not", "filter": \{ "type": "eq", "value": "test" \}\}
     */
    const filter = typeof this._value === 'string' ? this._value : this._value.toDTO();
    return {
      filter,
      type: 'not'
    };
  }
}
