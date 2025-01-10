// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  debug,
  enabledPackagesServer as enabledPackages,
  getEnabledPackageServer as getEnabledPackage,
  PackageInitializerServer
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKServerInitializer } from '@sitecore-cloudsdk/core/server';
import { PACKAGE_NAME as EVENTS_PACKAGE_NAME, PACKAGE_INITIALIZER_METHOD_NAME } from '@sitecore-cloudsdk/events/server';
import { ErrorMessages, PACKAGE_NAME, SEARCH_NAMESPACE } from '../../consts';
import type { ServerSettings } from './interfaces';

export async function sideEffects() {
  debug(SEARCH_NAMESPACE)('searchServer library initialized');
}

/**
 * Makes the functionality of the search-api-client package available.
 *  This functionality also requires the events package.
 *
 * @param settings - The optional settings to initialize the search-api-client
 * @returns An instance of {@link CloudSDKServerInitializer}
 *
 * @example
 * ```
 * CloudSDK().addEvents().addSearch().initialize()
 * ```
 */
export function addSearch(this: CloudSDKServerInitializer, settings?: ServerSettings): CloudSDKServerInitializer {
  const searchInitializer = new PackageInitializerServer({
    dependencies: [{ method: PACKAGE_INITIALIZER_METHOD_NAME, name: EVENTS_PACKAGE_NAME }],
    settings,
    sideEffects
  });

  enabledPackages.set(PACKAGE_NAME, searchInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addSearch = addSearch;

declare module '@sitecore-cloudsdk/core/server' {
  interface CloudSDKServerInitializer {
    addSearch: typeof addSearch;
  }
}

export function verifySearchPackageExistence() {
  if (!getEnabledPackage(PACKAGE_NAME)) throw Error(ErrorMessages.IE_0019);
}
