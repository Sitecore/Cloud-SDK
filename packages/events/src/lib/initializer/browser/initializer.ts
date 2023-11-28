// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { EventApiClient } from '../../ep/EventApiClient';
import { ISettings, ISettingsParamsBrowser, getBrowserId, getSettings, initCore } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import { EventQueue } from '../../eventStorage/eventStorage';

let dependencies: IBrowserEventsSettings | null = null;

export function setDependencies(settings: IBrowserEventsSettings | null) {
  dependencies = settings;
}

/**
 * Retrieves the browser event settings object.
 *
 * This function ensures that the browser event settings have been initialized and contain essential properties like `settings`, `eventQueue`, and `eventApiClient`.
 *
 * @returns The browser event settings object.
 * @throws Error if the event settings haven't been initialized with the required properties.
 */
export function getDependencies(): IBrowserEventsSettings {
  if (!dependencies) {
    throw Error(`[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`);
  }
  return dependencies;
}

export interface IBrowserEventsSettings {
  id: string;
  settings: ISettings;
  eventQueue: EventQueue;
  eventApiClient: EventApiClient;
}

/**
 * Initiates the Events library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settingsInput: ISettingsParamsBrowser): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error(
      // eslint-disable-next-line max-len
      `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
    );
  }

  await initCore(settingsInput);

  const settings = getSettings();

  const id = getBrowserId();
  const eventApiClient = new EventApiClient(
    settings.sitecoreEdgeUrl,
    settingsInput.sitecoreEdgeContextId,
    settingsInput.siteName
  );
  const eventQueue = new EventQueue(sessionStorage, eventApiClient);

  setDependencies({
    eventApiClient,
    eventQueue,
    id,
    settings,
  });

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(),
    versions: {
      ...window.Engage?.versions,
      events: LIBRARY_VERSION,
    },
  };
}
