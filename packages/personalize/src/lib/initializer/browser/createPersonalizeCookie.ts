// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getGuestId, type Settings } from '@sitecore-cloudsdk/core/browser';
import { getCookiesValuesFromEdgeBrowser, getDefaultCookieAttributes } from '@sitecore-cloudsdk/core/internal';
import { createCookieString, getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import type { PersonalizeSettings } from './interfaces';

export async function createPersonalizeCookie(
  personalizeSettings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void | boolean> {
  const cookiesValuesFromEdgeBrowser = getCookiesValuesFromEdgeBrowser();

  const attributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  const guestIdCookieValue = getCookieValueClientSide(personalizeSettings.cookieSettings.name.guestId);
  const browserIdCookieValue = getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);

  if (guestIdCookieValue) return;
  else if (cookiesValuesFromEdgeBrowser?.guestId)
    document.cookie = createCookieString(
      personalizeSettings.cookieSettings.name.guestId,
      cookiesValuesFromEdgeBrowser.guestId,
      attributes
    );
  else if (browserIdCookieValue) {
    const guestIdCookieValue = await getGuestId();

    document.cookie = createCookieString(
      personalizeSettings.cookieSettings.name.guestId,
      guestIdCookieValue,
      attributes
    );
  }
}
