// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ICdpResponse } from '@sitecore-cloudsdk/engage-core';
import type { IBasePayload, IPageViewEventPayload, IIdentityEventPayload, ICustomEventPayload } from '../events';
import { LIBRARY_VERSION } from '../consts';

export class EventApiClient implements IEventApiClient {
  private readonly eventUrl: string;
  constructor(private targetURL: string, private apiVersion: string) {
    this.eventUrl = `${this.targetURL}/${this.apiVersion}/events`;
  }

  /**
   * A function that sends the payload to Sitecore CDP
   * @param body - The Request body for the Sitecore CDP
   * @returns - A promise that resolves with either the Sitecore CDP response object or null
   */
  async send(body: TCdpFetchBody & IBasePayload): Promise<ICdpResponse | null> {
    const fetchOptions = {
      body: JSON.stringify(body),
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-Library-Version': LIBRARY_VERSION,
      },
      method: 'POST',
    };

    return await fetch(this.eventUrl, fetchOptions)
      .then((response) => response.json())
      .then((data) => data)
      .catch(() => null);
  }
}

/**
 * The interface of EventApiClient class
 */
export interface IEventApiClient {
  send(body: TCdpFetchBody & IBasePayload): Promise<ICdpResponse | null>;
}

/**
 * The type describing all possible event payloads
 */
type TCdpFetchBody = IPageViewEventPayload | IIdentityEventPayload | ICustomEventPayload;
