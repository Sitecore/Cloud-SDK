// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Facet, SearchWidgetItemDTO } from './interfaces';
import { ErrorMessages } from '../../const';
import { WidgetItem } from './widget-item';

export class SearchWidgetItem extends WidgetItem {
  private _all?: boolean;
  private _max?: number;
  /**
   * Creates and holds the functionality of a search widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param facet - The widget's facet options.
   *
   */
  constructor(entity: string, rfkId: string, facet?: Facet) {
    super(entity, rfkId);

    if (facet?.max !== undefined) {
      this._validateMax(facet.max);
      this._max = facet.max;
    }

    if (facet?.all !== undefined) this._all = facet.all;
  }

  private _validateMax(max: number) {
    if (max < 1 || max > 100) throw new Error(ErrorMessages.IV_0014);
  }

  /**
   * Sets the search facet for the SearchWidgetItem.
   * This method updates the `facet` property of the search configuration within the SearchWidgetItem instance.
   *
   * @param facet - The object to set as the search facet.
   * @throws Error If the max is less than 1 or greater than 100, indicating an invalid range.
   */
  set facet(facet: Facet) {
    if (typeof facet.max === 'number') this._validateMax(facet.max);

    this._all = facet.all;
    this._max = facet.max;
  }

  /**
   * Sets the facet data to undefined
   */
  removeFacet() {
    this._all = undefined;
    this._max = undefined;
  }

  /**
   * Maps the search widget item to its DTO format.
   */
  toDTO(): SearchWidgetItemDTO {
    const superDTO = super.toDTO();
    const facet = {
      all: this._all,
      max: this._max
    };

    if (!Object.values(facet).filter((value) => value !== undefined).length) return superDTO;

    return { ...superDTO, search: { ...superDTO.search, facet } };
  }
}
