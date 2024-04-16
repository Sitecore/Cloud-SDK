// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { PersonalizeData, Personalizer } from './personalizer';
import { getBrowserId, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../consts';
import { FailedCalledFlowsResponse } from './send-call-flows-request';
import { awaitInit } from '../initializer/client/initializer';

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param personalizeData - The required/optional attributes in order to create a flow execution
 * @param opts - An object containing additional options.
 * @returns A flow execution response
 */
export async function personalize(
  personalizeData: PersonalizeData,
  opts?: { timeout?: number }
): Promise<unknown | null | FailedCalledFlowsResponse> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0006);
  const id = getBrowserId();

  return new Personalizer(id).getInteractiveExperienceData(personalizeData, settings, window.location.search, {
    timeout: opts?.timeout
  });
}
