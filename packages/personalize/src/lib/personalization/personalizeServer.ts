// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
  getEnabledPackageServer
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import { isNextJsMiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../consts';
import type { PersonalizeSettings } from '../initializer/browser/interfaces';
import { verifyPersonalizePackageExistence } from '../initializer/server/initializer';
import type { PersonalizeData, PersonalizeGeolocation } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param opts - An optional object containing additional options such as timeout.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns A flow execution response
 */
export function personalizeServer<T extends Request>(
  request: T,
  personalizeData: PersonalizeData,
  opts?: { timeout?: number }
): Promise<unknown | null | FailedCalledFlowsResponse> {
  verifyPersonalizePackageExistence();
  const requestUrl = new URL(request.url as string, `https://localhost`);
  const userAgent = isNextJsMiddlewareRequest(request)
    ? request.headers.get('user-agent')
    : request.headers['user-agent'];

  if (!personalizeData.geo && isNextJsMiddlewareRequest(request) && request.geo && Object.keys(request.geo).length)
    personalizeData.geo = request.geo as PersonalizeGeolocation;

  const settings: CloudSDKSettings = getCloudSDKSettingsServer();

  const personalizeSettings = getEnabledPackageServer(PACKAGE_NAME)?.settings as PersonalizeSettings;

  const browserId: string = getCookieValueFromRequest(request, settings.cookieSettings.name.browserId);
  const guestId: string = getCookieValueFromRequest(request, personalizeSettings.cookieSettings.name.guestId);

  return new Personalizer(browserId, guestId).getInteractiveExperienceData(
    personalizeData,
    settings,
    requestUrl.search,
    {
      timeout: opts?.timeout,
      userAgent
    }
  );
}
