// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';
import { ServerSettings, Settings } from '../settings/interfaces';
import { CORE_NAMESPACE } from '../debug/namespaces';
import { ErrorMessages } from '../consts';
import { createSettings } from '../settings/create-settings';
import { debug } from '../debug/debug';
import { handleServerCookie } from '../cookie/handle-server-cookie';

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
    throw Error(ErrorMessages.IE_0008);
  }

  return coreSettings;
}

/**
 * Initializes the core settings for browser-based applications.
 *
 * This function initializes core settings for the application, including creating settings and handling cookies if enabled.
 *
 * @param settingsInput - The settings input to configure the core settings.
 * @param request - A request object of type HttpRequest or MiddlewareRequest
 * @param response - A response object of type HttpResponse or MiddlewareNextResponse
 * @returns A Promise that resolves when initialization is complete.
 */
export async function initCoreServer<Response extends MiddlewareNextResponse | HttpResponse>(
  settingsInput: ServerSettings,
  request: Request,
  response: Response
): Promise<void> {
  debug(CORE_NAMESPACE)('initializing %o', 'initCoreServer initialized');

  if (!coreSettings) coreSettings = createSettings(settingsInput);

  if (settingsInput.enableServerCookie) {
    await handleServerCookie(request, response, settingsInput.timeout);
  }
}
