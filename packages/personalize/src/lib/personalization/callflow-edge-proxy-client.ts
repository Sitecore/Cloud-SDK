// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettings } from '@sitecore-cloudsdk/core';
import { INestedObject, fetchWithTimeout } from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION } from '../consts';

export class CallFlowEdgeProxyClient implements IPersonalizeClient {
  /**
   * A helper class which handles the functionality for sending CALLFLOW requests
   * @param personalizeData - The mandatory payload to be send to Sitecore EP
   * @param settings - The global settings
   */
  constructor(public settings: ISettings) {}

  /**
   * A function that sends a CallFlow request to Sitecore EP
   * @param personalizeData - Properties to be send to Sitecore EP
   * @param timeout - Optional timeout in milliseconds to cancel the request
   * @returns - A promise that resolves with either the Sitecore EP response object or unknown
   */
  async sendCallFlowsRequest(epCallFlowsBody: IEPCallFlowsBody, timeout?: number) {
    const requestUrl = `${this.settings.sitecoreEdgeUrl}/personalize/v2/callFlows?sitecoreContextId=${this.settings.sitecoreEdgeContextId}&siteId=${this.settings.siteName}`;

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
}

/**
 * An interface with the basic functionality that the derived classes needs to implement
 */
export interface IPersonalizeClient {
  settings: ISettings;
  sendCallFlowsRequest: (
    epCallFlowAttributes: IEPCallFlowsBody,
    timeout?: number
  ) => Promise<unknown | null | IFailedCalledFlowsResponse>;
}

/**
 * An interface that describes the failed response model from Sitecore EP
 */
export interface IFailedCalledFlowsResponse {
  status: string;
  code: string;
  message: string;
  developerMessage: string;
  moreInfoUrl: string;
}

/**
 * An interface that describes the identifier model attributes for the library
 */
export interface IEPIdentifier {
  id: string;
  provider: string;
}

/**
 * An interface that describes the payload sent to Sitecore EP library
 */
export interface IEPCallFlowsBody {
  browserId?: string;
  email?: string;
  friendlyId: string;
  identifiers?: IEPIdentifier;
  channel: string;
  clientKey: string;
  currencyCode: string;
  language: string | undefined;
  params?: IEPCallFlowsParams;
  pointOfSale: string;
}

/**
 * A type that describes the params property of the IEPCallFlowsBody
 */
export type IEPCallFlowsParams = INestedObject;
