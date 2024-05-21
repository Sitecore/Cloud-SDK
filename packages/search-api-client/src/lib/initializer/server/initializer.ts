// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../const';
import type { ServerSettings } from '../../types';
import { initCoreServer } from '@sitecore-cloudsdk/core';

let searchSettings: ServerSettings | null = null;

/**
 * Retrieves the current settings of the search-api-client.
 * @returns Settings - The current settings or throws error.
 */
export function getSettings(): ServerSettings {
  if (!searchSettings) throw Error(ErrorMessages.IE_0010);

  return searchSettings;
}

/**
 * Initializes the search-api-client with the provided settings in a server.
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response
 * @param settings - The settings to initialize the search-api-client
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function initServer<Response extends MiddlewareNextResponse | HttpResponse>(
  request: Request,
  response: Response,
  settings: ServerSettings
): Promise<void> {
  try {
    if (!settings.userId) throw new Error(ErrorMessages.MV_0005);
    await initCoreServer(settings, request, response);
    searchSettings = settings;
    getSettings();
  } catch (error) {
    throw new Error(error as string);
  }
}
