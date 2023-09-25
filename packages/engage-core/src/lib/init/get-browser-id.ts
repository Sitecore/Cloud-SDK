// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCookieValueClientSide } from '@sitecore-cloudsdk/engage-utils';

/**
 * Get the browser ID from the cookie
 * @param cookieName - The cookie name from global settings
 * @returns The browser ID if the cookie exists
 */
export function getBrowserId(cookieName: string) {
  return getCookieValueClientSide(cookieName);
}
