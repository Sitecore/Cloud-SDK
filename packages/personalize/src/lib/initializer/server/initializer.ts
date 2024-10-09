// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  COOKIE_NAME_PREFIX,
  debug,
  enabledPackagesServer as enabledPackages,
  getCloudSDKRequest,
  getCloudSDKResponse,
  getCloudSDKSettingsServer,
  getEnabledPackageServer,
  PackageInitializerServer
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKServerInitializer } from '@sitecore-cloudsdk/core/server';
import { PACKAGE_NAME, PERSONALIZE_NAMESPACE } from '../../consts';
import { createPersonalizeCookie } from './createPersonalizeCookie';
import type { PersonalizeSettings, ServerSettings } from './interfaces';

export async function sideEffects() {
  const cloudSDKSettings = getCloudSDKSettingsServer();
  const personalizeSettings = getEnabledPackageServer(PACKAGE_NAME)?.settings as PersonalizeSettings;

  debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');

  if (!cloudSDKSettings.cookieSettings.enableServerCookie || !personalizeSettings.enablePersonalizeCookie) return;
  await createPersonalizeCookie(getCloudSDKRequest(), getCloudSDKResponse(), personalizeSettings, cloudSDKSettings);
}

/**
 * Makes the functionality of the personalize package available.
 *
 * @returns An instance of {@link CloudSDKServerInitializer}
 *
 */
export function addPersonalize(
  this: CloudSDKServerInitializer,
  settings: ServerSettings = { enablePersonalizeCookie: false }
): CloudSDKServerInitializer {
  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${getCloudSDKSettingsServer().sitecoreEdgeContextId}_personalize`
    }
  };

  const personalizeInitializer = new PackageInitializerServer({
    settings: { ...settings, cookieSettings },
    sideEffects
  });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-cloudsdk/core/server' {
  interface CloudSDKServerInitializer {
    addPersonalize: typeof addPersonalize;
  }
}
