// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { SettingsParamsServer, getSettingsServer, initCoreServer } from '@sitecore-cloudsdk/core';
import { CallFlowEdgeProxyClient } from '../../personalization/callflow-edge-proxy-client';
import { BrowserPersonalizeSettings } from '../client/initializer';
import { HttpResponse, MiddlewareNextResponse, Request } from '@sitecore-cloudsdk/utils';

let serverDependencies: ServerPersonalize | null = null;
/**
 * Sets the personalize settings to be used by the application.
 *
 * @param settings - The personalize settings to be set, or `null` to clear the settings.
 */
export function setDependencies(settings: ServerPersonalize | null) {
  serverDependencies = settings;
}
/**
 * Retrieves the personalize server settings used by the application.
 *
 * @returns The personalize server settings.
 * @throws Error if the personalize server settings haven't been initialized.
 */
export function getServerDependencies(): ServerPersonalize {
  if (!serverDependencies) {
    throw Error(`[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.`);
  }

  return serverDependencies;
}

/**
 * Initiates the server Engage library using the global settings added by the developer
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
  const callFlowEdgeProxyClient = new CallFlowEdgeProxyClient(settings);

  setDependencies({
    callFlowEdgeProxyClient,
    settings: settings,
  });
}

export type ServerPersonalize = Omit<BrowserPersonalizeSettings, 'id'>;
