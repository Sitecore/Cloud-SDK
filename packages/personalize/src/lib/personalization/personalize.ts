// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserId, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../consts';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import { awaitInit } from '../initializer/client/initializer';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';

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
  const guestRef = getCookieValueClientSide('guestRef');

  return new Personalizer(id, guestRef).getInteractiveExperienceData(
    personalizeData,
    settings,
    window.location.search,
    {
      timeout: opts?.timeout
    }
  );
}
