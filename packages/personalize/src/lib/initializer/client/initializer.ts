// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BrowserSettings, debug, getBrowserId, initCore } from '@sitecore-cloudsdk/core';
import { ErrorMessages, LIBRARY_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';

export let initPromise: Promise<void> | null = null;

/**
 * Initiates the Engage library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settings: BrowserSettings): Promise<void> {
  if (typeof window === 'undefined') throw new Error(ErrorMessages.IE_0001);

  try {
    initPromise = initCore(settings);
    await initPromise;

    debug(PERSONALIZE_NAMESPACE)('personalizeClient library initialized');
  } catch (error) {
    debug(PERSONALIZE_NAMESPACE)('Error on initializing personalizeClient library with error: %o', error);
    initPromise = null;

    throw new Error(error as string);
  }

  window.Engage ??= {};

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(),
    versions: {
      ...window.Engage.versions,
      personalize: LIBRARY_VERSION
    }
  };
}

/**
 * A function that handles the async browser init logic. Throws an error or awaits the promise.
 */
export async function awaitInit() {
  if (initPromise === null) throw new Error(ErrorMessages.IE_0006);

  await initPromise;
}
