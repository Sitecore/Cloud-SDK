// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../consts';
import { awaitInit } from '../initializer/browser/initializer';
import type { PersonalizeSettings } from '../initializer/browser/interfaces';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';

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

  const cloudSDKSettings = getCloudSDKSettings();
  const personalizeSettings = getEnabledPackage(PACKAGE_NAME)?.settings as PersonalizeSettings;
  const browserId = getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
  const guestId = getCookieValueClientSide(personalizeSettings.cookieSettings.name.guestId);

  return new Personalizer(browserId, guestId).getInteractiveExperienceData(
    personalizeData,
    cloudSDKSettings,
    window.location.search,
    {
      timeout: opts?.timeout
    }
  );
}
