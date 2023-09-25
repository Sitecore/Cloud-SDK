// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { createCookieString } from './lib/cookies/create-cookie-string';
import { SameSiteProperties, ICookieProperties } from './lib/cookies/interfaces';
import { fetchWithTimeout } from './lib/fetch-with-timeout';
import { getCookieValueClientSide } from './lib/cookies/get-cookie-value-client-side';
import { isNextJsMiddlewareRequest } from './lib/typeguards/is-next-js-middleware-request';
import { isNextJsMiddlewareResponse } from './lib/typeguards/is-next-js-middleware-response';
import { isHttpRequest } from './lib/typeguards/is-http-request';
import { isHttpResponse } from './lib/typeguards/is-http-response';
import { getCookie } from './lib/cookies/get-cookie';
import { getCookieServerSide } from './lib/cookies/get-cookie-server-side';

// Types
import type {
  TRequest,
  IMiddlewareNextResponse,
  IHttpResponse,
  IMiddlewareRequest,
  IHttpRequest,
} from './lib/interfaces';
import type { ICookie } from './lib/cookies/interfaces';

// Exports
export {
  createCookieString,
  fetchWithTimeout,
  getCookieValueClientSide,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse,
  isHttpRequest,
  isHttpResponse,
  getCookie,
  SameSiteProperties,
  getCookieServerSide,
};
export type { TRequest, IMiddlewareNextResponse, IHttpResponse, IHttpRequest, IMiddlewareRequest };
export type { ICookie, ICookieProperties };
