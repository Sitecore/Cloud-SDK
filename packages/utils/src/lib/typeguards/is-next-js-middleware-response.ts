// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { HttpResponse, MiddlewareNextResponse } from '../interfaces';

/**
 * Checks if the given 'response' object is a valid MiddlewareNextResponse Response
 * by verifying the presence of necessary properties.
 *
 * @param response - MiddlewareNextResponse | HttpResponse - The response object to be validated.
 * @returns Returns true if 'response' is a valid MiddlewareNextResponse Response, otherwise false.
 */
export function isNextJsMiddlewareResponse(
  response: MiddlewareNextResponse | HttpResponse
): response is MiddlewareNextResponse {
  return 'cookies' in response && 'set' in response.cookies;
}
