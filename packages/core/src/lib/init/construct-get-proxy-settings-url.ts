// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { API_VERSION } from '../consts';
/**
 * Constructs the URL for retrieving the proxy settings from EDGE events proxy
 * @param sitecoreEdgeContextId - From global settings
 * @returns The URL string for retrieving the browser ID and ClientKey
 */

export function constructGetProxySettingsUrl(sitecoreEdgeContextId: string, sitecoreEdgeUrl: string): string {
  return `${sitecoreEdgeUrl}/events/${API_VERSION}/browser/create.json?sitecoreContextId=${sitecoreEdgeContextId}&client_key=`;
}
