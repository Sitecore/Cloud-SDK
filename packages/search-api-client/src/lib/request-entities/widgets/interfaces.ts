// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ArrayOfAtLeastOne, Filter, FilterDTO } from '../filters/interfaces';

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

export type LogicalOperators = 'and' | 'or';

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
    operator?: LogicalOperators;
  };
}

type FacetSortName = 'text' | 'count';
type FacetSortOrder = 'asc' | 'desc';

export interface FacetSort {
  name: FacetSortName;
  order: FacetSortOrder;
}

export interface FacetType {
  name: string;
  exclude?: ArrayOfAtLeastOne<string>;
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
  types?: ArrayOfAtLeastOne<FacetType>;
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
