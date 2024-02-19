// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserIdFromRequest, getSettingsServer, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { FailedCalledFlowsResponse } from './send-call-flows-request';
import { Request } from '@sitecore-cloudsdk/utils';
import { PersonalizerInput, Personalizer } from './personalizer';
import { ErrorMessages } from '../consts';
/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param request - Interface with constraint for extending request
 * @param timeout - Optional timeout in milliseconds.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns A flow execution response
 */
export function personalizeServer<T extends Request>(
  personalizeData: PersonalizerInput,
  request: T,
  timeout?: number
): Promise<unknown | null | FailedCalledFlowsResponse> {
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0007);
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  return new Personalizer(id).getInteractiveExperienceData(personalizeData, settings, timeout);
}
