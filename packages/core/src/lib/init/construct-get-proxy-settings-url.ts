// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { API_VERSION, TARGET_URL } from '../consts';
/**
 * Constructs the URL for retrieving the proxy settings from EDGE events proxy
 * @param contextId - From global settings
 * @returns The URL string for retrieving the browser ID and ClientKey
 */

export function constructGetProxySettingsUrl(contextId: string): string {
  return `${TARGET_URL}/events/${API_VERSION}/browser/create.json?sitecoreContextId=${contextId}&client_key=`;
}
