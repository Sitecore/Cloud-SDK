// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import {
  debug,
  enabledPackagesBrowser as enabledPackages,
  getEnabledPackageBrowser as getEnabledPackage,
  PackageInitializer
} from '@sitecore-cloudsdk/core/internal';
import {
  PACKAGE_NAME as EVENTS_PACKAGE_NAME,
  PACKAGE_INITIALIZER_METHOD_NAME
} from '@sitecore-cloudsdk/events/browser';
import { ErrorMessages, PACKAGE_NAME, SEARCH_NAMESPACE } from '../../consts';

// eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
export async function sideEffects() {
  debug(SEARCH_NAMESPACE)('searchClient library initialized');
}

/**
 * Makes the functionality of the search package available.
 *  This functionality also requires the events package.
 *
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 *
 * @example
 * ```
 * CloudSDK().addEvents().addSearch().initialize()
 * ```
 */
export function addSearch(this: CloudSDKBrowserInitializer): CloudSDKBrowserInitializer {
  const searchInitializer = new PackageInitializer({
    dependencies: [{ method: PACKAGE_INITIALIZER_METHOD_NAME, name: EVENTS_PACKAGE_NAME }],
    sideEffects
  });

  enabledPackages.set(PACKAGE_NAME, searchInitializer as PackageInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addSearch = addSearch;

declare module '@sitecore-cloudsdk/core/browser' {
  interface CloudSDKBrowserInitializer {
    addSearch: typeof addSearch;
  }
}

/**
 * A function that handles the async browser init logic. Throws an error or awaits the promise.
 */
export async function awaitInit() {
  const initState = getEnabledPackage(PACKAGE_NAME)?.initState;

  if (!initState) throw new Error(ErrorMessages.IE_0018);

  await initState;
}
