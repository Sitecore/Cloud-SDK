// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { fetchWithTimeout } from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION } from '../consts';
import { IProxySettings, ICdpResponse } from '../interfaces';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';

/**
 * Gets the browser ID and Client Key from Sitecore Edge Proxy
 * @param sitecoreEdgeUrl - The baseURL for the Edge Proxy API.
 * @param sitecoreEdgeContextId - The sitecoreContextId param for the edge Proxy API.
 * @param timeout - The timeout for the call to proxy
 * @returns the browser ID
 */
export async function fetchBrowserIdFromEdgeProxy(
  sitecoreEdgeUrl: string,
  sitecoreEdgeContextId: string,
  timeout?: number
): Promise<IProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION },
  };

  const url = constructGetBrowserIdUrl(sitecoreEdgeUrl, sitecoreEdgeContextId);

  let response;
  if (timeout !== undefined) {
    response = await fetchWithTimeout(url,
      timeout,
      fetchOptions
    );
  } else {
    response = await fetch(url, fetchOptions)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => undefined);
  }

  if (!response) return { browserId: '' };
  const { ref: browserId }: ICdpResponse = response;
  return { browserId };
}
