// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export { createCookies } from './lib/cookie/create-cookies';
export { getCookieValueFromMiddlewareRequest } from './lib/cookie/get-cookie-value-from-middleware-request';
export { getDefaultCookieAttributes } from './lib/cookie/get-default-cookie-attributes';
export { handleHttpCookie } from './lib/cookie/handle-http-cookie';
export { handleNextJsMiddlewareCookie } from './lib/cookie/handle-next-js-middleware-cookie';

export { getGuestId } from './lib/init/get-guest-id';
export { createSettings } from './lib/settings/create-settings';
export { getSettings, initCore } from './lib/init/init-core';

export { validateSettings } from './lib/settings/validate-settings';
export { language, pageName } from './lib/infer/infer';
export { getCookieValueFromRequest } from './lib/cookie/get-cookie-value-from-request';
export { handleGetSettingsError } from './lib/settings/handle-get-settings-error';
export { generateCorrelationId } from './lib/correlation-id/generate-correlation-id';
export { debug, processDebugResponse } from './lib/debug/debug';

export {
  API_VERSION,
  COOKIE_NAME_PREFIX,
  DAILY_SECONDS,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
  SITECORE_EDGE_URL,
  CORRELATION_ID_HEADER
} from './lib/consts';

// Interfaces
export type { EPResponse, Infer, DebugResponse } from './lib/interfaces';
export type { CookieSettings, Settings, BasicSettings } from './lib/settings/interfaces';

// Browser
export { getCloudSDKSettings as getCloudSDKSettingsBrowser } from './lib/initializer/browser/initializer';
export { getEnabledPackage as getEnabledPackageBrowser } from './lib/initializer/browser/initializer';
export { enabledPackages as enabledPackagesBrowser } from './lib/initializer/browser/initializer';
export { builderInstance as builderInstanceBrowser } from './lib/initializer/browser/initializer';
export type {
  PackageContextDependency as PackageContextDependencyBrowser,
  SideEffectsFn
} from './lib/initializer/browser/interfaces';
export { fetchBrowserIdFromEdgeProxy } from './lib/browser-id/fetch-browser-id-from-edge-proxy';
export { PackageInitializer } from './lib/initializer/browser/package-initializer';
export { initCoreState } from './lib/initializer/browser/initializer';
export type { BrowserSettings } from './lib/settings/interfaces';
export { getBrowserId } from './lib/browser-id/get-browser-id';

// Server
export { getCloudSDKSettings as getCloudSDKSettingsServer } from './lib/initializer/server/initializer';
export { getEnabledPackage as getEnabledPackageServer } from './lib/initializer/server/initializer';
export { enabledPackages as enabledPackagesServer } from './lib/initializer/server/initializer';
export { builderInstance as builderInstanceServer } from './lib/initializer/server/initializer';
export { PackageInitializerServer } from './lib/initializer/server/package-initializer';
export { getSettingsServer, initCoreServer } from './lib/init/init-core-server';
export { handleServerCookie } from './lib/cookie/handle-server-cookie';
export type { ServerSettings } from './lib/settings/interfaces';
