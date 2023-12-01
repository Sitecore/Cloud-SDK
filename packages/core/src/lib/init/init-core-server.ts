// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';
import { handleServerCookie } from '../cookie/handle-server-cookie';
import { Settings, SettingsParamsServer } from '../settings/interfaces';
import { createSettings } from '../settings/create-settings';

/**
 * Internal settings object to be used by all functions in module caching.
 * It starts with a null value and is set to the proper object by the  function. *
 * Can be retrieved only through the  function.
 */
let coreSettings: Settings | null = null;

export function setCoreSettings(settings: Settings) {
  coreSettings = settings;
}

/**
 * Initializes the core settings for browser-based applications.
 *
 * This function initializes core settings for the application, including creating settings and handling cookies if enabled.
 *
 * @param settingsInput - The settings input to configure the core settings.
 * @returns A Promise that resolves when initialization is complete.
 */
export function getSettingsServer() {
  if (!coreSettings) {
    throw Error('[IE-0008] You must first initialize the "core" package. Run the "init" function.');
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
export async function initCoreServer<Response extends MiddlewareNextResponse | HttpResponse>(
  settingsInput: SettingsParamsServer,
  request: Request,
  response: Response
): Promise<void> {
  if (!coreSettings) coreSettings = createSettings(settingsInput);

  if (settingsInput.enableServerCookie) {
    await handleServerCookie(request, response, settingsInput.timeout);
  }
}
