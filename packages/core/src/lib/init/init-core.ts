// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { createCookie } from '../cookie/create-cookie';
import { createSettings } from '../settings/create-settings';
import { ISettings, ISettingsParamsBrowser } from '../settings/interfaces';

/**
 * Enum representing the initialization statuses.
 * - `NOT_STARTED`: The initialization process has not started.
 * - `INITIALIZING`: The initialization process is in progress.
 * - `DONE`: The initialization process is complete.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum INIT_STATUSES {
  NOT_STARTED,
  INITIALIZING,
  DONE,
}

/**
 * Internal settings object to be used by all functions in module caching.
 * It starts with a null value and is set to the proper object by the  function. *
 * Can be retrieved only through the  function.
 */
let coreSettings: ISettings | null = null;

let initStatus = INIT_STATUSES.NOT_STARTED;

export function setInitStatus(status: INIT_STATUSES) {
  initStatus = status;
}

export function setCoreSettings(settings: ISettings) {
  coreSettings = settings;
}

/**
 * Retrieves the core settings object.
 *
 * This function ensures that the core settings have been initialized and contain essential properties like `clientKey`, `cookieSettings`, and `targetURL`.
 *
 * @returns The core settings object.
 * @throws Error if the core settings haven't been initialized with the required properties.
 */
export function getSettings() {
  if (!coreSettings) {
    throw Error(`[IE-0004] You must first initialize the "core" package. Run the "init" function.`);
  }
  return coreSettings;
}

/**
 * Initializes the core settings for browser-based applications.
 *
 * This function initializes core settings for the application, including creating settings and handling cookies if enabled.
 *
 * @param settingsInput - The settings input to configure the core settings.
 * @returns A Promise that resolves when initialization is complete.
 */
export async function initCore(settingsInput: ISettingsParamsBrowser): Promise<void> {
  if (initStatus != INIT_STATUSES.NOT_STARTED) return;

  setInitStatus(INIT_STATUSES.INITIALIZING);

  coreSettings = createSettings(settingsInput);

  setCoreSettings(coreSettings);

  if (settingsInput.enableBrowserCookie) {
    await createCookie(coreSettings);
  }

  setInitStatus(INIT_STATUSES.DONE);
}
