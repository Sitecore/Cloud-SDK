// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCookiesValuesFromEdgeServer,
  getDefaultCookieAttributes,
  getGuestIdServer
} from '@sitecore-cloudsdk/core/internal';
import type { Settings } from '@sitecore-cloudsdk/core/server';
import {
  createCookieString,
  getCookieServerSide,
  type HttpRequest,
  type HttpResponse,
  type Request,
  type Response
} from '@sitecore-cloudsdk/utils';
import type { PersonalizeSettings } from './interfaces';

export async function handleHttpCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
) {
  const httpRequest = request as HttpRequest;
  const httpResponse = response as HttpResponse;

  const cookiesValuesFromEdgeServer = getCookiesValuesFromEdgeServer();

  const guestIdCookie = getCookieServerSide(httpRequest.headers.cookie, settings.cookieSettings.name.guestId);
  const browserIdCookie = getCookieServerSide(
    httpRequest.headers.cookie,
    cloudSDKSettings.cookieSettings.name.browserId
  );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  let guestIdCookieString;

  if (guestIdCookie)
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      guestIdCookie.value,
      defaultCookieAttributes
    );
  else if (cookiesValuesFromEdgeServer?.guestId)
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      cookiesValuesFromEdgeServer.guestId,
      defaultCookieAttributes
    );
  else if (browserIdCookie) {
    const guestIdCookieValueFromEdgeProxy = await getGuestIdServer(browserIdCookie.value);
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      guestIdCookieValueFromEdgeProxy,
      defaultCookieAttributes
    );
  } else return;

  if (!guestIdCookie)
    httpRequest.headers.cookie = httpRequest.headers.cookie
      ? httpRequest.headers.cookie + '; ' + guestIdCookieString
      : guestIdCookieString;

  httpResponse.setHeader('Set-Cookie', guestIdCookieString);
}
