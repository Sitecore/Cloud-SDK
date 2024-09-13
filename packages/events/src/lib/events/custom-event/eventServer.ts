// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse, Settings } from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import {
  builderInstanceServer,
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
  getEnabledPackageServer as getEnabledPackage,
  getSettingsServer,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import type { Request } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 *
 * @param request - Interface with constraint for extending request
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function eventServer<T extends Request>(request: T, eventData: EventData): Promise<EPResponse | null> {
  let settings: Settings | CloudSDKSettings;
  let browserId: string;

  if (builderInstanceServer) {
    if (!getEnabledPackage(PACKAGE_NAME)) throw new Error(ErrorMessages.IE_0015);

    settings = getCloudSDKSettingsServer();
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.names.browserId);
  } else {
    settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0015);
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.cookieNames.browserId);
  }

  return new CustomEvent({
    eventData,
    id: browserId,
    sendEvent,
    settings: settings as Settings
  }).send();
}
