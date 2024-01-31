// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserId, EPResponse, getSettings } from '@sitecore-cloudsdk/core';
import { NestedObject } from '@sitecore-cloudsdk/utils';
import { PageViewEventInput, PageViewEvent } from './page-view-event';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export async function pageView(
  eventData: PageViewEventInput,
  extensionData?: NestedObject
): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getSettings();
  const id = getBrowserId();

  return new PageViewEvent({
    eventData,
    extensionData,
    id,
    searchParams: window.location.search,
    sendEvent,
    settings,
  }).send();
}
