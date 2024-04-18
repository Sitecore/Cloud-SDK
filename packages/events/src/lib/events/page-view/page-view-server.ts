// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserIdFromRequest, getSettingsServer, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import type { EPResponse } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../../consts';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import type { Request } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 *
 * @param request - Interface with constraint for extending request
 * @param pageViewData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function pageViewServer<T extends Request>(request: T, pageViewData: PageViewData): Promise<EPResponse | null> {
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0005);
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  // Host is irrelevant but necessary to support relative URL
  const requestUrl = new URL(request.url as string, `https://localhost`);

  return new PageViewEvent({
    id,
    pageViewData,
    searchParams: requestUrl.search,
    sendEvent,
    settings
  }).send();
}
