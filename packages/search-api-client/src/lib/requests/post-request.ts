// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, ServerSettings } from '../types';

/**
 * This function sends a post request to Sitecore EP
 * @param body - A stringified version of the body to send
 * @param settings - The global settings
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
  }[];
}
