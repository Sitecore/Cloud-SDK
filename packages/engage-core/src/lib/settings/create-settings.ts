// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { BID_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import { ISettings, ISettingsParamsBrowser, ISettingsParamsServer } from './interfaces';
import { validateSettings } from './validate-settings';

/**
 * Creates the global settings object, to be used by the library
 * @param settingsInput - Global settings added by the developer.
 * @returns an ISettings with the settings added by the developer
 */
export function createSettings(settingsInput: ISettingsParamsBrowser | ISettingsParamsServer): ISettings {
  validateSettings(settingsInput);
  const {
    clientKey,
    targetURL,
    cookieDomain,
    cookiePath,
    cookieExpiryDays,
    forceServerCookieMode,
    includeUTMParameters,
    pointOfSale,
  } = settingsInput;

  return {
    clientKey: clientKey,
    cookieSettings: {
      cookieDomain,
      cookieExpiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      cookieName: `${BID_PREFIX}${clientKey}`,
      cookiePath: cookiePath || '/',
      forceServerCookieMode: forceServerCookieMode ?? false,
    },
    includeUTMParameters: includeUTMParameters ?? true,
    pointOfSale: pointOfSale ?? undefined,
    targetURL: targetURL,
  };
}
