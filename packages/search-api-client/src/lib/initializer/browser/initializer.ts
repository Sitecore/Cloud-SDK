// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings } from '../../types';
import { ErrorMessages } from '../../const';
import { initCore } from '@sitecore-cloudsdk/core';

let searchSettings: BrowserSettings | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Retrieves the current settings of the search-api-client.
 * @returns The current settings or throws error.
 */
export function getSettings(): BrowserSettings {
  if (!searchSettings) throw Error(ErrorMessages.IE_0009);

  return searchSettings;
}

/**
 * Initializes the search-api-client with the provided settings.
 * @param settings - The settings to initialize the search-api-client with.
 */
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
  if (initPromise === null) throw new Error(ErrorMessages.IE_0009);

  await initPromise;
}
