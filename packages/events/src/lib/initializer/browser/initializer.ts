// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import { debug, enabledPackagesBrowser as enabledPackages, PackageInitializer } from '@sitecore-cloudsdk/core/internal';
import { EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_VERSION } from '../../consts';
import { event } from '../../events/custom-event/event';
import { form } from '../../events/custom-event/form';
import { identity } from '../../events/identity/identity';
import { pageView } from '../../events/page-view/page-view';
import { addToEventQueue } from '../../eventStorage/addToEventQueue';
import { clearEventQueue } from '../../eventStorage/clearEventQueue';
import { processEventQueue } from '../../eventStorage/processEventQueue';

export async function sideEffects() {
  window.scCloudSDK = {
    ...window.scCloudSDK,
    events: {
      addToEventQueue,
      clearEventQueue,
      event,
      form,
      identity,
      pageView,
      processEventQueue,
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
    pageView?: typeof pageView;
    identity?: typeof identity;
    form?: typeof form;
    event?: typeof event;
    addToEventQueue?: typeof addToEventQueue;
    processEventQueue?: typeof processEventQueue;
    clearEventQueue?: typeof clearEventQueue;
  }
}
