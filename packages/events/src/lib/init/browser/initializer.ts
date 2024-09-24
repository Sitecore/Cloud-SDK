// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EVENTS_NAMESPACE, ErrorMessages, PACKAGE_NAME, PACKAGE_VERSION } from '../../consts';
import {
  debug,
  getBrowserId,
  getEnabledPackageBrowser as getEnabledPackage,
  initCore
} from '@sitecore-cloudsdk/core/internal';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';

export let initPromise: Promise<void> | null = null;

/* eslint-disable max-len */
/**
 * Initiates the Events library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 * @deprecated Cloud SDK v0.4 introduces new initialization logic. If you are upgrading from v0.3, we recommend that you upgrade your initialization code. The v0.3 initialization logic will be deprecated and removed in a future Cloud SDK release.
 */
/* eslint-enable max-len */
export async function init(settings: BrowserSettings): Promise<void> {
  if (typeof window === 'undefined') throw new Error(ErrorMessages.IE_0001);

  try {
    initPromise = initCore(settings);

    await initPromise;

    debug(EVENTS_NAMESPACE)('eventsClient library initialized');
  } catch (error) {
    debug(EVENTS_NAMESPACE)('Error on initializing eventsClient library: %o', error);

    initPromise = null;

    throw new Error(error as string);
  }

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(),
    versions: {
      ...window.Engage?.versions,
      events: PACKAGE_VERSION
    }
  };
}

/**
 * A function that handles the async browser init logic. Throws an error or awaits the promise.
 */
export async function awaitInit() {
  const initState = getEnabledPackage(PACKAGE_NAME)?.initState;

  if (initPromise === null && !initState) throw new Error(ErrorMessages.IE_0014);

  initPromise ? await initPromise : await initState;
}
