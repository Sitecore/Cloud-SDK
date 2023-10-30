// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserIdFromRequest } from '@sitecore-cloudsdk/engage-core';
import { IFailedCalledFlowsResponse } from './callflow-edge-proxy-client';
import { TRequest } from '@sitecore-cloudsdk/engage-utils';
import { getServerDependencies } from '../initializer/server/initializer';
import { IPersonalizerInput, Personalizer } from './personalizer';
/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param request - Interface with constraint for extending request
 * @param timeout - Optional timeout in milliseconds.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns A flow execution response
 */
export function personalizeServer<T extends TRequest>(
  personalizeData: IPersonalizerInput,
  request: T,
  timeout?: number
): Promise<unknown | null | IFailedCalledFlowsResponse> {
  const { callFlowEdgeProxyClient, settings } = getServerDependencies();
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  return new Personalizer(callFlowEdgeProxyClient, id).getInteractiveExperienceData(personalizeData, timeout);
}
