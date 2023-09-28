// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  ISettingsParamsBrowser,
  IWebPersonalizationConfig,
  Infer,
  createCookie,
  createSettings,
  getBrowserId,
} from '@sitecore-cloudsdk/engage-core';
import { cookieExists } from '@sitecore-cloudsdk/engage-utils';
import { loadPlugins } from '../../extensions/load-plugins';
import { LIBRARY_VERSION } from '../../consts';
import { IPersonalizerInput, Personalizer } from '../../personalization/personalizer';
import { CallFlowCDPClient, IFailedCalledFlowsResponse } from '../../personalization/callflow-cdp-client';

export type ISettingsParamsBrowserPersonalize = {
  webPersonalization?: boolean | IWebPersonalizationConfig;
} & ISettingsParamsBrowser;

/**
 * Initiates the Engage library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settingsInput: ISettingsParamsBrowserPersonalize): Promise<Personalize> {
  if (typeof window === 'undefined') {
    throw new Error(
      // eslint-disable-next-line max-len
      `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
    );
  }

  const settings = createSettings(settingsInput);

  if (
    !settings.cookieSettings.forceServerCookieMode &&
    !cookieExists(window.document.cookie, settings.cookieSettings.cookieName)
  ) {
    createCookie(settings.targetURL, settings.clientKey, settings.cookieSettings);
  }

  const id = getBrowserId(settings.cookieSettings.cookieName);

  window.Engage ??= {};

  await loadPlugins(settingsInput);

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(settings.cookieSettings.cookieName),
    versions: {
      ...window.Engage.versions,
      personalize: LIBRARY_VERSION,
    },
  };

  const infer = new Infer();

  const callFlowCDPClient = new CallFlowCDPClient(settings);

  return {
    personalize: (personalizeData, timeout) => {
      return new Personalizer(callFlowCDPClient, id, infer).getInteractiveExperienceData(personalizeData, timeout);
    },
    version: LIBRARY_VERSION,
  };
}

/**
 * Handles the library functionality
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Personalize {
  /**
   * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
   * @param personalizeData - The required/optional attributes in order to create a flow execution
   * @param timeout - Optional timeout in milliseconds.
   * Used to abort the request to execute an interactive experiment or web experiment.
   * @returns A flow execution response
   */
  personalize: (
    personalizeData: IPersonalizerInput,
    timeout?: number
  ) => Promise<unknown | null | IFailedCalledFlowsResponse>;

  /**
   * Returns version of the library.
   */
  version: string;
}
