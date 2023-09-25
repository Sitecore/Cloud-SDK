// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { IHttpRequest, IHttpResponse } from '@sitecore-cloudsdk/engage-utils';
import { ISettings } from '../settings/interfaces';
import { BID_PREFIX } from '../consts';
import { getBrowserIdFromCdp } from '../init/get-browser-id-from-cdp';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { createCookieString, getCookieServerSide } from '@sitecore-cloudsdk/engage-utils';

/**
 * Handles HTTP Cookie operations for setting the browser ID cookie in the request and response.
 *
 * @param request - The HTTP Request object containing request headers and data.
 * @param options - The settings object containing configuration options.
 * @param response - The Middleware Next Response or HTTP Response object.
 * @returns A Promise that resolves once the browser ID cookie is handled.
 *
 * @throws [IE-0004] - This exception is thrown in the case getBrowserIdFromCdp wasn't able to retrieve a browser id.
 */
export async function handleHttpCookie(
  request: IHttpRequest,
  response: IHttpResponse,
  options: ISettings,
  timeout?: number
) {
  const cookieName = BID_PREFIX + options.clientKey;
  const cookieValueFromRequest = request.headers.cookie;

  let cookie;
  let cookieValue;

  if (cookieValueFromRequest) {
    cookie = getCookieServerSide(cookieValueFromRequest, cookieName);
    if (cookie) cookieValue = cookie.value;
  }

  if (!cookieValue) cookieValue = await getBrowserIdFromCdp(options.targetURL, options.clientKey, timeout);

  if (!cookieValue)
    throw new Error(
      '[IE-0004] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const cookieString = createCookieString(cookieName, cookieValue, defaultCookieAttributes);

  if (!cookie)
    request.headers.cookie = cookieValueFromRequest ? cookieValueFromRequest + '; ' + cookieString : cookieString;

  response.setHeader('Set-Cookie', cookieString);
}
