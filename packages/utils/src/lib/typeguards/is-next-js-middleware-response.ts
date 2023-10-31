// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IHttpResponse, IMiddlewareNextResponse } from '../interfaces';

/**
 * Checks if the given 'response' object is a valid IMiddlewareNextResponse Response
 * by verifying the presence of necessary properties.
 *
 * @param response - IMiddlewareNextResponse | IHttpResponse - The response object to be validated.
 * @returns Returns true if 'response' is a valid IMiddlewareNextResponse Response, otherwise false.
 */
export function isNextJsMiddlewareResponse(
  response: IMiddlewareNextResponse | IHttpResponse
): response is IMiddlewareNextResponse {
  return 'cookies' in response && 'set' in response.cookies;
}
