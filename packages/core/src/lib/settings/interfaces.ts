// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Extends the global settings object with additional properties
 */
export interface ISettings extends IBasicSettings {
  cookieSettings: ICookieSettings;
  sitecoreEdgeUrl: string;
}

export interface ISettingsParamsBrowser extends ISettingsParams {
  enableBrowserCookie?: boolean;
}

export interface ISettingsParamsServer extends ISettingsParams {
  enableServerCookie?: boolean;
}

export interface ISettingsParams extends IBasicSettings, ICookieSettingsInput {
  timeout?: number;
}

/**
 * Properties for the global settings object
 */
interface IBasicSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
  sitecoreEdgeUrl?: string;
}

interface ICookieSettingsInput {
  cookiePath?: string;
  cookieExpiryDays?: number;
  cookieDomain?: string;
}

/**
 * Properties for the cookie object
 */
export interface ICookieSettings {
  cookieName: string;
  cookieDomain?: string;
  cookieExpiryDays: number;
  cookiePath?: string;
}

/**
 * Properties for the cookie object
 */
export interface ICookieSettingsBrowser extends ICookieSettings {
  enableBrowserCookie: boolean;
}

/**
 * Properties for the Web Flow configuration
 */
export interface IWebPersonalizationConfig {
  asyncScriptLoading?: boolean;
  deferScriptLoading?: boolean;
  baseURLOverride?: string;
}

export interface IWebExperiencesSettings {
  /* eslint-disable @typescript-eslint/naming-convention */
  targetURL: string;
  pointOfSale: string;
  client_key: string;
  web_flow_config: {
    async: boolean;
    defer: boolean;
  };
  web_flow_target?: string;
  /* eslint-enable @typescript-eslint/naming-convention */
}
