// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../../consts';
import type { ServerSettings } from '../../types';
import { initCoreServer } from '@sitecore-cloudsdk/core/internal';

let searchSettings: ServerSettings | null = null;

/**
 * Retrieves the current settings of the search-api-client.
 * @returns Settings - The current settings or throws error.
 */
export function getSettings(): ServerSettings {
  if (!searchSettings) throw Error(ErrorMessages.IE_0019);

  return searchSettings;
}

/* eslint-disable max-len */
/**
 * Initializes the search-api-client with the provided settings in a server.
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response
 * @param settings - The settings to initialize the search-api-client
 * @returns A promise that resolves with an object that handles the library functionality
 * @deprecated Cloud SDK v0.4 introduces new initialization logic. If you are upgrading from v0.3, we recommend that you upgrade your initialization code. The v0.3 initialization logic will be deprecated and removed in a future Cloud SDK release.
 */
/* eslint-enable max-len */
export async function initServer(request: Request, response: Response, settings: ServerSettings): Promise<void> {
  try {
    if (!settings.userId) throw new Error(ErrorMessages.MV_0005);
    await initCoreServer(settings, request, response);
    searchSettings = settings;
  } catch (error) {
    throw new Error(error as string);
  }
}
