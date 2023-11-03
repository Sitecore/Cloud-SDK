// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { fetchWithTimeout } from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION } from '../consts';
import { IProxySettings, ICdpResponse } from '../interfaces';
import { constructGetProxySettingsUrl } from './construct-get-proxy-settings-url';

/**
 * Gets the browser ID and Client Key from Sitecore Edge Proxy
 * @param sitecoreEdgeContextId - The sitecoreEdgeContextId
 * @param timeout - The timeout for the call to proxy
 * @returns the browser ID and Client Key
 */
export async function getProxySettings(
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl: string,
  timeout?: number
): Promise<IProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION },
  };

  let response;
  if (timeout !== undefined) {
    response = await fetchWithTimeout(
      constructGetProxySettingsUrl(sitecoreEdgeContextId, sitecoreEdgeUrl),
      timeout,
      fetchOptions
    );
  } else {
    response = await fetch(constructGetProxySettingsUrl(sitecoreEdgeContextId, sitecoreEdgeUrl), fetchOptions)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => undefined);
  }

  if (!response) return { browserId: '', clientKey: '' };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { client_key: clientKey, ref: browserId }: ICdpResponse = response;
  return { browserId, clientKey };
}
