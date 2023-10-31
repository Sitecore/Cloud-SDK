// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  ISettings,
  ISettingsParamsServer,
  getSettingsServer,
  initCoreServer,
  TARGET_URL,
} from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../../cdp/EventApiClient';
import { IHttpResponse, IMiddlewareNextResponse, TRequest } from '@sitecore-cloudsdk/utils';

let serverDependencies: IServerEventsSettings | null = null;

export function setServerDependencies(settings: IServerEventsSettings | null) {
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
export function getServerDependencies(): IServerEventsSettings {
  if (!serverDependencies) {
    throw Error(`[IE-0007] You must first initialize the "events" module. Run the "initServer" function.`);
  }
  return serverDependencies;
}
/**
 * Initiates the server Events library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function initServer<TResponse extends IMiddlewareNextResponse | IHttpResponse>(
  settingsInput: ISettingsParamsServer,
  request: TRequest,
  response: TResponse
): Promise<void> {
  await initCoreServer(settingsInput, request, response);

  const settings = getSettingsServer();

  const eventApiClient = new EventApiClient(TARGET_URL, settingsInput.sitecoreEdgeContextId, settingsInput.siteName);
  setServerDependencies({
    eventApiClient,
    settings,
  });
}

export interface IServerEventsSettings {
  settings: ISettings;
  eventApiClient: EventApiClient;
}
