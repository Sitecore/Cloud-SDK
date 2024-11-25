// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type {
  FacetOptions,
  FacetOptionsDTO,
  FacetTypeDTO,
  FacetTypeOptions,
  QueryOptions,
  SearchDTO,
  SearchOptions,
  SearchSortOptions,
  SearchWidgetItemDTO
} from './interfaces';
import { ResultsWidgetItem } from './results-widget-item';
import { isFacetFilter } from './utils';

export class SearchWidgetItem extends ResultsWidgetItem {
  private _query?: QueryOptions;
  private _offset?: number;
  private _facet?: FacetOptions;
  private _sort?: SearchSortOptions;

  /**
   * Creates and holds the functionality of a search widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param searchOptions - The widget's search options object.
   *
   */
  constructor(entity: string, rfkId: string, searchOptions?: SearchOptions) {
    super(entity, rfkId, {
      content: searchOptions?.content,
      filter: searchOptions?.filter,
      groupBy: searchOptions?.groupBy,
      limit: searchOptions?.limit
    });

    if (!searchOptions) return;

    if (searchOptions.facet && Object.keys(searchOptions.facet).length) {
      this._validateNumberInRange1To100(ErrorMessages.IV_0014, searchOptions.facet.max);
      this._validateFacetTypes(searchOptions.facet.types);

      this._facet = searchOptions.facet;
    }

    if (searchOptions.query) {
      this._validateQuery(searchOptions.query);

      this._query = searchOptions.query;
    }
    if (this._isValidOffset(searchOptions.offset)) this._offset = searchOptions.offset;
    if (this._isValidSort(searchOptions.sort)) this._sort = searchOptions.sort;
  }

  /**
   * Sets the search query for the SearchWidgetItem.
   * This method updates the `query` property of the search configuration within the SearchWidgetItem instance.
   * The query is used to define specific search criteria.
   * @param query - The operator that specifies the search criteria.
   */
  set query(query: QueryOptions) {
    this._validateQuery(query);

    this._query = query;
  }

  private _validateQuery(query: QueryOptions) {
    if (query.keyphrase.length < 1 || query.keyphrase.length > 100) throw new Error(ErrorMessages.IV_0009);
  }

  /**
   * Sets the query data to undefined
   */
  resetQuery() {
    this._query = undefined;
  }

  /**
   * Sets the search facet for the SearchWidgetItem.
   * This method updates the `facet` property of the search configuration within the SearchWidgetItem instance.
   *
   * @param facet - The object to set as the search facet.
   * @throws Error If the max is less than 1 or greater than 100, indicating an invalid range.
   */
  set facet(facet: FacetOptions) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0014, facet.max);
    this._validateFacetTypes(facet.types);

    this._facet = facet;
  }

  /**
   * Sets the facet data to undefined
   */
  resetFacet() {
    this._facet = undefined;
  }

  /**
   * Sets the search offset for the WidgetItem.
   * Updates the offset property to manage pagination. Throws an error if the offset value is less than 0.
   * @param offset - The non-negative integer to set as the search offset.
   * @throws Error If the offset is less than 0.
   */
  set offset(offset: number) {
    if (this._isValidOffset(offset)) this._offset = offset;
  }

  protected _isValidOffset(offset?: number) {
    if (typeof offset === 'number') {
      if (offset < 0) throw new Error(ErrorMessages.IV_0008);

      return true;
    }

    return false;
  }

  /**
   * Sets the search sort property for SearchWidgetItem
   * Throws an error if one of the values under sort have an empty `name`
   * @param sort - the object for the sort param
   * @throws error if <SearchSortOptions>.<SortValue>.name(s) property is an empty string
   */
  set sort(sort: SearchSortOptions) {
    if (this._isValidSort(sort)) this._sort = sort;
  }

  /**
   * Sets the sort data to undefined
   */
  resetSort() {
    this._sort = undefined;
  }

  /**
   * Validates the <SearchSortOptions>.<SortValue>.name property that its not an empty string
   * Empty object for `sort` is also valid
   * @throws error if <SearchSortOptions>.<SortValue>.name(s) property is an empty string
   */
  private _isValidSort(sort?: SearchSortOptions) {
    if (!sort) return false;

    if (sort.value)
      for (const sortValueItem of sort.value)
        if (sortValueItem.name.trim().length === 0) throw new Error(ErrorMessages.IV_0026);

    return true;
  }

  /**
   * Validates the facet type fields. Throws an errors if incorrect values are provided.
   */
  private _validateFacetTypes(types?: ArrayOfAtLeastOne<FacetTypeOptions>) {
    if (!types) return;

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

  private _filterToDTO(type: FacetTypeOptions) {
    if (!type.filter) return undefined;

    if (!isFacetFilter(type.filter.values)) return type.filter;

    return { type: type.filter.type, values: type.filter.values.map((filter) => filter.toDTO()) };
  }

  /**
   * Builds the sort piece of the DTO.
   */
  private _facetSortToDTO(type: FacetTypeOptions) {
    if (type.sort)
      return {
        after: type.sort.after,
        sort: { name: type.sort.name, order: type.sort.order }
      };
    return {};
  }

  /**
   * Maps the search widget item to its DTO format.
   */
  toDTO(): SearchWidgetItemDTO {
    const baseDTO = super.toDTO();
    const resultsDTO = this._resultsToDTO();

    const facet: FacetOptionsDTO = {
      all: this._facet?.all,
      coverage: this._facet?.coverage,
      max: this._facet?.max,
      sort: this._facet?.sort
    };

    if (this._facet?.types)
      facet.types = this._facet.types.map((type) => ({
        exclude: type.exclude,
        filter: this._filterToDTO(type),
        keyphrase: type.keyphrase,
        max: type.max,
        min_count: type.minCount,
        name: type.name,
        ...this._facetSortToDTO(type)
      })) as ArrayOfAtLeastOne<FacetTypeDTO>;

    const search: SearchDTO = {
      ...{ offset: this._offset },
      ...(this._query && { query: this._query }),
      ...(Object.values(facet).filter((value) => value !== undefined).length && { facet }),
      ...{ sort: this._sort },
      ...resultsDTO
    };

    const dto: SearchWidgetItemDTO = {
      ...baseDTO,
      search: Object.values(search).filter((value) => value !== undefined).length ? search : undefined
    };

    return dto;
  }
}
