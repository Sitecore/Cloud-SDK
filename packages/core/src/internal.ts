// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export { getCookieValueFromMiddlewareRequest } from './lib/cookie/get-cookie-value-from-middleware-request';
export { getDefaultCookieAttributes } from './lib/cookie/get-default-cookie-attributes';

export { language, pageName } from './lib/infer/infer';
export { getCookieValueFromRequest } from './lib/cookie/get-cookie-value-from-request';
export { generateCorrelationId } from './lib/correlation-id/generate-correlation-id';
export { debug, processDebugResponse } from './lib/debug/debug';

export {
  API_VERSION,
  COOKIE_NAME_PREFIX,
  BROWSER_ID_COOKIE_NAME,
  DAILY_SECONDS,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
  SITECORE_EDGE_URL,
  CORRELATION_ID_HEADER
} from './lib/consts';

// Interfaces
export type { EPResponse, Infer, DebugResponse } from './lib/interfaces';
export type { Settings, BrowserSettings } from './lib/initializer/browser/interfaces';

// Browser
export { getCloudSDKSettings as getCloudSDKSettingsBrowser } from './lib/initializer/browser/initializer';
export { getEnabledPackage as getEnabledPackageBrowser } from './lib/initializer/browser/initializer';
export { enabledPackages as enabledPackagesBrowser } from './lib/initializer/browser/initializer';
export { builderInstance as builderInstanceBrowser } from './lib/initializer/browser/initializer';
export type { PackageContextDependency as PackageContextDependencyBrowser } from './lib/initializer/browser/interfaces';
export { fetchBrowserIdFromEdgeProxy } from './lib/browser-id/fetch-browser-id-from-edge-proxy';
export { PackageInitializer } from './lib/initializer/browser/package-initializer';
export { initCoreState } from './lib/initializer/browser/initializer';
export { getCookiesValuesFromEdge as getCookiesValuesFromEdgeBrowser } from './lib/initializer/browser/initializer';

// Server
export { getCloudSDKSettings as getCloudSDKSettingsServer } from './lib/initializer/server/initializer';
export { getEnabledPackage as getEnabledPackageServer } from './lib/initializer/server/initializer';
export { enabledPackages as enabledPackagesServer } from './lib/initializer/server/initializer';
export { builderInstance as builderInstanceServer } from './lib/initializer/server/initializer';
export { PackageInitializerServer } from './lib/initializer/server/package-initializer';
export { getCloudSDKRequest, getCloudSDKResponse } from './lib/initializer/server/initializer';
export { getCookiesValuesFromEdge as getCookiesValuesFromEdgeServer } from './lib/initializer/server/initializer';
export { getGuestIdServer } from './lib/guest-id/get-guest-id-server';
