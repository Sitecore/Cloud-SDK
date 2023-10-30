// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IFailedCalledFlowsResponse } from './callflow-edge-proxy-client';
import { getDependencies } from '../initializer/client/initializer';
import { IPersonalizerInput, Personalizer } from './personalizer';
/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param timeout - Optional timeout in milliseconds.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns A flow execution response
 */
export function personalize(
  personalizeData: IPersonalizerInput,
  timeout?: number
): Promise<unknown | null | IFailedCalledFlowsResponse> {
  const { callFlowEdgeProxyClient, id } = getDependencies();
  return new Personalizer(callFlowEdgeProxyClient, id).getInteractiveExperienceData(personalizeData, timeout);
}
