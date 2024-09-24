// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getBrowserId as getBrowserIdCore } from '@sitecore-cloudsdk/core/browser';

/**
 * Get the browser ID from the cookie
 * @returns The browser ID if the cookie exists
 * @deprecated Cloud SDK v0.4 introduces a new getBrowserId function. If you are upgrading from v0.3, we recommend that
 * you use the getBrowserId function that is exposed from \@sitecore-cloudsdk/core/browser. The v0.3 function will be
 * deprecated and removed in a future Cloud SDK release.
 */
export function getBrowserId() {
  return getBrowserIdCore();
}
