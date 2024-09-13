// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_VERSION } from '../../consts';
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
      events: PACKAGE_VERSION
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
