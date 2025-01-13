// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  debug,
  enabledPackagesServer as enabledPackages,
  getEnabledPackageServer as getEnabledPackage,
  PackageInitializerServer
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKServerInitializer } from '@sitecore-cloudsdk/core/server';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_NAME } from '../../consts';

export async function sideEffects() {
  debug(EVENTS_NAMESPACE)('eventsServer library initialized');
}

/**
 * Makes the functionality of the events package available.
 *
 * @returns An instance of {@link CloudSDKServerInitializer}
 */
export function addEvents(this: CloudSDKServerInitializer): CloudSDKServerInitializer {
  const eventsInitializer = new PackageInitializerServer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, eventsInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addEvents = addEvents;

declare module '@sitecore-cloudsdk/core/server' {
  interface CloudSDKServerInitializer {
    addEvents: typeof addEvents;
  }
}

export function verifyEventsPackageExistence() {
  if (!getEnabledPackage(PACKAGE_NAME)) throw Error(ErrorMessages.IE_0015);
}
