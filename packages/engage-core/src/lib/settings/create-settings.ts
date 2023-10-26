// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { BID_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import { getProxySettings } from '../init/get-proxy-settings';
import { ISettings, ISettingsParams } from './interfaces';
import { validateSettings } from './validate-settings';

/**
 * Creates the global settings object, to be used by the library
 * @param settingsInput - Global settings added by the developer.
 * @returns an ISettings with the settings added by the developer
 */
export async function createSettings(settingsInput: ISettingsParams): Promise<ISettings> {
  validateSettings(settingsInput);

  const { browserId, clientKey } = await getProxySettings(settingsInput.contextId);

  const { siteId, contextId, cookieDomain, cookiePath, cookieExpiryDays } = settingsInput;

  return {
    contextId,
    cookieSettings: {
      cookieDomain,
      cookieExpiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      cookieName: `${BID_PREFIX}${clientKey}`,
      cookiePath: cookiePath || '/',
      cookieTempValue: browserId
    },
    siteId,
  };
}
