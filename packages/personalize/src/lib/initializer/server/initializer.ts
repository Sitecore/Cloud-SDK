// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { SettingsParamsServer, initCoreServer, debug } from '@sitecore-cloudsdk/core';
import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';
import { PERSONALIZE_NAMESPACE } from '../../consts';

/**
 * Initiates the server Engage library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response.
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function initServer<Response extends MiddlewareNextResponse | HttpResponse>(
  settingsInput: SettingsParamsServer,
  request: Request,
  response: Response
): Promise<void> {
  try {
    await initCoreServer(settingsInput, request, response);
    debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');
  } catch (error) {
    debug(PERSONALIZE_NAMESPACE)('Error on initializing personalizeServer library with error: %o', error);
    throw new Error(error as string);
  }
}
