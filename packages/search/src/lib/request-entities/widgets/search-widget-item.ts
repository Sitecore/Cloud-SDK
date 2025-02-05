// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type {
  FacetOptions,
  FacetOptionsDTO,
  FacetTypeDTO,
  FacetTypeOptions,
  FilteringOptions,
  FilteringOptionsDTO,
  QueryOptions,
  SearchDTO,
  SearchOptions,
  SearchPersonalizationOptions,
  SearchPersonalizationOptionsDto,
  SearchRankingOptions,
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
  private _ranking?: ArrayOfAtLeastOne<SearchRankingOptions>;
  private _personalization?: SearchPersonalizationOptions;

  /**
   * Creates and holds the functionality of a search widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   * @param searchOptions - The widget's {@link SearchOptions} object.
   * @throws - {@link ErrorMessages.IV_0008} | {@link ErrorMessages.IV_0009};
   * @throws - {@link ErrorMessages.IV_0014} | {@link ErrorMessages.IV_0016};
   * @throws - {@link ErrorMessages.IV_0017} | {@link ErrorMessages.IV_0018};
   * @throws - {@link ErrorMessages.IV_0019} | {@link ErrorMessages.IV_0020};
   * @throws - {@link ErrorMessages.IV_0021} | {@link ErrorMessages.IV_0026};
   * @throws - {@link ErrorMessages.IV_0029} | {@link ErrorMessages.IV_0030};
   * @throws - {@link ErrorMessages.IV_0031}
   */
  constructor(entity: string, widgetId: string, searchOptions?: SearchOptions) {
    super(entity, widgetId, {
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

    this._validatePersonalization(searchOptions.personalization);
    this._personalization = searchOptions.personalization;

    this._validateRanking(searchOptions.ranking);
    this._ranking = searchOptions.ranking;

    this._validateSort(searchOptions.sort);
    this._sort = searchOptions.sort;

    this._validateSuggestion(searchOptions.suggestion);
    this._suggestion = searchOptions.suggestion;
  }

  /**
   * @param personalization - the object {@link SearchPersonalizationOptions} of the `personalization` param
   */
  set personalization(personalization: SearchPersonalizationOptions) {
    this._validatePersonalization(personalization);
    this._personalization = personalization;
  }

  /**
   * @returns the {@link SearchPersonalizationOptions} `personalization` property of the SearchWidgetItem
   */
  get personalization(): SearchPersonalizationOptions | undefined {
    return this._personalization;
  }

  /**
   * sets the `personalization` property to undefined of the SearchWidgetItem
   */
  resetPersonalization(): void {
    this._personalization = undefined;
  }

  /**
   *
   * @param personalization - the object of the `personalization` property
   * @throws - {@link ErrorMessages.IV_0030} | {@link ErrorMessages.IV_0031};
   */
  private _validatePersonalization(personalization?: SearchPersonalizationOptions): void {
    if (!personalization) return;

    personalization.attributes.forEach((attribute) => {
      this._validateNonEmptyNoWhitespaceString(ErrorMessages.IV_0030, attribute);
    });

    if (personalization.algorithm === 'mlt')
      personalization.ids.forEach((id) => {
        this._validateNonEmptyString(ErrorMessages.IV_0031, id);
      });
  }

  /**
   *
   * @returns The personalization property in its DTO format {@link SearchPersonalizationOptionsDto}.
   */
  private _personalizationToDTO(): SearchPersonalizationOptionsDto | undefined {
    if (!this._personalization) return undefined;
    const { attributes, ...rest } = this._personalization;
    return { fields: attributes, ...rest };
  }

  /**
   * @param ranking - the object {@link SearchRankingOptions}[] of the `ranking` param
   */
  set ranking(ranking: ArrayOfAtLeastOne<SearchRankingOptions>) {
    this._validateRanking(ranking);
    this._ranking = ranking;
  }

  /**
   * @returns the {@link SearchRankingOptions}[] `ranking` property of the SearchWidgetItem
   */
  get ranking(): ArrayOfAtLeastOne<SearchRankingOptions> | undefined {
    return this._ranking;
  }

  /**
   * sets the `ranking` property to undefined of the SearchWidgetItem
   */
  resetRanking(): void {
    this._ranking = undefined;
  }

  /**
   *
   * @param ranking - the object {@link SearchRankingOptions}[] of the `ranking` property
   * @throws - {@link ErrorMessages.IV_0016} | {@link ErrorMessages.IV_0029};
   */
  private _validateRanking(ranking?: ArrayOfAtLeastOne<SearchRankingOptions>): void {
    ranking?.forEach((rank) => {
      this._validateNumberInRange(ErrorMessages.IV_0029, { max: 100, min: 0.1 }, rank.weight);
      this._validateNonEmptyNoWhitespaceString(ErrorMessages.IV_0016, rank.name);
    });
  }

  /**
   * Sets the search query for the SearchWidgetItem.
   * This method updates the `query` property of the search configuration within the SearchWidgetItem instance.
   * The query is used to define specific search criteria.
   * @param query - The {@link QueryOptions} operator that specifies the search criteria.
   * @throws - {@link ErrorMessages.IV_0008}
   */
  set query(query: QueryOptions) {
    this._validateQuery(query);

    this._query = query;
  }

  /**
   * @returns The {@link QueryOptions} `query` property of the SearchWidgetItem.
   */
  get query(): QueryOptions | undefined {
    return this._query;
  }

  /**
   *
   * @param query - {@link QueryOptions}
   * @throws - {@link ErrorMessages.IV_0009}
   */
  private _validateQuery(query: QueryOptions): void {
    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, query.keyphrase);
  }

  /**
   * Sets the query data to undefined
   */
  resetQuery(): void {
    this._query = undefined;
  }

  /**
   * Sets the search facet for the SearchWidgetItem.
   * This method updates the `facet` property of the search configuration within the SearchWidgetItem instance.
   *
   * @param facet - The object to set as the search facet.
   * @throws - {@link ErrorMessages.IV_0014}
   */
  set facet(facet: FacetOptions) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0014, facet.max);
    this._validateFacetTypes(facet.types);

    this._facet = facet;
  }

  /**
   * @returns The {@link FacetOptions} `facet` property of the SearchWidgetItem.
   */
  get facet(): FacetOptions | undefined {
    return this._facet;
  }

  /**
   * Sets the facet data to undefined
   */
  resetFacet(): void {
    this._facet = undefined;
  }

  /**
   * Sets the search offset for the WidgetItem.
   * Updates the offset property to manage pagination. Throws an error if the offset value is less than 0.
   * @param offset - The non-negative integer to set as the search offset.
   * @throws - {@link ErrorMessages.IV_0008}
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
  resetOffset(): void {
    this._offset = undefined;
  }

  /**
   * Sets the suggestion property for SearchWidgetItem
   * @param suggestion - the {@link SearchSuggestionOptions}[] of objects for the suggestion param
   * @throws - {@link ErrorMessages.IV_0014} | {@link ErrorMessages.IV_0016}
   */
  set suggestion(suggestion: ArrayOfAtLeastOne<SearchSuggestionOptions>) {
    this._validateSuggestion(suggestion);
    this._suggestion = suggestion;
  }

  /**
   * @returns The {@link SearchSuggestionOptions} `suggestion` property of the SearchWidgetItem.
   */
  get suggestion(): ArrayOfAtLeastOne<SearchSuggestionOptions> | undefined {
    return this._suggestion;
  }

  /**
   * Sets the `suggestion` property to undefined.
   */
  resetSuggestion(): void {
    this._suggestion = undefined;
  }

  /**
   *
   * @returns the `suggestion` property in its DTO format. {@link SearchSuggestionOptionsDTO}[]
   */
  private _suggestionToDTO(): ArrayOfAtLeastOne<SearchSuggestionOptionsDTO> | undefined {
    if (!this._suggestion) return undefined;

    return this._suggestion.map((item) => {
      const { keyphraseFallback, ...rest } = item;

      return { ...rest, keyphrase_fallback: keyphraseFallback };
    }) as ArrayOfAtLeastOne<SearchSuggestionOptionsDTO>;
  }

  /**
   * Validates the `suggestion` property. Throws error if provided with incorrect values.
   * @param suggestion - the {@link SearchSuggestionOptions}[] of objects for the `suggestion` param
   * @throws - {@link ErrorMessages.IV_0014} | {@link ErrorMessages.IV_0016}
   */
  private _validateSuggestion(suggestion?: ArrayOfAtLeastOne<SearchSuggestionOptions>) {
    suggestion?.forEach((suggestionItem) => {
      this._validateNumberInRange1To100(ErrorMessages.IV_0014, suggestionItem.max);
      this._validateNonEmptyNoWhitespaceString(ErrorMessages.IV_0016, suggestionItem.name);
    });
  }

  /**
   * Sets the search sort property for SearchWidgetItem
   * Throws an error if one of the values under sort have an empty `name`
   * @param sort - the object {@link SearchSortOptions} for the `sort` param
   * @throws error if <SearchSortOptions>.<SortValue>.name(s) property is an empty string
   */
  set sort(sort: SearchSortOptions) {
    this._validateSort(sort);

    this._sort = sort;
  }

  /**
   * @returns The sort {@link SearchSortOptions} `property` of the SearchWidgetItem.
   */
  get sort(): SearchSortOptions | undefined {
    return this._sort;
  }

  /**
   * Sets the `sort` property to undefined
   */
  resetSort(): void {
    this._sort = undefined;
  }

  /**
   * Validates the sort field. Throws an error if incorrect values are provided.
   * @param sort - {@link SearchSortOptions}
   * @throws - {@link ErrorMessages.IV_0026}
   */
  private _validateSort(sort?: SearchSortOptions): void {
    sort?.value?.forEach((sortValueItem) => {
      this._validateNonEmptyString(ErrorMessages.IV_0026, sortValueItem.name);
    });
  }

  /**
   * Validates the facet type fields. Throws an errors if incorrect values are provided.
   * @param types - {@link FacetTypeOptions}[]
   * @throws - {@link ErrorMessages.IV_0016} | {@link ErrorMessages.IV_0017}
   * @throws - {@link ErrorMessages.IV_0018} | {@link ErrorMessages.IV_0019}
   * @throws - {@link ErrorMessages.IV_0020} | {@link ErrorMessages.IV_0021}
   */
  private _validateFacetTypes(types?: ArrayOfAtLeastOne<FacetTypeOptions>): void {
    if (!types) return;

    types.forEach((type) => {
      if (!type.name || type.name.includes(' ')) throw new Error(ErrorMessages.IV_0016);

      this._validateStringLengthInRange1To100(ErrorMessages.IV_0018, type.keyphrase);
      this._validateNumberInRange1To100(ErrorMessages.IV_0017, type.max);
      this._validateNumberInRange1To100(ErrorMessages.IV_0019, type.minCount);
      if (typeof type.sort === 'object' && typeof type.sort.after === 'string') {
        this._validateNonEmptyNoWhitespaceString(ErrorMessages.IV_0020, type.sort.after);
        if (type.sort.name !== 'text') throw new Error(ErrorMessages.IV_0021);
      }
    });
  }

  /**
   * @param type - {@link FacetTypeOptions}
   * @returns the `filter` property in a DTO format.
   */
  private _filterToDTO(type: FacetTypeOptions) {
    if (!type.filter) return undefined;

    if (!isFacetFilter(type.filter.values)) return type.filter;

    return { type: type.filter.type, values: type.filter.values.map((filter) => filter.toDTO()) };
  }

  /**
   * Builds the sort piece of the DTO.
   * @param type - {@link FacetTypeOptions}
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
   * Builds the filtering options array in its DTO format.
   * @param filteringOptions - {@link FilteringOptions}
   * @returns - {@link FilteringOptionsDTO}
   */
  private _filteringOptionsToDTO(filteringOptions?: FilteringOptions): FilteringOptionsDTO | undefined {
    if (!filteringOptions) return undefined;
    if (filteringOptions === 'Dynamic AND') return ['hard_filters', 'other_facet_values', 'own_values'];
    if (filteringOptions === 'Dynamic OR') return ['hard_filters', 'other_facet_values'];
    return ['hard_filters'];
  }

  /**
   * Maps the search widget item to its DTO format.
   * @returns - {@link SearchWidgetItemDTO}
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
        filtering_options: this._filteringOptionsToDTO(type.filteringOptions),
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
      ...{ personalization: this._personalizationToDTO() },
      ...{ ranking: this._ranking },
      ...{ suggestion: this._suggestionToDTO() },
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
