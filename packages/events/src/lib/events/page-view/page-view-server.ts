// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EPResponse, getBrowserIdFromRequest, getSettingsServer } from '@sitecore-cloudsdk/core';
import { NestedObject, Request } from '@sitecore-cloudsdk/utils';
import { PageViewEventInput, PageViewEvent } from './page-view-event';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param request - Interface with constraint for extending request
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export function pageViewServer<T extends Request>(
  eventData: PageViewEventInput,
  request: T,
  extensionData?: NestedObject
): Promise<EPResponse | null> {
  const settings = getSettingsServer();
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  // Host is irrelevant but necessary to support relative URL
  const requestUrl = new URL(request.url as string, `https://localhost`);

  return new PageViewEvent({
    eventData,
    extensionData,
    id,
    searchParams: requestUrl.search,
    sendEvent,
    settings,
  }).send();
}
