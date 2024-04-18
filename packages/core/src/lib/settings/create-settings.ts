// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { COOKIE_NAME_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS, SITECORE_EDGE_URL } from '../consts';
import type { Settings, SettingsParams } from './interfaces';
import { validateSettings } from './validate-settings';
/**
 * Creates the global settings object, to be used by the library
 * @param settingsInput - Global settings added by the developer.
 * @returns an Settings with the settings added by the developer
 */
export function createSettings(settingsInput: SettingsParams): Settings {
  validateSettings(settingsInput);
  const { siteName, sitecoreEdgeContextId, cookieDomain, cookiePath, cookieExpiryDays, sitecoreEdgeUrl } =
    settingsInput;
  return {
    cookieSettings: {
      cookieDomain,
      cookieExpiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      cookieName: `${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}`,
      cookiePath: cookiePath || '/'
    },
    siteName,
    sitecoreEdgeContextId,
    sitecoreEdgeUrl: sitecoreEdgeUrl ?? SITECORE_EDGE_URL
  };
}
