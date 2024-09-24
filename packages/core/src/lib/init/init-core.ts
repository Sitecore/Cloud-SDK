// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, Settings } from '../settings/interfaces';
import { CORE_NAMESPACE } from '../debug/namespaces';
import { ErrorMessages } from '../consts';
import { createCookies } from '../cookie/create-cookies';
import { createSettings } from '../settings/create-settings';
import { debug } from '../debug/debug';

/**
 * Internal settings object to be used by all functions in module caching.
 * It starts with a null value and is set to the proper object by the  function. *
 * Can be retrieved only through the  function.
 */
let coreSettings: Settings | null = null;

/**
 * Retrieves the core settings object.
 *
 * This function ensures that the core settings have been initialized and contain essential properties
 * like `clientKey`, `cookieSettings`, and `targetURL`.
 *
 * @returns The core settings object.
 * @throws Error if the core settings haven't been initialized with the required properties.
 */
export function getSettings() {
  if (!coreSettings) throw Error(ErrorMessages.IE_0008);

  return coreSettings;
}

let createCookiesPromise: Promise<void> | null = null;

/* eslint-disable max-len */
/**
 * Initializes the core settings for browser-based applications.
 *
 * This function initializes core settings for the application,
 * including creating settings and handling cookies if enabled.
 *
 * @param settingsInput - The settings input to configure the core settings.
 * @returns A Promise that resolves when initialization is complete.
 * @deprecated Cloud SDK v0.4 introduces a new initialization logic. If you are upgrading from v0.3, we recommend that you upgrade your initialization code.The v0.3 initialization logic is now deprecated and will be removed in a future Cloud SDK release.
 */
/* eslint-enable max-len */
export async function initCore(settingsInput: BrowserSettings): Promise<void> {
  debug(CORE_NAMESPACE)('coreClient library initialized');

  if (coreSettings === null) coreSettings = createSettings(settingsInput);

  if (settingsInput.enableBrowserCookie && createCookiesPromise === null)
    createCookiesPromise = createCookies(coreSettings);

  await createCookiesPromise;
}

/**
 * Helper functions for tests
 */
export function setCoreSettings(settings: Settings) {
  coreSettings = settings;
}
export function setCookiePromise(promise: Promise<void>) {
  createCookiesPromise = promise;
}

interface Engage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  getBrowserId?: () => string;
  versions?: {
    personalize?: string | undefined;
    events?: string | undefined;
  };
}

/* eslint-disable @typescript-eslint/naming-convention*/
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Engage: Engage;
  }
}
