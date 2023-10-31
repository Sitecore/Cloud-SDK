// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IHttpRequest, TRequest } from '../interfaces';

/**
 * Checks if the given 'request' object is a valid HTTP Request
 * by verifying the presence of necessary properties.
 *
 * @param request - The request object to be validated.
 * @returns Returns true if 'request' is a valid HTTP Request, otherwise false.
 */

export function isHttpRequest(request: TRequest): request is IHttpRequest {
  return 'headers' in request;
}
