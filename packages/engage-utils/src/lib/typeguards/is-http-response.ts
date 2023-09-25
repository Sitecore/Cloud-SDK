// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IHttpResponse, IMiddlewareNextResponse } from "../interfaces";

/**
 * Checks if the given 'response' object is a valid HTTP Response
 * by verifying the presence of necessary properties.
 *
 * @param response - IMiddlewareNextResponse | IHttpResponse - The response object to be validated.
 * @returns Returns true if 'response' is a valid HTTP Response, otherwise false.
 */
export function isHttpResponse(response: IMiddlewareNextResponse | IHttpResponse): response is IHttpResponse {
  return 'setHeader' in response;
}
