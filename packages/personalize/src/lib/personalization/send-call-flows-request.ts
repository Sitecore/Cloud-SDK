// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { Settings } from '@sitecore-cloudsdk/core';
import { NestedObject, fetchWithTimeout } from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION } from '../consts';

/**
 * A function that sends a CallFlow request to Sitecore EP
 * @param personalizeData - Properties to be send to Sitecore EP
 * @param settings - settings for the url params
 * @param timeout - Optional timeout in milliseconds to cancel the request
 * @returns - A promise that resolves with either the Sitecore EP response object or unknown
 */
export async function sendCallFlowsRequest(epCallFlowsBody: EPCallFlowsBody, settings: Settings, timeout?: number) {
  const requestUrl = `${settings.sitecoreEdgeUrl}/personalize/v2/callFlows?sitecoreContextId=${settings.sitecoreEdgeContextId}&siteId=${settings.siteName}`;

  const fetchOptions = {
    body: JSON.stringify(epCallFlowsBody),
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Library-Version': LIBRARY_VERSION,
    },
    method: 'POST',
  };

  if (timeout === undefined)
    return fetch(requestUrl, fetchOptions)
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => {
        return null;
      });

  return fetchWithTimeout(requestUrl, timeout, fetchOptions);
}

/**
 * An interface with the basic functionality that the derived classes needs to implement
 */
export interface PersonalizeClient {
  settings: Settings;
  sendCallFlowsRequest: (
    epCallFlowAttributes: EPCallFlowsBody,
    timeout?: number
  ) => Promise<unknown | null | FailedCalledFlowsResponse>;
}

/**
 * An interface that describes the failed response model from Sitecore EP
 */
export interface FailedCalledFlowsResponse {
  status: string;
  code: string;
  message: string;
  developerMessage: string;
  moreInfoUrl: string;
}

/**
 * An interface that describes the identifier model attributes for the library
 */
export interface EPIdentifier {
  id: string;
  provider: string;
}

/**
 * An interface that describes the payload sent to Sitecore EP library
 */
export interface EPCallFlowsBody {
  browserId?: string;
  email?: string;
  friendlyId: string;
  identifiers?: EPIdentifier;
  channel: string;
  clientKey: string;
  currencyCode: string;
  language: string | undefined;
  params?: EPCallFlowsParams;
  pointOfSale: string;
}

/**
 * A type that describes the params property of the EPCallFlowsBody
 */
export type EPCallFlowsParams = NestedObject;
