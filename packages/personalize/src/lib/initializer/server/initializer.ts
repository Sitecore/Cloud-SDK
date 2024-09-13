// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { PACKAGE_NAME, PERSONALIZE_NAMESPACE } from '../../consts';
import {
  PackageInitializerServer,
  debug,
  enabledPackagesServer as enabledPackages
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKServerInitializer } from '@sitecore-cloudsdk/core/server';

export async function sideEffects() {
  debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');
}

/**
 * Makes the functionality of the personalize package available.
 *
 * @returns An instance of {@link CloudSDKServerInitializer}
 *
 */
export function addPersonalize(this: CloudSDKServerInitializer): CloudSDKServerInitializer {
  const personalizeInitializer = new PackageInitializerServer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-cloudsdk/core/server' {
  interface CloudSDKServerInitializer {
    addPersonalize: typeof addPersonalize;
  }
}
