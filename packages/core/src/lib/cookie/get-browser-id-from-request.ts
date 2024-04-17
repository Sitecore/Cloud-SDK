// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { Request, getCookieServerSide, isHttpRequest, isNextJsMiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { getBrowserIdFromMiddlewareRequest } from './get-browser-id-from-middleware-request';

/**
 * Retrieves the browser ID from the provided request object ('T'), using the specified 'cookieName'.
 *
 * @param request - The request object, either a Middleware Request or an HTTP Request.
 * @param cookieName - The name of the cookie to retrieve the browser ID from.
 * @returns The browser ID extracted from the cookie or an empty string if not found.
 */
export function getBrowserIdFromRequest<T extends Request>(request: T, cookieName: string) {
  let browserId: string | undefined = undefined;
  if (isNextJsMiddlewareRequest(request)) browserId = getBrowserIdFromMiddlewareRequest(request, cookieName);
  else if (isHttpRequest(request)) {
    const cookieHeader = request.headers.cookie;
    browserId = getCookieServerSide(cookieHeader, cookieName)?.value;
  }

  return browserId ?? '';
}
