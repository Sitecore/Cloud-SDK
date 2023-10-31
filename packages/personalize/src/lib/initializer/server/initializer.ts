// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParamsServer, getSettingsServer, initCoreServer } from '@sitecore-cloudsdk/core';
import { CallFlowEdgeProxyClient } from '../../personalization/callflow-edge-proxy-client';
import { IBrowserPersonalizeSettings } from '../client/initializer';
import { IHttpResponse, IMiddlewareNextResponse, TRequest } from '@sitecore-cloudsdk/utils';

let serverDependencies: IServerPersonalize | null = null;
/**
 * Sets the personalize settings to be used by the application.
 *
 * @param settings - The personalize settings to be set, or `null` to clear the settings.
 */
export function setDependencies(settings: IServerPersonalize | null) {
  serverDependencies = settings;
}
/**
 * Retrieves the personalize server settings used by the application.
 *
 * @returns The personalize server settings.
 * @throws Error if the personalize server settings haven't been initialized.
 */
export function getServerDependencies(): IServerPersonalize {
  if (!serverDependencies) {
    throw Error(`[IE-0009] You must first initialize the "personalize" module. Run the "initServer" function.`);
  }

  return serverDependencies;
}

/**
 * Initiates the server Engage library using the global settings added by the developer
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
  const callFlowEdgeProxyClient = new CallFlowEdgeProxyClient(settings);

  setDependencies({
    callFlowEdgeProxyClient,
    settings: settings,
  });
}

export type IServerPersonalize = Omit<IBrowserPersonalizeSettings, 'id'>;
