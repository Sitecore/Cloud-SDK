// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { fetchWithTimeout } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../consts';
import { ICdpResponse } from '../interfaces';
import { generateCreateBrowserIdUrl } from './generate-browser-id-url';

/**
 * Gets the browser ID from Sitecore CDP
 * @param targetURL - From global settings
 * @param clientKey - From global settings
 * @returns the browser ID
 */
export async function getBrowserIdFromCdp(targetURL: string, clientKey: string, timeout?: number): Promise<string> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION },
  };

  let response;
  if (timeout !== undefined) {
    response = await fetchWithTimeout(generateCreateBrowserIdUrl(targetURL, clientKey), timeout, fetchOptions);
  } else {
    response = await fetch(generateCreateBrowserIdUrl(targetURL, clientKey), fetchOptions)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => undefined);
  }

  if (!response) return '';
  const { ref }: ICdpResponse = response;
  return ref;
}
