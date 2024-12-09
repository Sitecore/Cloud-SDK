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
  SearchSuggestionOptions,
  SearchSuggestionOptionsDTO,
  SearchWidgetItemDTO
} from './interfaces';
import { ResultsWidgetItem } from './results-widget-item';
import { isFacetFilter } from './utils';

export class SearchWidgetItem extends ResultsWidgetItem {
  private _query?: QueryOptions;
  private _offset?: number;
  private _facet?: FacetOptions;
  private _sort?: SearchSortOptions;
  private _suggestion?: ArrayOfAtLeastOne<SearchSuggestionOptions>;

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
      limit: searchOptions?.limit,
      rule: searchOptions?.rule
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

    this._validatePositiveInteger(ErrorMessages.IV_0008, searchOptions.offset);
    this._offset = searchOptions.offset;

    this._validateSort(searchOptions.sort);
    this._sort = searchOptions.sort;

    this._validateSuggestion(searchOptions.suggestion);
    this._suggestion = searchOptions.suggestion;
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

  /**
   * @returns The query property of the SearchWidgetItem.
   */
  get query(): QueryOptions | undefined {
    return this._query;
  }

  private _validateQuery(query: QueryOptions) {
    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, query.keyphrase);
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
   * @returns The facet property of the SearchWidgetItem.
   */
  get facet(): FacetOptions | undefined {
    return this._facet;
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
    this._validatePositiveInteger(ErrorMessages.IV_0008, offset);

    this._offset = offset;
  }

  /**
   * @returns The offset property of the SearchWidgetItem.
   */
  get offset(): number | undefined {
    return this._offset;
  }

  /**
   * Sets the offset value to undefined
   */
  resetOffset() {
    this._offset = undefined;
  }

  /**
   * Sets the suggestion property for SearchWidgetItem
   * @param suggestion - the <array>array of objects for the suggestion param
   * @throws error if <SearchSuggestionOptions>.<suggestion>.name property is an empty string or contains spaces
   * @throws error if <SearchSuggestionOptions>.<suggestion>.max property is not between the range 1 ~ 100
   */
  set suggestion(suggestion: ArrayOfAtLeastOne<SearchSuggestionOptions>) {
    this._validateSuggestion(suggestion);
    this._suggestion = suggestion;
  }

  /**
   * @returns The suggestion property of the SearchWidgetItem.
   */
  get suggestion(): ArrayOfAtLeastOne<SearchSuggestionOptions> | undefined {
    return this._suggestion;
  }

  /**
   * Sets the suggestion property to undefined.
   */
  resetSuggestion() {
    this._suggestion = undefined;
  }

  private _suggestionToDTO() {
    if (!this._suggestion) return undefined;

    return this._suggestion.map((item) => {
      const { keyphraseFallback, ...rest } = item;

      return { ...rest, keyphrase_fallback: keyphraseFallback };
    }) as ArrayOfAtLeastOne<SearchSuggestionOptionsDTO>;
  }

  /**
   * Validates the suggestion property. Throws error if provided with incorrect values.
   * @param suggestion - the <array> of objects for the suggestion param
   */
  private _validateSuggestion(suggestion?: ArrayOfAtLeastOne<SearchSuggestionOptions>) {
    suggestion?.forEach((suggestionItem) => {
      this._validateNumberInRange1To100(ErrorMessages.IV_0014, suggestionItem.max);
      if (!suggestionItem.name || suggestionItem.name.includes(' ')) throw new Error(ErrorMessages.IV_0016);
    });
  }

  /**
   * Sets the search sort property for SearchWidgetItem
   * Throws an error if one of the values under sort have an empty `name`
   * @param sort - the object for the sort param
   * @throws error if <SearchSortOptions>.<SortValue>.name(s) property is an empty string
   */
  set sort(sort: SearchSortOptions) {
    this._validateSort(sort);

    this._sort = sort;
  }

  /**
   * @returns The sort property of the SearchWidgetItem.
   */
  get sort(): SearchSortOptions | undefined {
    return this._sort;
  }

  /**
   * Sets the sort data to undefined
   */
  resetSort() {
    this._sort = undefined;
  }

  /**
   * Validates the sort field. Throws an error if incorrect values are provided.
   */
  private _validateSort(sort?: SearchSortOptions) {
    sort?.value?.forEach((sortValueItem) => {
      this._validateNonEmptyString(ErrorMessages.IV_0026, sortValueItem.name);
    });
  }

  /**
   * Validates the facet type fields. Throws an errors if incorrect values are provided.
   */
  private _validateFacetTypes(types?: ArrayOfAtLeastOne<FacetTypeOptions>) {
    if (!types) return;

    types.forEach((type) => {
      if (!type.name || type.name.includes(' ')) throw new Error(ErrorMessages.IV_0016);

      this._validateStringLengthInRange1To100(ErrorMessages.IV_0018, type.keyphrase);
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

    const suggestionDTO = this._suggestionToDTO();

    const search: SearchDTO = {
      ...{ offset: this._offset },
      ...(this._query && { query: this._query }),
      ...(Object.values(facet).filter((value) => value !== undefined).length && { facet }),
      ...{ suggestion: suggestionDTO },
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
