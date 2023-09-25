// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { type TRequest, type IMiddlewareNextResponse, type IHttpResponse, isNextJsMiddlewareRequest, isNextJsMiddlewareResponse, isHttpRequest, isHttpResponse } from "@sitecore-cloudsdk/engage-utils";
import { ISettings } from "../settings/interfaces";
import { handleNextJsMiddlewareCookie } from "./handle-next-js-middleware-cookie";
import { handleHttpCookie } from "./handle-http-cookie";

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
  options: ISettings,
  timeout?: number
): Promise<void> {
  if (isNextJsMiddlewareRequest(request) && isNextJsMiddlewareResponse(response)) {
    await handleNextJsMiddlewareCookie(request, response, options, timeout);
  } else if (isHttpRequest(request) && isHttpResponse(response)) {
    await handleHttpCookie(request, response, options, timeout);
  }
}
