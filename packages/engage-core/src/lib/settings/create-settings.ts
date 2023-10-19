// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { BID_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import { ISettings, ISettingsParams } from './interfaces';
import { validateSettings } from './validate-settings';

/**
 * Creates the global settings object, to be used by the library
 * @param settingsInput - Global settings added by the developer.
 * @returns an ISettings with the settings added by the developer
 */
export function createSettings(settingsInput: ISettingsParams): ISettings {
  validateSettings(settingsInput);

  const { siteId, contextId, clientKey, cookieDomain, cookiePath, cookieExpiryDays, pointOfSale } = settingsInput;

  return {
    clientKey,
    contextId,
    cookieSettings: {
      cookieDomain,
      cookieExpiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      cookieName: `${BID_PREFIX}${clientKey}`,
      cookiePath: cookiePath || '/',
    },
    pointOfSale: pointOfSale ?? undefined,
    siteId,
  };
}
