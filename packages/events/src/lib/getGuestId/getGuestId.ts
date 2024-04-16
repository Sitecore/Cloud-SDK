// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getBrowserId,
  getGuestId as getGuestIdFromCore,
  getSettings,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../consts';
import { awaitInit } from '../initializer/browser/initializer';

/**
 * A function that returns the guest id.
 * @returns - A promise that resolves with the guest id
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export async function getGuestId(): Promise<string> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0004);
  const id = getBrowserId();

  return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
