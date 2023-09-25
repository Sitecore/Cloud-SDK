// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { API_VERSION } from '../consts';

/**
 * Creates the URL for retrieving the browser ID from Sitecore CDP
 * @param targetURL - From global settings
 * @param clientKey - From global settings
 * @returns The URL string for retrieving the browser ID
 */
export function generateCreateBrowserIdUrl(targetURL: string, clientKey: string): string {
  // eslint-disable-next-line max-len
  return `${targetURL}/${API_VERSION}/browser/create.json?client_key=${clientKey}&message={}`;
}
