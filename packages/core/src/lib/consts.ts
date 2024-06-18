// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable @typescript-eslint/naming-convention */
import packageJson from '../../package.json';

export const LIBRARY_VERSION = packageJson.version;

export const COOKIE_NAME_PREFIX = 'sc_';

export const DEFAULT_COOKIE_EXPIRY_DAYS = 730;

export const DAILY_SECONDS = 86400;

export const API_VERSION = 'v1.2';

export const SITECORE_EDGE_URL = 'https://edge-platform.sitecorecloud.io';

export const CORRELATION_ID_HEADER = 'x-sc-correlation-id';

/* eslint-disable max-len */
export enum ErrorMessages {
  IE_0003 = '[IE-0003] Unable to set the "sc_{SitecoreEdgeContextId}" cookie because the browser ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IE_0008 = '[IE-0008] You must first initialize the "core" package. Run the "init" function.',
  IE_0011 = '[IE-0011] Unable to set the "sc_{SitecoreEdgeContextId}_personalize" cookie because the guest ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IV_0001 = '[IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string.',
  MV_0001 = '[MV-0001] "sitecoreEdgeContextId" is required.',
  MV_0002 = '[MV-0002] "siteName" is required.'
}
/* eslint-enable max-len */
