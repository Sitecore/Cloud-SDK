// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { Settings, SettingsParamsServer, getSettingsServer, initCoreServer } from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../../ep/EventApiClient';
import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';

let serverDependencies: ServerEventsSettings | null = null;

export function setServerDependencies(settings: ServerEventsSettings | null) {
  serverDependencies = settings;
}

/**
 * Retrieves the server event settings object.
 *
 * This function ensures that the server event settings have been initialized and contain essential properties like `settings` and `eventApiClient`.
 *
 * @returns The server event settings object.
 * @throws Error if the server event settings haven't been initialized with the required properties.
 */
export function getServerDependencies(): ServerEventsSettings {
  if (!serverDependencies) {
    throw Error(`[IE-0005] You must first initialize the "events/server" module. Run the "init" function.`);
  }
  return serverDependencies;
}
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

  const settings = getSettingsServer();

  const eventApiClient = new EventApiClient(
    settings.sitecoreEdgeUrl,
    settings.sitecoreEdgeContextId,
    settings.siteName
  );
  setServerDependencies({
    eventApiClient,
    settings,
  });
}

export interface ServerEventsSettings {
  settings: Settings;
  eventApiClient: EventApiClient;
}
