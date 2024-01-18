// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { SettingsParamsBrowser, getBrowserId, initCore } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';

/**
 * Initiates the Engage library using the global settings added by the developer
 * @param settingsInput - Global settings added by the developer
 * @returns A promise that resolves with an object that handles the library functionality
 */
export async function init(settingsInput: SettingsParamsBrowser): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error(
      // eslint-disable-next-line max-len
      `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
    );
  }

  await initCore(settingsInput);

  window.Engage ??= {};

  window.Engage = {
    ...window.Engage,
    getBrowserId: () => getBrowserId(),
    versions: {
      ...window.Engage.versions,
      personalize: LIBRARY_VERSION,
    },
  };
}
