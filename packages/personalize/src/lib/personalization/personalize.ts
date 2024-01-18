// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { FailedCalledFlowsResponse } from './send-call-flows-request';
import { getBrowserId, getSettings } from '@sitecore-cloudsdk/core';
import { PersonalizerInput, Personalizer } from './personalizer';
/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param timeout - Optional timeout in milliseconds.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns A flow execution response
 */
export function personalize(
  personalizeData: PersonalizerInput,
  timeout?: number
): Promise<unknown | null | FailedCalledFlowsResponse> {
  const id = getBrowserId();
  const settings = getSettings();

  return new Personalizer(id).getInteractiveExperienceData(personalizeData, settings, timeout);
}
