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
