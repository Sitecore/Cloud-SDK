// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Represents a widget item object that holds all possible members in its DTO format.
 */
export interface WidgetItemDTO {
  entity: string;
  search?: WidgetItemSearch;
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
  query?: {
    keyphrase: string;
    operator?: LogicalOperators;
  };
}
