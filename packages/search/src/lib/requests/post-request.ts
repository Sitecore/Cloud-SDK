// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, ServerSettings } from '../types';

/**
 * This function sends a post request to Sitecore EP
 * @param body - A stringified version of the body to send
 * @param settings - The global settings {@link BrowserSettings} | {@link ServerSettings}
 * @returns promise: {@link SearchEndpointResponse}
 */
export async function sendPostRequest(
  body: string,
  settings: BrowserSettings | ServerSettings
): Promise<SearchEndpointResponse | null> {
  const url = `${settings.sitecoreEdgeUrl}/v1/search?sitecoreContextId=${settings.sitecoreEdgeContextId}`;

  const fetchOptions = {
    body,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json'
    },
    method: 'POST'
  };

  return await fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => {
      return null;
    });
}

interface FacetResponse {
  name: string;
  label: string;
  value: FacetValueResponse[];
}

interface FacetValueResponse {
  id: string;
  text: string;
  count: number;
  min?: number;
  max?: number;
}

interface SortingResponse {
  choices: Array<{ name: string; label: string }>;
}

interface QuestionsAnswersResponse {
  id: string;
  question: string;
  answer: string;
  type: string;
}

interface SuggestionResponse {
  [key: string]: Array<{ text: string; freq: number }>;
}

/**
 * The response object that Sitecore EP returns
 */
export interface SearchEndpointResponse {
  dt: number;
  ts: number;
  widgets: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    rfk_id: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    used_in: string;
    entity: string;
    facet?: FacetResponse[];
    content?: Array<unknown>;
    sort?: SortingResponse;
    total_item?: number;
    limit?: number;
    offset?: number;
    suggestion: SuggestionResponse;
    related_questions?: QuestionsAnswersResponse[];
    answer?: QuestionsAnswersResponse;
  }[];
}
