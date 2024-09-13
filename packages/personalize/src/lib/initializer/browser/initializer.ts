// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { PACKAGE_NAME, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import {
  PackageInitializer,
  debug,
  enabledPackagesBrowser as enabledPackages,
  getCloudSDKSettingsBrowser as getCloudSDKSettings
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';

export async function sideEffects() {
  window.Engage ??= {};
  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getCookieValueClientSide(getCloudSDKSettings().cookieSettings.names.browserId),
    versions: {
      ...window.Engage.versions,
      personalize: PACKAGE_VERSION
    }
  };

  debug(PERSONALIZE_NAMESPACE)('personalizeClient library initialized');
}

/**
 * Makes the functionality of the personalize package available.
 *
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 */
export function addPersonalize(this: CloudSDKBrowserInitializer): CloudSDKBrowserInitializer {
  const personalizeInitializer = new PackageInitializer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-cloudsdk/core/browser' {
  interface CloudSDKBrowserInitializer {
    addPersonalize: typeof addPersonalize;
  }
}
