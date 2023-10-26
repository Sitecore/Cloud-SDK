// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { fetchWithTimeout } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../consts';
import { IProxySettings, ICdpResponse } from '../interfaces';
import { constructGetProxySettingsUrl } from './construct-get-proxy-settings-url';

/**
 * Gets the browser ID and Client Key from Sitecore Edge Proxy
 * @param contextId - The contextId
 * @param timeout - The timeout for the call to proxy
 * @returns the browser ID and Client Key
 */
export async function getProxySettings(contextId: string, timeout?: number): Promise<IProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION }
  };

  let response;
  if (timeout !== undefined) {
    response = await fetchWithTimeout(constructGetProxySettingsUrl(contextId), timeout, fetchOptions);
  } else {
    response = await fetch(constructGetProxySettingsUrl(contextId), fetchOptions)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => undefined);
  }


  if (!response) return { browserId: '', clientKey: '' };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { client_key: clientKey, ref: browserId }: ICdpResponse = response;
  return { browserId, clientKey};
}
