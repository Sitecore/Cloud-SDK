// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IHttpResponse, IMiddlewareNextResponse, TRequest } from '@sitecore-cloudsdk/utils';
import { handleServerCookie } from '../cookie/handle-server-cookie';
import { ISettings, ISettingsParamsServer } from '../settings/interfaces';
import { createSettings } from '../settings/create-settings';

/**
 * Internal settings object to be used by all functions in module caching.
 * It starts with a null value and is set to the proper object by the  function. *
 * Can be retrieved only through the  function.
 */
let coreSettings: ISettings | null = null;

export function setCoreSettings(settings: ISettings) {
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
    throw Error('[IE-0005] You must first initialize the "core" module. Run the "initServer" function.');
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
export async function initCoreServer<TResponse extends IMiddlewareNextResponse | IHttpResponse>(
  settingsInput: ISettingsParamsServer,
  request: TRequest,
  response: TResponse
): Promise<void> {
  if (!coreSettings) coreSettings = createSettings(settingsInput);

  if (settingsInput.enableServerCookie) {
    await handleServerCookie(request, response, settingsInput.timeout);
  }
}
