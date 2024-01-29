// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { fetchWithTimeout } from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION } from '../consts';
import { ProxySettings, EPResponse } from '../interfaces';
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
): Promise<ProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION },
  };

  const url = constructGetBrowserIdUrl(sitecoreEdgeUrl, sitecoreEdgeContextId);
  let payload;

  if (timeout !== undefined) {
    payload = await fetchWithTimeout(url, timeout, fetchOptions)
      .then((response) => {
        return (response && response.json()) || null;
      })
      .catch((err) => {
        if (err.message.includes('IV-0006') || err.message.includes('IE-0002')) {
          throw new Error(err.message);
        }
        return null;
      });
  } else {
    payload = await fetch(url, fetchOptions)
      .then((res) => res.json())
      .catch(() => undefined);
  }

  if (!payload?.ref)
    throw new Error(
      '[IE-0003] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );

  const { ref: browserId }: EPResponse = payload;
  return { browserId };
}
