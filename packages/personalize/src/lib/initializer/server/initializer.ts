// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  ISettingsParamsServer,
  createSettings,
  getBrowserIdFromRequest,
  handleServerCookie,
} from '@sitecore-cloudsdk/engage-core';
import { CallFlowCDPClient, IFailedCalledFlowsResponse } from '../../personalization/callflow-cdp-client';
import { IPersonalizerInput, Personalizer } from '../../personalization/personalizer';
import { IHttpResponse, IMiddlewareNextResponse, TRequest } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../../consts';

/**
 * Initiates the server Engage library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export function initServer(settingsInput: ISettingsParamsServer): PersonalizeServer {
  const settings = createSettings(settingsInput);
  const callFlowCDPClient = new CallFlowCDPClient(settings);

  return {
    handleCookie: async (request, response, timeout) => {
      if (!settings.cookieSettings.forceServerCookieMode) return;
      await handleServerCookie(request, response, settings, timeout);
    },
    personalize: (personalizeData, request, timeout) => {
      const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);

      return new Personalizer(callFlowCDPClient, id).getInteractiveExperienceData(personalizeData, timeout);
    },
    version: LIBRARY_VERSION,
  };
}

/**
 * Handles the library functionality
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface PersonalizeServer {
  /**
   * A function that handles the server set cookie
   * @param  request - Interface with constraint for extending request
   * @param  response - Interface with constraint for extending response
   */
  handleCookie: <T extends TRequest, X extends IMiddlewareNextResponse | IHttpResponse>(
    request: T,
    response: X,
    timeout?: number
  ) => Promise<void>;

  /**
   * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
   * @param personalizeData - The required/optional attributes in order to create a flow execution
   * @param request - Interface with constraint for extending request
   * @param timeout - Optional timeout in milliseconds.
   * Used to abort the request to execute an interactive experiment or web experiment.
   * @returns A flow execution response
   */
  personalize: <T extends TRequest>(
    personalizeData: IPersonalizerInput,
    request: T,
    timeout?: number
  ) => Promise<unknown | null | IFailedCalledFlowsResponse>;

  /**
   * Returns the version of the library.
   */
  version: string;
}
