// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Extends the global settings object with additional properties
 */
export interface Settings extends BasicSettings {
  cookieSettings: CookieSettings;
  sitecoreEdgeUrl: string;
}

export interface BrowserSettings extends SettingsParams {
  enableBrowserCookie?: boolean;
}

export interface ServerSettings extends SettingsParams {
  enableServerCookie?: boolean;
}

export interface SettingsParams extends BasicSettings, CookieSettingsInput {
  timeout?: number;
}

/**
 * Properties for the global settings object
 */
export interface BasicSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
  sitecoreEdgeUrl?: string;
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
  cookieNames: {
    browserId: string;
    guestId: string;
  };
  cookieDomain?: string;
  cookieExpiryDays: number;
  cookiePath?: string;
}
