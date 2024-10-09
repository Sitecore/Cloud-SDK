// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  builderInstanceServer,
  type EPResponse,
  getCookieValueFromRequest,
  handleGetSettingsError,
  type Settings
} from '@sitecore-cloudsdk/core/internal';
import {
  getCloudSDKSettingsServer as getCloudSDKSettings,
  getEnabledPackageServer as getEnabledPackage,
  getSettingsServer
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 *
 * @param request - Interface with constraint for extending request
 * @param identityData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function identityServer(request: Request, identityData: IdentityData): Promise<EPResponse | null> {
  let settings: Settings | CloudSDKSettings;
  let browserId: string;

  if (builderInstanceServer) {
    if (!getEnabledPackage(PACKAGE_NAME)) throw new Error(ErrorMessages.IE_0015);

    settings = getCloudSDKSettings();
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.name.browserId);
  } else {
    settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0015);
    browserId = getCookieValueFromRequest(request, settings.cookieSettings.cookieNames.browserId);
  }

  return new IdentityEvent({
    id: browserId,
    identityData,
    sendEvent,
    settings: settings as Settings
  }).send();
}
