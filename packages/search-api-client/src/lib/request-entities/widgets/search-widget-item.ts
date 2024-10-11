// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type { Facet, FacetDTO, FacetSort, FacetType, FacetTypeDTO, SearchWidgetItemDTO } from './interfaces';
import { WidgetItem } from './widget-item';

export class SearchWidgetItem extends WidgetItem {
  private _all?: boolean;
  private _max?: number;
  private _coverage?: boolean;
  private _sort?: FacetSort;
  private _types?: ArrayOfAtLeastOne<FacetType>;

  /**
   * Builds the sort piece of the DTO.
   */
  private _sortToDTO(type: FacetType) {
    if (type.sort)
      return {
        after: type.sort.after,
        sort: { name: type.sort.name, order: type.sort.order }
      };
    return {};
  }

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

    this._validateNumberInRange1To100(ErrorMessages.IV_0014, facet.max);

    if (facet.types) {
      this._validateFacetTypes(facet.types);
      this._types = facet.types;
    }

    this._max = facet.max;
    this._all = facet.all;
    this._coverage = facet.coverage;
    this._sort = facet.sort;
  }

  /**
   * Sets the search facet for the SearchWidgetItem.
   * This method updates the `facet` property of the search configuration within the SearchWidgetItem instance.
   *
   * @param facet - The object to set as the search facet.
   * @throws Error If the max is less than 1 or greater than 100, indicating an invalid range.
   */
  set facet(facet: Facet) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0014, facet.max);

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

      if (typeof type.keyphrase === 'string' && !type.keyphrase) throw new Error(ErrorMessages.IV_0018);

      this._validateNumberInRange1To100(ErrorMessages.IV_0017, type.max);
      this._validateNumberInRange1To100(ErrorMessages.IV_0019, type.minCount);
      if (typeof type.sort === 'object' && typeof type.sort.after === 'string') {
        if (!type.sort.after || type.sort.after.includes(' ')) throw new Error(ErrorMessages.IV_0020);
        if (type.sort.name !== 'text') throw new Error(ErrorMessages.IV_0021);
      }
    });
  }

  private _validateNumberInRange1To100(errorMessage: ErrorMessages, num?: number) {
    if (typeof num === 'number' && (num < 1 || num > 100)) throw new Error(errorMessage);
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
    const facet: FacetDTO = {
      all: this._all,
      coverage: this._coverage,
      max: this._max,
      sort: this._sort
    };

    if (this._types)
      facet.types = this._types.map((type) => ({
        exclude: type.exclude,
        filter: type.filter,
        keyphrase: type.keyphrase,
        max: type.max,
        min_count: type.minCount,
        name: type.name,
        ...this._sortToDTO(type)
      })) as ArrayOfAtLeastOne<FacetTypeDTO>;
    if (!Object.values(facet).filter((value) => value !== undefined).length) return superDTO;

    return { ...superDTO, search: { ...superDTO.search, facet } };
  }
}
