// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  COOKIE_NAME_PREFIX,
  getCookiesValuesFromEdgeServer,
  getCookieValueFromMiddlewareRequest,
  getDefaultCookieAttributes,
  getGuestIdServer
} from '@sitecore-cloudsdk/core/internal';
import type { Settings } from '@sitecore-cloudsdk/core/server';
import type { MiddlewareNextResponse, MiddlewareRequest, Request, Response } from '@sitecore-cloudsdk/utils';
import type { PersonalizeSettings } from './interfaces';

export async function handleNextJsMiddlewareCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
) {
  const middlewareRequest = request as MiddlewareRequest;
  const middlewareResponse = response as MiddlewareNextResponse;
  const defaultCookieAttributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );
  const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${cloudSDKSettings.sitecoreEdgeContextId}_personalize`;
  const legacyGuestIdCookie = getCookieValueFromMiddlewareRequest(middlewareRequest, legacyGuestIdCookieName);
  if (legacyGuestIdCookie) {
    middlewareRequest.cookies.set(settings.cookieSettings.name.guestId, legacyGuestIdCookie, defaultCookieAttributes);
    middlewareResponse.cookies.set(settings.cookieSettings.name.guestId, legacyGuestIdCookie, defaultCookieAttributes);
    // Remove legacy cookie by setting maxAge to 0
    middlewareRequest.cookies.set(legacyGuestIdCookieName, '', { ...defaultCookieAttributes, maxAge: 0 });
    middlewareResponse.cookies.set(legacyGuestIdCookieName, '', { ...defaultCookieAttributes, maxAge: 0 });
    return;
  }
  const cookiesValuesFromEdgeServer = getCookiesValuesFromEdgeServer();

  const guestIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    settings.cookieSettings.name.guestId
  );
  const browserIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    cloudSDKSettings.cookieSettings.name.browserId
  );

  let guestIdValue;

  if (guestIdCookieValue) guestIdValue = guestIdCookieValue;
  else if (cookiesValuesFromEdgeServer?.guestId) guestIdValue = cookiesValuesFromEdgeServer.guestId;
  else if (browserIdCookieValue) {
    const guestIdCookieValueFromEdgeProxy = await getGuestIdServer(browserIdCookieValue);
    guestIdValue = guestIdCookieValueFromEdgeProxy;
  } else return;

  middlewareRequest.cookies.set(settings.cookieSettings.name.guestId, guestIdValue, defaultCookieAttributes);
  middlewareResponse.cookies.set(settings.cookieSettings.name.guestId, guestIdValue, defaultCookieAttributes);
}
