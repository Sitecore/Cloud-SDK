// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { SettingsParamsServer, initCoreServer } from '@sitecore-cloudsdk/core';
import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';

/**
 * Initiates the server Events library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function initServer<Response extends MiddlewareNextResponse | HttpResponse>(
  settingsInput: SettingsParamsServer,
  request: Request,
  response: Response
): Promise<void> {
  await initCoreServer(settingsInput, request, response);
}
