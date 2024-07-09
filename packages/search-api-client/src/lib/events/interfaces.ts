// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export interface SearchEventEntityDTO {
  id: string;
  entity_type: string;
  entity_subtype?: string;
  uri?: string;
  attributes?: Record<string, string>;
  source_id?: string;
}

export interface SearchEventEntity {
  id: string;
  entity: string;
  entityType?: string;
  uri?: string;
  attributes?: Record<string, string>;
  sourceId?: string;
}

export interface SearchEventRequestDTO {
  keyword?: string;
  advanced_query_text?: string;
  modified_keyword?: string;
  num_results?: number;
  total_results?: number;
  num_requested?: number;
  page_size?: number;
  page_number?: number;
  redirect_url?: string;
}

export interface SearchEventRequest {
  keyword?: string;
  advancedQueryText?: string;
  modifiedKeyword?: string;
  numResults?: number;
  totalResults?: number;
  numRequested?: number;
  pageSize?: number;
  pageNumber?: number;
  redirectUrl?: string;
}

export interface EventFilterDTO {
  display_name?: Array<string>;
  start_value?: string;
  end_value?: string;
  facet_position?: string;
  name?: string;
  title?: string;
  value?: Array<string>;
  value_position?: Array<string>;
}

export interface SuggestionFilter {
  name: string;
  title: string;
  value: string;
  valuePosition: number;
  displayName: string;
}

export interface SuggestionFilterDTO {
  name: string;
  title: string;
  value: string[];
  value_position: number[];
  display_name: string[];
}

export interface FacetFilter extends SuggestionFilter {
  facetPosition: number;
}

export interface FacetFilterDTO extends SuggestionFilterDTO {
  facet_position: number;
}

export interface RangeFacetFilter extends SuggestionFilter {
  startValue: string;
  endValue: string;
}

export interface RangeFacetFilterDTO extends SuggestionFilterDTO {
  start_value: string;
  end_value: string;
  facet_position: 0;
}

export type EventFilter = SuggestionFilter | FacetFilter | RangeFacetFilter;

export interface WidgetNavigationEventParams {
  pathname: string;
  page?: string;
  itemPosition: number;
  currency?: string;
  language?: string;
  channel?: string;
  widgetIdentifier: string;
}

export interface WidgetClickEventParams {
  request: SearchEventRequest;
  entity: SearchEventEntity;
  itemPosition: number;
  pathname: string;
  widgetIdentifier: string;
  page?: string;
  currency?: string;
  language?: string;
  channel?: string;
}

export interface WidgetSuggestionClickEventParams {
  request: SearchEventRequest;
  filters: Array<SuggestionFilter>;
  pathname: string;
  widgetIdentifier: string;
  page: string;
  currency?: string;
  language?: string;
  channel?: string;
}

export interface WidgetFacetClickEventParams {
  request: SearchEventRequest;
  filters: Array<FacetFilter | RangeFacetFilter>;
  pathname: string;
  widgetIdentifier: string;
  page?: string;
  currency?: string;
  language?: string;
  channel?: string;
}
