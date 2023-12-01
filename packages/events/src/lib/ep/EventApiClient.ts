// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { API_VERSION, EPResponse } from '@sitecore-cloudsdk/core';
import type { BasePayload, PageViewEventPayload, IdentityEventPayload, CustomEventPayload } from '../events';
import { LIBRARY_VERSION } from '../consts';

export class EventApiClient implements EventApiClient {
  private readonly eventUrl: string;
  constructor(private targetURL: string, sitecoreEdgeContextId: string, siteName: string) {
    this.eventUrl = `${this.targetURL}/events/${API_VERSION}/events?sitecoreContextId=${sitecoreEdgeContextId}&siteId=${siteName}`;
  }

  /**
   * A function that sends the payload to Sitecore EP
   * @param body - The Request body for the Sitecore EP
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async send(body: EPFetchBody & BasePayload): Promise<EPResponse | null> {
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
export interface EventApiClient {
  send(body: EPFetchBody & BasePayload): Promise<EPResponse | null>;
}

/**
 * The type describing all possible event payloads
 */
type EPFetchBody = PageViewEventPayload | IdentityEventPayload | CustomEventPayload;
