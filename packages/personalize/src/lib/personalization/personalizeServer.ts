// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages, PACKAGE_NAME } from '../consts';
import type { PersonalizeData, PersonalizeGeolocation } from './personalizer';
import {
  builderInstanceServer,
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
  getEnabledPackageServer,
  getSettingsServer,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';
import { Personalizer } from './personalizer';
import type { Request } from '@sitecore-cloudsdk/utils';
import type { Settings } from '@sitecore-cloudsdk/core/internal';
import { isNextJsMiddlewareRequest } from '@sitecore-cloudsdk/utils';

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
  const requestUrl = new URL(request.url as string, `https://localhost`);
  const userAgent = isNextJsMiddlewareRequest(request)
    ? request.headers.get('user-agent')
    : request.headers['user-agent'];

  if (!personalizeData.geo && isNextJsMiddlewareRequest(request) && request.geo && Object.keys(request.geo).length)
    personalizeData.geo = request.geo as PersonalizeGeolocation;

  let settings: Settings | CloudSDKSettings, id: string, guestId: string;

  if (builderInstanceServer) {
    if (!getEnabledPackageServer(PACKAGE_NAME)) throw new Error(ErrorMessages.IE_0017);

    settings = getCloudSDKSettingsServer();
    id = getCookieValueFromRequest(request, settings.cookieSettings.names.browserId);
    guestId = getCookieValueFromRequest(request, settings.cookieSettings.names.guestId);
  } else {
    settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0017);
    id = getCookieValueFromRequest(request, settings.cookieSettings.cookieNames.browserId);
    guestId = getCookieValueFromRequest(request, settings.cookieSettings.cookieNames.guestId);
  }

  return new Personalizer(id, guestId).getInteractiveExperienceData(
    personalizeData,
    settings as Settings,
    requestUrl.search,
    {
      timeout: opts?.timeout,
      userAgent
    }
  );
}
