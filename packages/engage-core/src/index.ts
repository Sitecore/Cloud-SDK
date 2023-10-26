// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export { createCookie } from './lib/cookie/create-cookie';
export { getBrowserIdFromMiddlewareRequest } from './lib/cookie/get-browser-id-from-middleware-request';
export { getDefaultCookieAttributes } from './lib/cookie/get-default-cookie-attributes';
export { handleHttpCookie } from './lib/cookie/handle-http-cookie';
export { handleNextJsMiddlewareCookie } from './lib/cookie/handle-next-js-middleware-cookie';
export { handleServerCookie } from './lib/cookie/handle-server-cookie';
export { getBrowserId } from './lib/init/get-browser-id';
export { getProxySettings } from './lib/init/get-proxy-settings';
export { getGuestId } from './lib/init/get-guest-id';
export { createSettings } from './lib/settings/create-settings';
export { validateSettings } from './lib/settings/validate-settings';
export { Infer } from './lib/infer/infer';
export { getBrowserIdFromRequest } from './lib/cookie/get-browser-id-from-request';
export {
  API_VERSION,
  BID_PREFIX,
  DAILY_SECONDS,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
  TARGET_URL,
} from './lib/consts';

export type { ICdpResponse, IInfer } from './lib/interfaces';
export type {
  ICookieSettings,
  ISettings,
  ISettingsParamsBrowser,
  ISettingsParamsServer,
  IWebExperiencesSettings,
  IWebPersonalizationConfig,
} from './lib/settings/interfaces';
