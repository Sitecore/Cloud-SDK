// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export interface BrowserSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
  enableBrowserCookie?: boolean;
  cookieDomain?: string;
  cookieExpiryDays?: number;
  cookiePath?: string;
  sitecoreEdgeUrl?: string;
}

export interface Settings {
  sitecoreEdgeContextId: string;
  siteName: string;
  sitecoreEdgeUrl: string;
  cookieSettings: {
    names: {
      browserId: string;
      guestId: string;
    };
    domain?: string;
    expiryDays: number;
    path?: string;
    enableBrowserCookie?: boolean;
  };
}

export interface PackageContextDependency {
  name: string;
  method: string;
}

export type SideEffectsFn = (settings?: unknown) => Promise<void>;

export interface PackageContext {
  sideEffects: SideEffectsFn;
  settings?: unknown;
  dependencies?: PackageContextDependency[];
}

export interface Core {
  getBrowserId: () => string;
  getGuestId: () => Promise<string>;
  settings: {
    sitecoreEdgeContextId: string;
    sitecoreEdgeUrl: string;
  };
  version: string;
}
