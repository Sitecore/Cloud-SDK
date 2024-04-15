// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { API_VERSION, EPResponse, Settings, debug } from '@sitecore-cloudsdk/core';
import type { BasePayload, CustomEventPayload, IdentityEventPayload, PageViewEventPayload } from '..';
import { EVENTS_NAMESPACE, LIBRARY_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';

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
      'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Library-Version': LIBRARY_VERSION,
    },
    method: 'POST',
  };

  debug(EVENTS_NAMESPACE)('Events request: %s with options: %O', eventUrl, fetchOptions);

  return await fetch(eventUrl, fetchOptions)
    .then((response) => {
      debug(EVENTS_NAMESPACE)('Events response: %O', response);
      return response.json();
    })
    .then((data) => {
      debug(EVENTS_NAMESPACE)('Events payload: %O', data);
      return data;
    })
    .catch((error) => {
      debug(EVENTS_NAMESPACE)('Error: events response: %O', error);
      return null;
    });
}

/**
 * The type of sendEvent function
 */
export type SendEvent = (body: EPFetchBody & BasePayload, settings: Settings) => Promise<EPResponse | null>;

/**
 * The type describing all possible event payloads
 */
type EPFetchBody = PageViewEventPayload | IdentityEventPayload | CustomEventPayload;
