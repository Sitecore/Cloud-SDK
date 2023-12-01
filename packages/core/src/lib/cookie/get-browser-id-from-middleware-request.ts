// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { Cookie, MiddlewareRequest } from '@sitecore-cloudsdk/utils';

/**
 * Retrieves the browser ID from the provided Middleware Request by extracting the cookie value
 * associated with the specified 'cookieName'. The function first checks for Next.js v12 cookie values,
 * and if not found, it checks for Next.js v13 cookie values.
 *
 * @param request - The Middleware Request object.
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The browser ID extracted from the cookie, or undefined if not found.
 */
export function getBrowserIdFromMiddlewareRequest(request: MiddlewareRequest, cookieName: string) {
  const cookieValueFromRequest: Cookie | string | undefined = request.cookies.get(cookieName);
  // It checks nextjs v12 cookie values
  if (typeof cookieValueFromRequest === 'string') return cookieValueFromRequest;
  // It checks nextjs v13 cookie values
  if (typeof cookieValueFromRequest === 'object') return cookieValueFromRequest.value;

  return undefined;
}
