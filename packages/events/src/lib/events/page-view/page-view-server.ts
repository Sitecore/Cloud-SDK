// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { type EPResponse, type Settings, handleGetSettingsError } from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import {
  builderInstanceServer,
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
  getEnabledPackageServer as getEnabledPackage,
  getSettingsServer
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
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
export function pageViewServer<T extends Request>(request: T, pageViewData?: PageViewData): Promise<EPResponse | null> {
  let settings: Settings | CloudSDKSettings;
  let browserId: string;

  // Host is irrelevant but necessary to support relative URL
  const requestUrl = new URL(request.url as string, `https://localhost`);

  if (builderInstanceServer) {
    if (!getEnabledPackage(PACKAGE_NAME)) throw new Error(ErrorMessages.IE_0015);

    settings = getCloudSDKSettingsServer();
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.names.browserId);
  } else {
    settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0015);
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.cookieNames.browserId);
  }

  return new PageViewEvent({
    id: browserId,
    pageViewData,
    searchParams: requestUrl.search,
    sendEvent,
    settings: settings as Settings
  }).send();
}
