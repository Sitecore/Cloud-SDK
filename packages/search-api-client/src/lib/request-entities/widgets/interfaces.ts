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
 * Represents a widget item object that holds all possible members in its DTO format.
 */
export interface WidgetItemDTO {
  entity: string;
  search?: WidgetItemSearchDTO;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  rfk_id: string;
}

/**
 * Represents a widget object in its DTO format.
 */
export interface WidgetDTO {
  widget: {
    items: WidgetItemDTO[];
  };
}

/**
 * Represents a widget item search object.
 */
export interface WidgetItemSearch {
  content?: { fields?: string[] | unknown };
  limit?: number;
  offset?: number;
  filter?: Filter;
  groupBy?: string;
  query?: {
    keyphrase: string;
    operator?: Omit<LogicalOperators, 'not'>;
  };
}

export type ContentType = {
  fields?: ArrayOfAtLeastOne<string>;
};

export type ContentTypeDTO = {
  fields?: ArrayOfAtLeastOne<string>;
};

/**
 * Represents a widget item recommendation object.
 */
export interface WidgetItemRecommendation {
  content?: ContentType | Record<string, never>;
  filter?: Filter;
}

type FacetSortName = 'text' | 'count';
type FacetSortOrder = 'asc' | 'desc';

export interface FacetSort {
  name: FacetSortName;
  order: FacetSortOrder;
  after?: string;
}

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

export interface FacetType {
  name: string;
  exclude?: ArrayOfAtLeastOne<string>;
  max?: number;
  keyphrase?: string;
  minCount?: number;
  sort?: FacetSort;
  filter?: FacetTypeFilter;
}

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

export interface Facet {
  all?: boolean;
  max?: number;
  coverage?: boolean;
  sort?: FacetSort;
  types?: ArrayOfAtLeastOne<FacetType>;
}

export interface FacetDTO {
  all?: boolean;
  max?: number;
  coverage?: boolean;
  sort?: FacetSort;
  types?: ArrayOfAtLeastOne<FacetTypeDTO>;
}

/**
 * Represents a search widget item DTO search object.
 */
export interface SearchWidgetItemDTO extends WidgetItemDTO {
  search?: WidgetItemSearchDTO & { facet?: FacetDTO };
}

export type WidgetItemSearchDTO = Omit<WidgetItemSearch, 'filter'> & {
  filter?: FilterDTO;
};

export interface WidgetItemRecommendationDTO extends WidgetItemDTO {
  recommendations?: {
    content?: ContentTypeDTO | Record<string, never>;
    filter?: FilterDTO;
  };
}
