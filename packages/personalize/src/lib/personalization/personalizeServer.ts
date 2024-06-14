// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { PersonalizeData, PersonalizeGeolocation } from './personalizer';
import { getCookieValueFromRequest, getSettingsServer, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../consts';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';
import { Personalizer } from './personalizer';
import type { Request } from '@sitecore-cloudsdk/utils';
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
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0007);
  const id = getCookieValueFromRequest(request, settings.cookieSettings.cookieName);
  const guestRef = getCookieValueFromRequest(request, 'guestRef');

  const requestUrl = new URL(request.url as string, `https://localhost`);

  const userAgent = isNextJsMiddlewareRequest(request)
    ? request.headers.get('user-agent')
    : request.headers['user-agent'];

  if (!personalizeData.geo && isNextJsMiddlewareRequest(request) && request.geo && Object.keys(request.geo).length)
    personalizeData.geo = request.geo as PersonalizeGeolocation;

  return new Personalizer(id, guestRef).getInteractiveExperienceData(personalizeData, settings, requestUrl.search, {
    timeout: opts?.timeout,
    userAgent
  });
}
