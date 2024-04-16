// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EPResponse, getBrowserId, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { PageViewData, PageViewEvent } from './page-view-event';
import { ErrorMessages } from '../../consts';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 *
 * @param pageViewData - The required/optional attributes in order to be send to SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export async function pageView(pageViewData: PageViewData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0004);
  const id = getBrowserId();

  return new PageViewEvent({
    id,
    pageViewData,
    searchParams: window.location.search,
    sendEvent,
    settings
  }).send();
}
