// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getBrowserId, getGuestId as getGuestIdFromCore } from '@sitecore-cloudsdk/core';
import { getDependencies } from '../initializer/browser/initializer';

/**
 * A function that returns the guest id.
 * @returns - A promise that resolves with the guest id
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export function getGuestId(): Promise<string> {
  const { settings } = getDependencies();
  const id = getBrowserId();
  
  return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
