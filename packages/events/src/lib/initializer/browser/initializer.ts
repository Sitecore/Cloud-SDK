// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import { debug, enabledPackagesBrowser as enabledPackages, PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import { EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_VERSION } from '../../consts';

export async function sideEffects() {
  window.scCloudSDK = {
    ...window.scCloudSDK,
    events: {
      version: PACKAGE_VERSION
    }
  };

  debug(EVENTS_NAMESPACE)('eventsClient library initialized');
}

/**
 * Makes the functionality of the events package available.
 *
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 */
export function addEvents(this: CloudSDKBrowserInitializer): CloudSDKBrowserInitializer {
  const eventsInitializer = new PackageInitializer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, eventsInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addEvents = addEvents;

declare module '@sitecore-cloudsdk/core/browser' {
  interface CloudSDKBrowserInitializer {
    addEvents: typeof addEvents;
  }
}

declare global {
  interface Events {
    version: string;
  }
}
