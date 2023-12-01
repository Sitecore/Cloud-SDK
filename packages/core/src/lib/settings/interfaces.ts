// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Extends the global settings object with additional properties
 */
export interface Settings extends BasicSettings {
  cookieSettings: CookieSettings;
  sitecoreEdgeUrl: string;
}

export interface SettingsParamsBrowser extends SettingsParams {
  enableBrowserCookie?: boolean;
}

export interface SettingsParamsServer extends SettingsParams {
  enableServerCookie?: boolean;
}

export interface SettingsParams extends BasicSettings, CookieSettingsInput {
  timeout?: number;
  sitecoreEdgeUrl?: string;
}

/**
 * Properties for the global settings object
 */
interface BasicSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
}

interface CookieSettingsInput {
  cookiePath?: string;
  cookieExpiryDays?: number;
  cookieDomain?: string;
}

/**
 * Properties for the cookie object
 */
export interface CookieSettings {
  cookieName: string;
  cookieDomain?: string;
  cookieExpiryDays: number;
  cookiePath?: string;
}

/**
 * Properties for the cookie object
 */
export interface CookieSettingsBrowser extends CookieSettings {
  enableBrowserCookie: boolean;
}
