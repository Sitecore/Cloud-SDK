// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  ISettings,
  ISettingsParamsBrowser,
  IWebPersonalizationConfig,
  getBrowserId,
  getSettings,
  initCore,
} from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import { CallFlowEdgeProxyClient } from '../../personalization/callflow-edge-proxy-client';

let dependencies: IBrowserPersonalizeSettings | null = null;
/**
 * Sets the personalize settings to be used by the application.
 *
 * @param settings - The personalize settings to be set, or `null` to clear the settings.
 */
export function setDependencies(settings: IBrowserPersonalizeSettings | null) {
  dependencies = settings;
}

/**
 * Retrieves the browser personalize settings object.
 *
 * This function ensures that the browser personalize settings have been initialized and contain essential properties like `settings` and `callFlowCDPClient`.
 *
 * @returns The browser personalize settings object.
 * @throws Error if the personalize settings haven't been initialized with the required properties.
 */
export function getDependencies(): IBrowserPersonalizeSettings {
  if (!dependencies) {
    throw Error(`[IE-0008] You must first initialize the "personalize" package. Run the "init" function.`);
  }
  return dependencies;
}
/**
 * Initiates the Engage library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settingsInput: ISettingsParamsBrowserPersonalize): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error(
      // eslint-disable-next-line max-len
      `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
    );
  }

  await initCore(settingsInput);

  const settings = getSettings();
  const id = getBrowserId();
  const callFlowEdgeProxyClient = new CallFlowEdgeProxyClient(settings);

  window.Engage ??= {};

  setDependencies({
    callFlowEdgeProxyClient,
    id,
    settings,
  });

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(),
    versions: {
      ...window.Engage.versions,
      personalize: LIBRARY_VERSION,
    },
  };
}

export type ISettingsParamsBrowserPersonalize = {
  webPersonalization?: boolean | IWebPersonalizationConfig;
} & ISettingsParamsBrowser;

export interface IBrowserPersonalizeSettings {
  id: string;
  settings: ISettings;
  callFlowEdgeProxyClient: CallFlowEdgeProxyClient;
}
