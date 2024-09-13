// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import { getEnabledPackageBrowser as getEnabledPackage, initCore } from '@sitecore-cloudsdk/core/internal';
import type { BrowserSettings } from '../../types';

let searchSettings: BrowserSettings | null = null;
export let initPromise: Promise<void> | null = null;

/**
 * Retrieves the current settings of the search-api-client.
 * @returns The current settings or throws error.
 */
export function getSettings(): BrowserSettings {
  if (!searchSettings) throw Error(ErrorMessages.IE_0018);

  return searchSettings;
}

/* eslint-disable max-len */
/**
 * Initializes the search-api-client with the provided settings.
 * @param settings - The settings to initialize the search-api-client with.
 * @deprecated Cloud SDK v0.4 introduces new initialization logic. If you are upgrading from v0.3, we recommend that you upgrade your initialization code. The v0.3 initialization logic will be deprecated and removed in a future Cloud SDK release.
 */
/* eslint-enable max-len */
export async function init(settings: BrowserSettings): Promise<void> {
  if (typeof window === 'undefined') throw new Error(ErrorMessages.IE_0001);

  try {
    initPromise = initCore(settings);
    searchSettings = settings;
    await initPromise;
  } catch (error) {
    initPromise = null;

    throw new Error(error as string);
  }
}

/**
 * A function that handles the async browser init logic. Throws an error or awaits the promise.
 */
export async function awaitInit() {
  const initState = getEnabledPackage(PACKAGE_NAME)?.initState;

  if (initPromise === null && !initState) throw new Error(ErrorMessages.IE_0018);

  initPromise ? await initPromise : await initState;
}
