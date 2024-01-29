// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { awaitInit } from '../initializer/browser/initializer';
import { getBrowserId, getGuestId as getGuestIdFromCore, getSettings } from '@sitecore-cloudsdk/core';

/**
 * A function that returns the guest id.
 * @returns - A promise that resolves with the guest id
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export async function getGuestId(): Promise<string> {
  await awaitInit();

  const settings = getSettings();
  const id = getBrowserId();

  return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
