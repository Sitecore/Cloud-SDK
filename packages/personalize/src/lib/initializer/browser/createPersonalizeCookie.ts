// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getGuestId, type Settings } from '@sitecore-cloudsdk/core/browser';
import {
  COOKIE_NAME_PREFIX,
  getCookiesValuesFromEdgeBrowser,
  getDefaultCookieAttributes
} from '@sitecore-cloudsdk/core/internal';
import { createCookieString, getCookie, getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import type { PersonalizeSettings } from './interfaces';

function getGuestIdCookieValue(personalizeSettings: PersonalizeSettings, cloudSDKSettings: Settings): string {
  const legacyCookie = getCookie(
    window.document.cookie,
    `${COOKIE_NAME_PREFIX}${cloudSDKSettings.sitecoreEdgeContextId}_personalize`
  );
  if (legacyCookie) {
    const attributes = getDefaultCookieAttributes(
      cloudSDKSettings.cookieSettings.expiryDays,
      cloudSDKSettings.cookieSettings.domain
    );
    document.cookie = createCookieString(
      personalizeSettings.cookieSettings.name.guestId,
      legacyCookie.value,
      attributes
    );
    // Remove legacy cookie
    document.cookie = createCookieString(
      `${COOKIE_NAME_PREFIX}${cloudSDKSettings.sitecoreEdgeContextId}_personalize`,
      '',
      {
        ...attributes,
        maxAge: 0
      }
    );
  }
  return getCookieValueClientSide(personalizeSettings.cookieSettings.name.guestId);
}

export async function createPersonalizeCookie(
  personalizeSettings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void | boolean> {
  const cookiesValuesFromEdgeBrowser = getCookiesValuesFromEdgeBrowser();

  const attributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  const guestIdCookieValue = getGuestIdCookieValue(personalizeSettings, cloudSDKSettings);
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
