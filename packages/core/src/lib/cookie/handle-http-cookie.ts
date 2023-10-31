// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { IHttpRequest, IHttpResponse } from '@sitecore-cloudsdk/utils';
import { ISettings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { createCookieString, getCookieServerSide } from '@sitecore-cloudsdk/utils';

/**
 * Handles HTTP Cookie operations for setting the browser ID cookie in the request and response.
 *
 * @param request - The HTTP Request object containing request headers and data.
 * @param options - The settings object containing configuration options.
 * @param response - The Middleware Next Response or HTTP Response object.
 * @returns A Promise that resolves once the browser ID cookie is handled.
 *
 * @throws [IE-0003] - This exception is thrown in the case getBrowserIdFromCdp wasn't able to retrieve a browser id.
 */
export function handleHttpCookie(
  request: IHttpRequest,
  response: IHttpResponse,
  options: ISettings,
  cookieTempValue: string
) {
  const { cookieName } = options.cookieSettings;

  const cookieValueFromRequest = request.headers.cookie;

  let cookie;
  let cookieValue;

  if (cookieValueFromRequest) {
    cookie = getCookieServerSide(cookieValueFromRequest, cookieName);
    if (cookie) cookieValue = cookie.value;
  }

  if (!cookieValue) cookieValue = cookieTempValue;

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const cookieString = createCookieString(cookieName, cookieValue, defaultCookieAttributes);

  if (!cookie)
    request.headers.cookie = cookieValueFromRequest ? cookieValueFromRequest + '; ' + cookieString : cookieString;

  response.setHeader('Set-Cookie', cookieString);
}
