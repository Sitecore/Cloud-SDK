// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  API_VERSION,
  ICdpResponse,
  ISettingsParamsServer,
  TARGET_URL,
  createSettings,
  getBrowserIdFromRequest,
  handleServerCookie,
} from '@sitecore-cloudsdk/engage-core';
import {
  ICustomEventInput,
  CustomEvent,
  ExtensionData,
  IIdentityEventAttributesInput,
  IdentityEvent,
  IPageViewEventInput,
  PageViewEvent,
} from '../events';
import { EventApiClient } from '../cdp/EventApiClient';
import { IHttpResponse, IMiddlewareNextResponse, INestedObject, TRequest } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../consts';

/**
 * Initiates the server Events library using the global settings added by the developer
 * @param settings - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export function initServer(settingsInput: ISettingsParamsServer): EventsServer {
  const settings = createSettings(settingsInput);
  const eventApiClient = new EventApiClient(TARGET_URL, API_VERSION);

  return {
    event: (type, eventData, request, extensionData) => {
      const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
      return new CustomEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        settings: settings,
        type,
      }).send();
    },
    handleCookie: async (request, response, timeout) => {
      if (!settingsInput.enableServerCookie) return;
      await handleServerCookie(request, response, settings, timeout);
    },
    identity: (eventData, request, extensionData) => {
      const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
      return new IdentityEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        settings: settings,
      }).send();
    },
    pageView: (eventData, request, extensionData) => {
      const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
      // Host is irrelevant but necessary to support relative URL
      const requestUrl = new URL(request.url as string, `https://localhost`);
      return new PageViewEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        searchParams: requestUrl.search,
        settings: settings,
      }).send();
    },
    version: LIBRARY_VERSION,
  };
}

/**
 * Handles the library functionality
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface EventsServer {
  /**
   * A function that handles the server set cookie
   * @param  request - Interface with constraint for extending request
   * @param  response - Interface with constraint for extending response
   *
   * @throws [IE-0004] - This exception is thrown when this function isn't able to set the cookie.
   */
  handleCookie: <T extends TRequest, X extends IMiddlewareNextResponse | IHttpResponse>(
    request: T,
    response: X,
    timeout?: number
  ) => Promise<void>;

  /**
   * A function that sends an event to SitecoreCloud API with the specified type
   * @param type - The required type of the event
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param request - Interface with constraint for extending request
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * @returns The response object that Sitecore CDP returns
   */
  event: <T extends TRequest>(
    type: string,
    eventData: ICustomEventInput,
    request: T,
    extensionData?: ExtensionData
  ) => Promise<ICdpResponse | null>;

  /**
   * A function that sends an IDENTITY event to SitecoreCloud API
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param request - Interface with constraint for extending request
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   * @returns The response object that Sitecore CDP returns
   */
  identity: <T extends TRequest>(
    eventData: IIdentityEventAttributesInput,
    request: T,
    extensionData?: ExtensionData
  ) => Promise<ICdpResponse | null>;

  /**
   * A function that sends a VIEW event to SitecoreCloud API
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param request - Interface with constraint for extending request
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   * @returns The response object that Sitecore CDP returns
   */
  pageView: <T extends TRequest>(
    eventData: IPageViewEventInput,
    request: T,
    extensionData?: INestedObject
  ) => Promise<ICdpResponse | null>;

  /**
   * Returns the version of the library.
   */
  version: string;
}
