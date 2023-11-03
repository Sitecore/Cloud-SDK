// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { DEFAULT_COOKIE_EXPIRY_DAYS, SITECORE_EDGE_URL } from '../consts';
import { ISettings, ISettingsParams } from './interfaces';
import { validateSettings } from './validate-settings';
/**
 * Creates the global settings object, to be used by the library
 * @param settingsInput - Global settings added by the developer.
 * @returns an ISettings with the settings added by the developer
 */
export function createSettings(settingsInput: ISettingsParams): ISettings {
  validateSettings(settingsInput);
  const { siteName, sitecoreEdgeContextId, cookieDomain, cookiePath, cookieExpiryDays, sitecoreEdgeUrl } =
    settingsInput;
  return {
    cookieSettings: {
      cookieDomain,
      cookieExpiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      cookieName: '',
      cookiePath: cookiePath || '/',
    },
    siteName,
    sitecoreEdgeContextId,
    sitecoreEdgeUrl: sitecoreEdgeUrl ?? SITECORE_EDGE_URL,
  };
}
