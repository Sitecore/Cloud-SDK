// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export interface SearchEventRequestDTO {
  keyword?: string;
  advanced_query_text?: string;
  modified_keyword?: string;
  num_results?: number;
  total_results?: number;
  num_requested?: number;
  page_size?: number;
  page_number?: number;
  redirect_url?: number;
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

export interface FacetFilter extends SuggestionFilter {
  facetPosition: number;
}

export interface RangeFacetFilter extends SuggestionFilter {
  startValue: string;
  endValue: string;
  facetPosition: 0;
}

export type EventFilter = SuggestionFilter | FacetFilter | RangeFacetFilter;
