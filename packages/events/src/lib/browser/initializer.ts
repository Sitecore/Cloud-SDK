// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  CustomEvent,
  PageViewEvent,
  IdentityEvent,
  ICustomEventInput,
  IIdentityEventAttributesInput,
  IPageViewEventInput,
} from '../events';
import { ExtensionData } from '../events/common-interfaces';
import { EventApiClient } from '../cdp/EventApiClient';
import {
  API_VERSION,
  ICdpResponse,
  IInfer,
  ISettingsParamsBrowser,
  Infer,
  createCookie,
  createSettings,
  getBrowserId,
  getGuestId,
  updatePointOfSale,
} from '@sitecore-cloudsdk/engage-core';
import { INestedObject, cookieExists } from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../consts';
import { EventQueue, QueueEventPayload } from '../eventStorage/eventStorage';

/**
 * Initiates the Events library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settingsInput: ISettingsParamsBrowser): Promise<Events> {
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
    await createCookie(settings.targetURL, settings.clientKey, settings.cookieSettings);
  }

  const id = getBrowserId(settings.cookieSettings.cookieName);

  const eventApiClient = new EventApiClient(settings.targetURL, API_VERSION);

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(settings.cookieSettings.cookieName),
    versions: {
      ...window.Engage?.versions,
      events: LIBRARY_VERSION,
    },
  };

  const infer = new Infer();

  const queue = new EventQueue(sessionStorage, eventApiClient, infer);

  return {
    addToEventQueue: (type, eventData, extensionData) => {
      const queueEventPayload: QueueEventPayload = {
        eventData,
        extensionData,
        id,
        settings,
        type,
      };
      queue.enqueueEvent(queueEventPayload);
    },
    clearEventQueue: () => {
      queue.clearQueue();
    },
    event: (type, eventData, extensionData) =>
      new CustomEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        infer,
        settings,
        type,
      }).send(),
    form: (formId, interactionType, pointOfSale) => {
      const undefinedInfer = {
        language: () => undefined,
        pageName: () => undefined,
      } as unknown as IInfer;

      return new CustomEvent({
        eventApiClient,
        eventData: { pointOfSale },
        extensionData: {
          formId,
          interactionType: interactionType.toUpperCase(),
        },
        id,
        infer: undefinedInfer,
        settings,
        type: 'FORM',
      }).send();
    },
    getBrowserId: () => getBrowserId(settings.cookieSettings.cookieName),
    getGuestId: () => getGuestId(id, settings.targetURL, settings.clientKey),
    identity: (eventData, extensionData) =>
      new IdentityEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        infer,
        settings,
      }).send(),
    pageView: (eventData, extensionData) =>
      new PageViewEvent({
        eventApiClient,
        eventData,
        extensionData,
        id,
        infer,
        searchParams: window.location.search,
        settings,
      }).send(),
    processEventQueue: () => queue.sendAllEvents(),
    updatePointOfSale: (pointOfSale) => updatePointOfSale(pointOfSale, settings),
    version: LIBRARY_VERSION,
  };
}

/**
 * Handles the library functionality
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Events {
  /**
   * A function that adds event to the queue
   * @param type - The required type of the event
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   */
  addToEventQueue: (type: string, eventData: ICustomEventInput, extensionData?: ExtensionData) => void;

  /**
   * Deletes the queue from session.
   */
  clearEventQueue: () => void;

  /**
   * A function that sends an event to SitecoreCloud API with the specified type
   * @param type - The required type of the event
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   * @returns The response object that Sitecore CDP returns
   */
  event: (type: string, eventData: ICustomEventInput, extensionData?: ExtensionData) => Promise<ICdpResponse | null>;

  /**
   * A function that sends a form event to SitecoreCloud API
   * @param formId - The required form ID string
   * @param interactionType - The required interaction type string. Possible values: "VIEWED", "SUBMITTED"
   * @param pointOfSale - The optional pointOfSale string. If you did not specify pointOfSale in the
   *  settings object, you must specify it here
   * @returns The response object that Sitecore CDP returns or null
   */
  form: (formId: string, interactionType: 'VIEWED' | 'SUBMITTED', pointOfSale?: string) => Promise<ICdpResponse | null>;

  /**
   * A function that sends an IDENTITY event to SitecoreCloud API
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   * @returns The response object that Sitecore CDP returns
   */
  identity: (eventData: IIdentityEventAttributesInput, extensionData?: ExtensionData) => Promise<ICdpResponse | null>;

  /**
   * A function that sends a VIEW event to SitecoreCloud API
   * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
   * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
   * This object will be flattened and sent in the ext object of the payload
   * @returns The response object that Sitecore CDP returns
   */
  pageView: (eventData: IPageViewEventInput, extensionData?: INestedObject) => Promise<ICdpResponse | null>;

  /**
   * A function that sends all queue events to SitecoreCloud API.
   * Clears the queue upon completion.
   */
  processEventQueue: () => void;

  /**
   * A function that updates the point of sale.
   * @param pointOfSale - The new point of sale
   */
  updatePointOfSale: (pointOfSale: string) => void;

  /**
   * A function that returns the browser id.
   * @returns
   */
  getBrowserId: () => string;

  /**
   * A function that returns the guest id.
   * @returns - A promise that resolves with the guest id
   * @throws - Will throw an error if the clientKey/browser id is invalid
   */
  getGuestId: () => Promise<string>;

  /**
   * Returns version of the library.
   */
  version: string;
}
