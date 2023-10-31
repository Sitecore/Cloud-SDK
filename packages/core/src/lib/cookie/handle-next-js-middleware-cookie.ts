// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IMiddlewareNextResponse, IMiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { ISettings } from '../settings/interfaces';
import { getBrowserIdFromMiddlewareRequest } from './get-browser-id-from-middleware-request';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

/**
 * Handles the Middleware Request and sets a cookie with the provided 'cookieName' and 'cookieValue'.
 * If 'cookieValue' is not present in the request, it fetches it using the 'getProxySettings' function
 * and stores it in the request's cookies with the specified 'defaultCookieAttributes'.
 *
 * @param request - The Middleware Request object.
 * @param cookieName - The name of the cookie to set.
 * @param options - The settings object containing configuration options.
 * @param defaultCookieAttributes - The default attributes for the cookie.
 *
 * @throws [IE-0003] - This exception is thrown in the case getProxySettings wasn't able to retrieve a browser id and client key.
 *
 */
export function handleNextJsMiddlewareCookie(
  request: IMiddlewareRequest,
  response: IMiddlewareNextResponse,
  options: ISettings,
  cookieTempValue: string
) {
  const { cookieName } = options.cookieSettings;

  const cookieValue = getBrowserIdFromMiddlewareRequest(request, cookieName) ?? cookieTempValue;

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );
  request.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
  response.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
}
