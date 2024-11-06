// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCookiesValuesFromEdgeServer,
  getCookieValueFromMiddlewareRequest,
  getDefaultCookieAttributes,
  getGuestId
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

  const cookiesValuesFromEdgeServer = getCookiesValuesFromEdgeServer();

  const guestIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    settings.cookieSettings.name.guestId
  );
  const browserIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    cloudSDKSettings.cookieSettings.name.browserId
  );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  let guestIdValue;

  if (guestIdCookieValue) guestIdValue = guestIdCookieValue;
  else if (cookiesValuesFromEdgeServer?.guestId) guestIdValue = cookiesValuesFromEdgeServer.guestId;
  else if (browserIdCookieValue) {
    const guestIdCookieValueFromEdgeProxy = await getGuestId(
      browserIdCookieValue,
      cloudSDKSettings.sitecoreEdgeContextId,
      cloudSDKSettings.sitecoreEdgeUrl
    );
    guestIdValue = guestIdCookieValueFromEdgeProxy;
  } else return;

  middlewareRequest.cookies.set(settings.cookieSettings.name.guestId, guestIdValue, defaultCookieAttributes);
  middlewareResponse.cookies.set(settings.cookieSettings.name.guestId, guestIdValue, defaultCookieAttributes);
}
