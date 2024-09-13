// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EVENTS_NAMESPACE, PACKAGE_NAME } from '../../consts';
import {
  PackageInitializerServer,
  debug,
  enabledPackagesServer as enabledPackages
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKServerInitializer } from '@sitecore-cloudsdk/core/server';

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
