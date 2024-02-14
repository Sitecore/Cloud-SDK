// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { API_VERSION, EPResponse, Settings } from '@sitecore-cloudsdk/core';
import type { BasePayload, PageViewEventPayload, IdentityEventPayload, CustomEventPayload } from '..';
import { LIBRARY_VERSION } from '../../consts';

/**
 * This factory function sends an event to Edge Proxy
 * @param body - The event data to send
 * @param settings - The global settings
 */
export async function sendEvent(body: EPFetchBody & BasePayload, settings: Settings): Promise<EPResponse | null> {
  const eventUrl = `${settings.sitecoreEdgeUrl}/v1/events/${API_VERSION}/events?sitecoreContextId=${settings.sitecoreEdgeContextId}&siteId=${settings.siteName}`;

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

  return await fetch(eventUrl, fetchOptions)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => null);
}

/**
 * The type of sendEvent function
 */
export type SendEvent = (body: EPFetchBody & BasePayload, settings: Settings) => Promise<EPResponse | null>;

/**
 * The type describing all possible event payloads
 */
type EPFetchBody = PageViewEventPayload | IdentityEventPayload | CustomEventPayload;
