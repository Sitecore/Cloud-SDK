// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { API_VERSION, LIBRARY_VERSION, TARGET_URL } from '../consts';

/**
 * A function that gets the guest ref from CDP.
 * @param browserId - The browser id of the client
 * @param contextId - The contextId
 * @returns - A promise that resolves with the guest ref
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export async function getGuestId(browserId: string, contextId: string): Promise<string> {
  // eslint-disable-next-line max-len
  const url = `${TARGET_URL}/events/${API_VERSION}/browser/${browserId}/show.json?sitecoreContextId=${contextId}&client_key=&api_token=`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const response = await fetch(url, { headers: { 'X-Library-Version': LIBRARY_VERSION } });
  const data = await response.json();

  if (!response.ok) {
    const { error_msg: errorMsg, moreInfo } = data as IGetGuestRefResponseError;

    throw new Error(`${errorMsg}, for more info: ${moreInfo}`);
  }

  return (data as IGetGuestRefResponse).customer.ref;
}

interface IGetGuestRefCommon {
  status: string;
  version: string;
  clientKey: string;
}

export interface IGetGuestRefResponse extends IGetGuestRefCommon {
  ref: string;
  customer: { ref: string };
}

export interface IGetGuestRefResponseError extends IGetGuestRefCommon {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg: string;
  moreInfo: string;
}
