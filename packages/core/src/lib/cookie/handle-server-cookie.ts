// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  type TRequest,
  type IMiddlewareNextResponse,
  type IHttpResponse,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse,
  isHttpRequest,
  isHttpResponse,
} from '@sitecore-cloudsdk/utils';
import { getSettingsServer } from '../init/init-core-server';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';
import { handleHttpCookie } from './handle-http-cookie';
import { getProxySettings } from '../init/get-proxy-settings';
import { BID_PREFIX } from '../consts';

/**
 * Handles server-side cookie operations based on the provided 'request' and 'response' objects.
 *
 * @param request - The request object, either a Middleware Request or an HTTP Request.
 * @param response - The response object, either a Middleware Next Response or an HTTP Response.
 * @param options - The settings object containing configuration options.
 * @returns A Promise that resolves once the cookie handling is complete.
 */
export async function handleServerCookie<T extends TRequest, X extends IMiddlewareNextResponse | IHttpResponse>(
  request: T,
  response: X,
  timeout?: number
): Promise<void> {
  const settings = getSettingsServer();

  const { browserId, clientKey } = await getProxySettings(settings.sitecoreEdgeContextId, timeout);

  if (!clientKey) return;

  settings.cookieSettings.cookieName = `${BID_PREFIX}${clientKey}`;

  if (isNextJsMiddlewareRequest(request) && isNextJsMiddlewareResponse(response)) {
    handleNextJsMiddlewareCookie(request, response, settings, browserId);
  } else if (isHttpRequest(request) && isHttpResponse(response)) {
    handleHttpCookie(request, response, settings, browserId);
  }
}
