// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { type ServerSettings, initCoreServer } from '@sitecore-cloudsdk/core/internal';
import { PERSONALIZE_NAMESPACE } from '../../consts';
import { debug } from '@sitecore-cloudsdk/core/internal';

/* eslint-disable max-len */
/**
 * Initiates the server Engage library using the global settings added by the developer
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 * @deprecated Cloud SDK v0.4 introduces new initialization logic. If you are upgrading from v0.3, we recommend that you upgrade your initialization code. The v0.3 initialization logic will be deprecated and removed in a future Cloud SDK release.
 */
/* eslint-enable max-len */
export async function initServer(request: Request, response: Response, settings: ServerSettings): Promise<void> {
  try {
    await initCoreServer(settings, request, response);

    debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');
  } catch (error) {
    debug(PERSONALIZE_NAMESPACE)('Error on initializing personalizeServer library with error: %o', error);

    throw new Error(error as string);
  }
}
