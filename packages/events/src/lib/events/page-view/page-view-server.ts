// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ICdpResponse, getBrowserIdFromRequest } from '@sitecore-cloudsdk/engage-core';
import { INestedObject, TRequest } from '@sitecore-cloudsdk/engage-utils';
import { getServerDependencies } from '../../initializer/server/initializer';
import { IPageViewEventInput, PageViewEvent } from './page-view-event';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param request - Interface with constraint for extending request
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore CDP returns
 */
export function pageViewServer<T extends TRequest>(
  eventData: IPageViewEventInput,
  request: T,
  extensionData?: INestedObject
): Promise<ICdpResponse | null> {
  const { eventApiClient, settings } = getServerDependencies();
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  // Host is irrelevant but necessary to support relative URL
  const requestUrl = new URL(request.url as string, `https://localhost`);
  return new PageViewEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    searchParams: requestUrl.search,
    settings,
  }).send();
}
