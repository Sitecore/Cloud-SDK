// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IMiddlewareRequest, TRequest } from "../interfaces";

/**
 * Checks if the given 'request' object is a valid Middleware Request
 * by verifying the presence of necessary properties.
 *
 * @param request - The request object to be validated.
 * @returns Returns true if 'request' is a valid Middleware Request, otherwise false.
 */
export function isNextJsMiddlewareRequest(request: TRequest): request is IMiddlewareRequest {
  return 'cookies' in request && 'get' in request.cookies && 'set' in request.cookies;
}
