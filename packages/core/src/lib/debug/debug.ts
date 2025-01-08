// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import debug from 'debug';
import { normalizeHeaders } from '@sitecore-cloudsdk/utils';
import type { DebugResponse } from '../interfaces';

if (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.DEBUG_MULTILINE === 'true' &&
  debug.formatters &&
  debug.formatters.o &&
  debug.formatters.O
)
  debug.formatters.o = debug.formatters.O;

export { debug };

/**
 * Extracts debug information from an HTTP response if debugging is enabled.
 * @param response - The HTTP response object from fetch.
 * @returns An object containing selected response details for debugging purposes.
 */
export function processDebugResponse(namespace: string, response: Response): object {
  let debugResponse: DebugResponse = {};

  if (debug.enabled(namespace))
    debugResponse = {
      headers: normalizeHeaders(response.headers),
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      url: response.url
    };

  return debugResponse;
}
