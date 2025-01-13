// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse, Settings } from '@sitecore-cloudsdk/core/internal';
import {
  getCloudSDKSettingsServer as getCloudSDKSettings,
  getCookieValueFromRequest
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import { verifyEventsPackageExistence } from '../../initializer/server/initializer';
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
  verifyEventsPackageExistence();
  const settings: CloudSDKSettings = getCloudSDKSettings();
  const browserId: string = getCookieValueFromRequest(request, settings.cookieSettings.name.browserId);

  return new IdentityEvent({
    id: browserId,
    identityData,
    sendEvent,
    settings: settings as unknown as Settings
  }).send();
}
