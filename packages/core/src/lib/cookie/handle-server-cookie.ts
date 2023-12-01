// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  type Request,
  type MiddlewareNextResponse,
  type HttpResponse,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse,
  isHttpRequest,
  isHttpResponse,
} from '@sitecore-cloudsdk/utils';
import { getSettingsServer } from '../init/init-core-server';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';
import { handleHttpCookie } from './handle-http-cookie';

/**
 * Handles server-side cookie operations based on the provided 'request' and 'response' objects.
 *
 * @param request - The request object, either a Middleware Request or an HTTP Request.
 * @param response - The response object, either a Middleware Next Response or an HTTP Response.
 * @param timeout - The timeout for the call to proxy to get browserId.
 * @returns A Promise that resolves once the cookie handling is complete.
 */
export async function handleServerCookie<T extends Request, X extends MiddlewareNextResponse | HttpResponse>(
  request: T,
  response: X,
  timeout?: number
): Promise<void> {
  const settings = getSettingsServer();
  if (isNextJsMiddlewareRequest(request) && isNextJsMiddlewareResponse(response)) {
    await handleNextJsMiddlewareCookie(request, response, settings, timeout);
  } else if (isHttpRequest(request) && isHttpResponse(response)) {
    await handleHttpCookie(request, response, settings, timeout);
  }
}
