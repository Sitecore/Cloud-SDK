// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
/**
 * Gets the default Cookie Attributes
 * @param  maxAge - Set the cookie "Max-Age" attribute in days.
 * @returns the default configuration settings for the cookie string
 */

import { ICookieProperties } from '@sitecore-cloudsdk/utils';
import { DAILY_SECONDS, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';

// eslint-disable-next-line max-len
export function getDefaultCookieAttributes(
  maxAge: number = DEFAULT_COOKIE_EXPIRY_DAYS,
  cookieDomain?: string
): ICookieProperties {
  return {
    domain: cookieDomain,
    maxAge: maxAge * DAILY_SECONDS,
    path: '/',
    sameSite: 'None',
    secure: true,
  };
}
