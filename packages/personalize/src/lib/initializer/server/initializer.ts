// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ServerSettings, initCoreServer, debug } from '@sitecore-cloudsdk/core';
import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';
import { PERSONALIZE_NAMESPACE } from '../../consts';

/**
 * Initiates the server Engage library using the global settings added by the developer
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function initServer<Response extends MiddlewareNextResponse | HttpResponse>(
  request: Request,
  response: Response,
  settings: ServerSettings
): Promise<void> {
  try {
    await initCoreServer(settings, request, response);

    debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');
  } catch (error) {
    debug(PERSONALIZE_NAMESPACE)('Error on initializing personalizeServer library with error: %o', error);

    throw new Error(error as string);
  }
}
