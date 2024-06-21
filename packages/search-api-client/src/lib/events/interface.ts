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
