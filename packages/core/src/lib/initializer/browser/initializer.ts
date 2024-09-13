// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, Settings } from './interfaces';
import { COOKIE_NAME_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS, ErrorMessages, SITECORE_EDGE_URL } from '../../consts';
import { createCookieString, getCookie } from '@sitecore-cloudsdk/utils';
import { CORE_NAMESPACE } from '../../debug/namespaces';
import type { PackageInitializer } from './package-initializer';
import { debug } from '../../debug/debug';
import { fetchBrowserIdFromEdgeProxy } from '../../init/fetch-browser-id-from-edge-proxy';
import { getDefaultCookieAttributes } from '../../cookie/get-default-cookie-attributes';
import { getGuestId } from '../../init/get-guest-id';

export let cloudSDKSettings: Settings;
export const enabledPackages = new Map<string, PackageInitializer>();
export let initCoreState: Promise<void> | null = null;

export class CloudSDKBrowserInitializer {
  /**
   * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
   * @param settings - Common settings for the CloudSDK
   * @throws the following errors:
   * {@link ErrorMessages.MV_0001}
   * {@link ErrorMessages.MV_0002}
   * {@link ErrorMessages.IE_0001}
   * {@link ErrorMessages.IV_0001}
   */
  constructor(settings: BrowserSettings) {
    if (typeof window === 'undefined') throw new Error(ErrorMessages.IE_0001);

    this.validateSettings(settings);
    cloudSDKSettings = this.createSettings(settings);
  }

  /**
   * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
   */
  initialize() {
    if (!enabledPackages.size) debug(CORE_NAMESPACE)('CloudSDK was initialized with no packages');

    if (cloudSDKSettings.cookieSettings.enableBrowserCookie) initCoreState = this.createCookies();
    else initCoreState = Promise.resolve();

    enabledPackages.forEach((pkg) => {
      pkg.exec();
    });
  }

  /**
   * Validates the core settings to ensure they meet required criteria.
   *
   * This function validates the provided core settings object to ensure that essential properties
   * such as "sitecoreEdgeContextId" and "siteName" meet specific criteria and are not empty.
   *
   * @throws Error with specific error codes if any required property is missing or empty.
   */
  private validateSettings(settings: BrowserSettings) {
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

  private createSettings(settings: BrowserSettings): Settings {
    const {
      siteName,
      sitecoreEdgeContextId,
      cookieDomain,
      cookiePath,
      cookieExpiryDays,
      sitecoreEdgeUrl,
      enableBrowserCookie
    } = settings;

    return {
      cookieSettings: {
        domain: cookieDomain,
        enableBrowserCookie: enableBrowserCookie ?? false,
        expiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
        names: {
          browserId: `${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}`,
          guestId: `${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}_personalize`
        },
        path: cookiePath || '/'
      },
      siteName,
      sitecoreEdgeContextId,
      sitecoreEdgeUrl: sitecoreEdgeUrl ?? SITECORE_EDGE_URL
    };
  }

  private async createCookies(): Promise<void> {
    const attributes = getDefaultCookieAttributes(
      cloudSDKSettings.cookieSettings.expiryDays,
      cloudSDKSettings.cookieSettings.domain
    );

    const browserIdCookie = getCookie(window.document.cookie, cloudSDKSettings.cookieSettings.names.browserId);

    if (browserIdCookie) {
      const guestIdCookie = getCookie(window.document.cookie, cloudSDKSettings.cookieSettings.names.guestId);

      if (guestIdCookie) return;

      const guestId = await getGuestId(
        browserIdCookie.value,
        cloudSDKSettings.sitecoreEdgeContextId,
        cloudSDKSettings.sitecoreEdgeUrl
      );

      document.cookie = createCookieString(cloudSDKSettings.cookieSettings.names.guestId, guestId, attributes);

      return;
    }

    const { browserId, guestId } = await fetchBrowserIdFromEdgeProxy(
      cloudSDKSettings.sitecoreEdgeUrl,
      cloudSDKSettings.sitecoreEdgeContextId
    );

    document.cookie = createCookieString(cloudSDKSettings.cookieSettings.names.browserId, browserId, attributes);
    document.cookie = createCookieString(cloudSDKSettings.cookieSettings.names.guestId, guestId, attributes);
  }
}

export function getCloudSDKSettings() {
  if (!cloudSDKSettings) throw new Error(ErrorMessages.IE_0012);
  return cloudSDKSettings;
}

export function getEnabledPackage(packageName: string) {
  return enabledPackages.get(packageName);
}

export let builderInstance: null | CloudSDKBrowserInitializer = null;

/**
 * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
 * @param settings - Common settings for the CloudSDK
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 * @throws the following errors:
 * {@link ErrorMessages.MV_0001}
 * {@link ErrorMessages.MV_0002}
 * {@link ErrorMessages.IE_0001}
 * {@link ErrorMessages.IV_0001}
 */
export function CloudSDK(settings: BrowserSettings): CloudSDKBrowserInitializer {
  builderInstance = new CloudSDKBrowserInitializer(settings);
  return builderInstance;
}
