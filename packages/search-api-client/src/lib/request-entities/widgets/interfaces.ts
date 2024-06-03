// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Represents a widget item object that holds all possible members in its DTO format.
 */
export interface WidgetItemDTO {
  entity: string;
  search?: WidgetItemSearchDTO;
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
  content?: { fields?: string[] };
  limit?: number;
  offset?: number;
  query?: {
    keyphrase: string;
    operator?: LogicalOperators;
  };
  groupBy?: string;
}

/**
 * Represents a widget item DTO search object.
 */
export interface WidgetItemSearchDTO {
  content?: { fields?: string[] };
  limit?: number;
  offset?: number;
  query?: {
    keyphrase: string;
    operator?: LogicalOperators;
  };
  group_by?: string;
}
