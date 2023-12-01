// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EPResponse } from '@sitecore-cloudsdk/core';
import { NestedObject } from '@sitecore-cloudsdk/utils';
import { getDependencies } from '../../initializer/browser/initializer';
import { PageViewEventInput, PageViewEvent } from './page-view-event';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export function pageView(eventData: PageViewEventInput, extensionData?: NestedObject): Promise<EPResponse | null> {
  const { eventApiClient, id, settings } = getDependencies();

  return new PageViewEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    searchParams: window.location.search,
    settings,
  }).send();
}
