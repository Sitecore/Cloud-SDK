// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type { Facet, FacetSort, FacetType, SearchWidgetItemDTO } from './interfaces';
import { WidgetItem } from './widget-item';

export class SearchWidgetItem extends WidgetItem {
  private _all?: boolean;
  private _max?: number;
  private _coverage?: boolean;
  private _sort?: FacetSort;
  private _types?: ArrayOfAtLeastOne<FacetType>;
  /**
   * Creates and holds the functionality of a search widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param facet - The widget's facet options.
   *
   */
  constructor(entity: string, rfkId: string, facet?: Facet) {
    super(entity, rfkId);

    if (!facet || !Object.keys(facet).length) return;

    if (typeof facet.max === 'number') {
      this._validateMax(facet.max);
      this._max = facet.max;
    }

    if (facet.types) {
      this._validateFacetTypes(facet.types);
      this._types = facet.types;
    }

    this._all = facet.all;
    this._coverage = facet.coverage;
    this._sort = facet.sort;
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

    if (facet.types) {
      this._validateFacetTypes(facet.types);
      this._types = facet.types;
    }

    this._all = facet.all;
    this._max = facet.max;
    this._coverage = facet.coverage;
    this._sort = facet.sort;
  }

  /**
   * Validates the facet type fields. Throws an errors if incorrect values are provided.
   */
  private _validateFacetTypes(types: ArrayOfAtLeastOne<FacetType>) {
    types.forEach((type) => {
      if (!type.name || type.name.includes(' ')) throw new Error(ErrorMessages.IV_0016);

      if (typeof type.max === 'number' && (type.max < 1 || type.max > 100)) throw new Error(ErrorMessages.IV_0017);
    });
  }

  /**
   * Sets the facet data to undefined
   */
  removeFacet() {
    this._all = undefined;
    this._max = undefined;
    this._coverage = undefined;
    this._sort = undefined;
    this._types = undefined;
  }

  /**
   * Maps the search widget item to its DTO format.
   */
  toDTO(): SearchWidgetItemDTO {
    const superDTO = super.toDTO();
    const facet = {
      all: this._all,
      coverage: this._coverage,
      max: this._max,
      sort: this._sort,
      types: this._types
    };

    if (!Object.values(facet).filter((value) => value !== undefined).length) return superDTO;

    return { ...superDTO, search: { ...superDTO.search, facet } };
  }
}
