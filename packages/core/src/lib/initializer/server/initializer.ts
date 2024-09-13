// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { COOKIE_NAME_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS, ErrorMessages, SITECORE_EDGE_URL } from '../../consts';
import type {
  HttpRequest,
  HttpResponse,
  MiddlewareNextResponse,
  MiddlewareRequest,
  Request,
  Response
} from '@sitecore-cloudsdk/utils';
import type { ServerSettings, Settings } from './interfaces';
import {
  createCookieString,
  getCookieServerSide,
  isHttpRequest,
  isHttpResponse,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse
} from '@sitecore-cloudsdk/utils';
import { CORE_NAMESPACE } from '../../debug/namespaces';
import type { PackageInitializerServer } from './package-initializer';
import { debug } from '../../debug/debug';
import { fetchBrowserIdFromEdgeProxy } from '../../init/fetch-browser-id-from-edge-proxy';
import { getCookieValueFromMiddlewareRequest } from '../../cookie/get-cookie-value-from-middleware-request';
import { getDefaultCookieAttributes } from '../../cookie/get-default-cookie-attributes';
import { getGuestId } from '../../init/get-guest-id';

export let cloudSDKSettings: Settings;
export const enabledPackages = new Map<string, PackageInitializerServer>();

export class CloudSDKServerInitializer {
  private request: Request;
  private response: Response;

  /**
   * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
   * @param request - The request object, either a Middleware Request or an HTTP Request
   * @param response - The response object, either a Middleware Next Response or an HTTP Response
   * @param settings - Common settings for the CloudSDK
   * @throws the following errors:
   * {@link ErrorMessages.MV_0001}
   * {@link ErrorMessages.MV_0002}
   * {@link ErrorMessages.IV_0001}
   */
  constructor(request: Request, response: Response, settings: ServerSettings) {
    this.validateSettings(settings);
    cloudSDKSettings = this.createSettings(settings);

    this.request = request;
    this.response = response;
  }

  /**
   * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
   */
  async initialize() {
    if (!enabledPackages.size) debug(CORE_NAMESPACE)('CloudSDK was initialized with no packages');

    if (cloudSDKSettings.cookieSettings.enableServerCookie) await this.createCookies();

    const execs = Array.from(enabledPackages).map(([, value]) => value.exec());

    await Promise.all(execs);
  }

  /**
   * Validates the core settings to ensure they meet required criteria.
   *
   * This function validates the provided core settings object to ensure that essential properties
   * such as "sitecoreEdgeContextId" and "siteName" meet specific criteria and are not empty.
   *
   * @throws Error with specific error codes if any required property is missing or empty.
   */
  private validateSettings(settings: ServerSettings) {
    const { sitecoreEdgeContextId, siteName, sitecoreEdgeUrl } = settings;
    if (!sitecoreEdgeContextId || sitecoreEdgeContextId.trim().length === 0) throw new Error(ErrorMessages.MV_0001);

    if (!siteName || siteName.trim().length === 0) throw new Error(ErrorMessages.MV_0002);

    if (sitecoreEdgeUrl !== undefined)
      try {
        new URL(sitecoreEdgeUrl);
      } catch (e) {
        throw new Error(ErrorMessages.IV_0001);
      }
  }

  private createSettings(settings: ServerSettings): Settings {
    const {
      siteName,
      sitecoreEdgeContextId,
      cookieDomain,
      cookiePath,
      cookieExpiryDays,
      sitecoreEdgeUrl,
      enableServerCookie,
      timeout
    } = settings;

    return {
      cookieSettings: {
        domain: cookieDomain,
        enableServerCookie: enableServerCookie ?? false,
        expiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
        names: {
          browserId: `${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}`,
          guestId: `${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}_personalize`
        },
        path: cookiePath || '/'
      },
      siteName,
      sitecoreEdgeContextId,
      sitecoreEdgeUrl: sitecoreEdgeUrl ?? SITECORE_EDGE_URL,
      timeout
    };
  }

  private async createCookies() {
    if (isNextJsMiddlewareRequest(this.request) && isNextJsMiddlewareResponse(this.response))
      await this.handleNextJsMiddlewareCookie();
    else if (isHttpRequest(this.request) && isHttpResponse(this.response)) await this.handleHttpCookie();
  }

  private async handleNextJsMiddlewareCookie() {
    const request = this.request as MiddlewareRequest;
    const response = this.response as MiddlewareNextResponse;

    const { browserId, guestId } = cloudSDKSettings.cookieSettings.names;

    let browserIdCookieValue = getCookieValueFromMiddlewareRequest(request, browserId);
    let guestIdCookieValue = getCookieValueFromMiddlewareRequest(request, guestId);

    if (!browserIdCookieValue) {
      const cookieValues = await fetchBrowserIdFromEdgeProxy(
        cloudSDKSettings.sitecoreEdgeUrl,
        cloudSDKSettings.sitecoreEdgeContextId,
        cloudSDKSettings.timeout
      );

      browserIdCookieValue = cookieValues.browserId;
      guestIdCookieValue = cookieValues.guestId;
    } else if (!guestIdCookieValue)
      guestIdCookieValue = await getGuestId(
        browserIdCookieValue,
        cloudSDKSettings.sitecoreEdgeContextId,
        cloudSDKSettings.sitecoreEdgeUrl
      );

    const defaultCookieAttributes = getDefaultCookieAttributes(
      cloudSDKSettings.cookieSettings.expiryDays,
      cloudSDKSettings.cookieSettings.domain
    );

    request.cookies.set(browserId, browserIdCookieValue, defaultCookieAttributes);
    request.cookies.set(guestId, guestIdCookieValue, defaultCookieAttributes);

    response.cookies.set(browserId, browserIdCookieValue, defaultCookieAttributes);
    response.cookies.set(guestId, guestIdCookieValue, defaultCookieAttributes);
  }

  private async handleHttpCookie() {
    const request = this.request as HttpRequest;
    const response = this.response as HttpResponse;

    const { browserId, guestId } = cloudSDKSettings.cookieSettings.names;

    const browserIdCookie = getCookieServerSide(request.headers.cookie, browserId);
    let browserIdCookieValue;
    const guestIdCookie = getCookieServerSide(request.headers.cookie, guestId);
    let guestIdCookieValue;

    const defaultCookieAttributes = getDefaultCookieAttributes(
      cloudSDKSettings.cookieSettings.expiryDays,
      cloudSDKSettings.cookieSettings.domain
    );

    if (!browserIdCookie) {
      const cookieValues = await fetchBrowserIdFromEdgeProxy(
        cloudSDKSettings.sitecoreEdgeUrl,
        cloudSDKSettings.sitecoreEdgeContextId,
        cloudSDKSettings.timeout
      );

      browserIdCookieValue = cookieValues.browserId;
      guestIdCookieValue = cookieValues.guestId;
    } else {
      browserIdCookieValue = browserIdCookie.value;
      if (!guestIdCookie)
        guestIdCookieValue = await getGuestId(
          browserIdCookie.value,
          cloudSDKSettings.sitecoreEdgeContextId,
          cloudSDKSettings.sitecoreEdgeUrl
        );
      else guestIdCookieValue = guestIdCookie.value;
    }

    const browserIdCookieString = createCookieString(browserId, browserIdCookieValue, defaultCookieAttributes);
    const guestIdCookieString = createCookieString(guestId, guestIdCookieValue, defaultCookieAttributes);

    if (!browserIdCookie)
      request.headers.cookie = request.headers.cookie
        ? request.headers.cookie + '; ' + browserIdCookieString
        : browserIdCookieString;

    if (!guestIdCookie)
      request.headers.cookie = request.headers.cookie
        ? request.headers.cookie + '; ' + guestIdCookieString
        : guestIdCookieString;

    response.setHeader('Set-Cookie', [browserIdCookieString, guestIdCookieString]);
  }
}

export function getCloudSDKSettings() {
  if (!cloudSDKSettings) throw new Error(ErrorMessages.IE_0013);

  return cloudSDKSettings;
}

export function getEnabledPackage(packageName: string) {
  return enabledPackages.get(packageName);
}

export let builderInstance: null | CloudSDKServerInitializer = null;

/**
 * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
 * @param request - The request object, either a Middleware Request or an HTTP Request
 * @param response - The response object, either a Middleware Next Response or an HTTP Response
 * @param settings - Common settings for the CloudSDK
 * @returns An instance of {@link CloudSDKServerInitializer}
 * @throws the following errors:
 * {@link ErrorMessages.MV_0001}
 * {@link ErrorMessages.MV_0002}
 * {@link ErrorMessages.IV_0001}
 */
export function CloudSDK(request: Request, response: Response, settings: ServerSettings): CloudSDKServerInitializer {
  builderInstance = new CloudSDKServerInitializer(request, response, settings);
  return builderInstance;
}
