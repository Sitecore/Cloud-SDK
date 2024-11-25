// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ComparisonFacetFilter } from '../filters/facet/comparison-facet-filter';
import type {
  ComparisonFacetFilterDTO,
  ListFacetFilterDTO,
  LogicalFacetFilterDTO,
  NotFacetFilterDTO
} from '../filters/facet/interfaces';
import type { ListFacetFilter } from '../filters/facet/list-facet-filter';
import type { LogicalFacetFilter } from '../filters/facet/logical-facet-filter';
import type { NotFacetFilter } from '../filters/facet/not-facet-filter';
import type { ArrayOfAtLeastOne, Filter, FilterDTO, LogicalOperators } from '../filters/interfaces';

/**
 * Represents a widget item object that holds the base members in its DTO format.
 */
export interface WidgetItemDTO {
  entity: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rfk_id: string;
}

/**
 * Represents the content options property of the results widget item.
 */
export type ContentOptions = { fields?: ArrayOfAtLeastOne<string> } | Record<string, never>;

/**
 * Represents a results widget item object.
 */
export interface ResultsOptions {
  limit?: number;
  filter?: Filter;
  groupBy?: string;
  content?: ContentOptions;
}

/**
 * Represents a results widget item object in its DTO format.
 */
export interface ResultsItemDTO {
  limit?: number;
  filter?: FilterDTO;
  group_by?: string;
  content?: ContentOptions;
}

type FacetSortName = 'text' | 'count';
type SortingOptions = 'asc' | 'desc';

export type FacetFilter = ComparisonFacetFilter | NotFacetFilter | LogicalFacetFilter | ListFacetFilter;
export type FacetFilterDTO = ComparisonFacetFilterDTO | NotFacetFilterDTO | LogicalFacetFilterDTO | ListFacetFilterDTO;

export type FacetTypeFilter = {
  type: 'and' | 'or';
  values: ArrayOfAtLeastOne<string> | ArrayOfAtLeastOne<FacetFilter>;
};

export type FacetTypeFilterDTO = {
  type: 'and' | 'or';
  values: ArrayOfAtLeastOne<string> | ArrayOfAtLeastOne<FacetFilterDTO>;
};

export type FacetSortDTO = Omit<FacetSort, 'after'>;

/**
 * Represents the type object of the facet object.
 */
export interface FacetTypeOptions {
  name: string;
  exclude?: ArrayOfAtLeastOne<string>;
  max?: number;
  keyphrase?: string;
  minCount?: number;
  sort?: FacetSort;
  filter?: FacetTypeFilter;
}

/**
 * Represents the facet object of search widget item in its DTO format.
 */
export interface FacetTypeDTO {
  name: string;
  exclude?: ArrayOfAtLeastOne<string>;
  max?: number;
  keyphrase?: string;
  min_count?: number;
  sort?: FacetSortDTO;
  after?: string;
  filter?: FacetTypeFilterDTO;
}

/**
 * Represents the facet object of search widget item.
 */
export interface FacetOptions {
  all?: boolean;
  max?: number;
  coverage?: boolean;
  sort?: FacetSort;
  types?: ArrayOfAtLeastOne<FacetTypeOptions>;
}

/**
 * Represents the sort object of the facet object.
 */
export interface FacetSort {
  name: FacetSortName;
  order: SortingOptions;
  after?: string;
}

/**
 * Represents the facet object its DTO format.
 */
export interface FacetOptionsDTO {
  all?: boolean;
  max?: number;
  coverage?: boolean;
  sort?: FacetSort;
  types?: ArrayOfAtLeastOne<FacetTypeDTO>;
}

/**
 * Represents the query object of search widget item.
 */
export interface QueryOptions {
  keyphrase: string;
  operator?: Exclude<LogicalOperators, 'not'>;
}

/**
 * Represents the query object of search widget item in its DTO format.
 */
export interface QueryOptionsDTO {
  keyphrase: string;
  operator?: Exclude<LogicalOperators, 'not'>;
}

/*
 * Represents the search widget item object.
 */
export interface SearchOptions extends ResultsOptions {
  facet?: FacetOptions;
  query?: QueryOptions;
  offset?: number;
  sort?: SearchSortOptions;
}

/**
 * Represents the search object of the search widget item in its DTO format.
 */
export interface SearchDTO extends ResultsItemDTO {
  facet?: FacetOptionsDTO;
  query?: QueryOptionsDTO;
  offset?: number;
  sort?: SearchSortOptionsDTO;
}

/**
 * Represents the search widget item object in its DTO format.
 */
export interface SearchWidgetItemDTO extends WidgetItemDTO {
  search?: SearchDTO;
}

/**
 * Represents the search widget item sort param options.
 */
export interface SortValue {
  name: string;
  order?: SortingOptions;
}

/**
 * Represents the search widget item sort param options in its DTO format.
 */
export interface SortValueDTO {
  name: string;
  order?: SortingOptions;
}

/**
 * Represents the search widget item sort param.
 */
export interface SearchSortOptions {
  choices?: boolean;
  value?: Array<SortValue>;
}

/**
 * Represents the search widget item sort param in its DTO format.
 */
export interface SearchSortOptionsDTO {
  choices?: boolean;
  value?: Array<SortValue>;
}

/**
 * Represents the recipe object of the recommendation widget item.
 */
export type Recipe = { id: string; version: number };

/**
 * Represents recommendation widget item.
 */
export interface Recommendation {
  recipe?: Recipe;
}

/**
 * Represents a widget item recommendation object.
 */
export type RecommendationOptions = ResultsOptions & Recommendation;

/**
 * Represents the recommendations object of the recommendation widget item in its DTO format.
 */
export interface RecommendationDTO extends ResultsItemDTO {
  recipe?: Recipe;
}

/**
 * Represents the recommendation widget item object in its DTO format.
 */
export interface WidgetItemRecommendationDTO extends WidgetItemDTO {
  recommendations?: RecommendationDTO;
}

/**
 * Represents a widget object in its DTO format.
 */
export interface WidgetDTO {
  widget: {
    items: WidgetItemDTO[];
  };
}

type QueryType = 'question' | 'statement' | 'keyword';

export interface RelatedQuestionsOptions {
  limit?: number;
  includeSources?: boolean;
  filter?: Filter;
  offset?: number;
}

export interface ExactAnswerOptions {
  includeSources?: boolean;
  queryTypes?: ArrayOfAtLeastOne<QueryType>;
}

export interface QuestionsAnswersOptions {
  keyphrase: string;
  exactAnswer?: ExactAnswerOptions;
  relatedQuestions?: RelatedQuestionsOptions;
}

export interface QuestionsAnswersWidgetItemDTO extends WidgetItemDTO {
  questions: {
    keyphrase: string;
    exact_answer?: {
      include_sources?: boolean;
      query_types?: ArrayOfAtLeastOne<QueryType>;
    };
    related_questions?: {
      filter?: FilterDTO;
      include_sources?: boolean;
      limit?: number;
      offset?: number;
    };
  };
}
