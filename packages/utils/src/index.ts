// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { createCookieString } from './lib/cookies/create-cookie-string';
import { CookieProperties } from './lib/cookies/interfaces';
import { fetchWithTimeout } from './lib/fetch-with-timeout';
import { getCookieValueClientSide } from './lib/cookies/get-cookie-value-client-side';
import { isNextJsMiddlewareRequest } from './lib/typeguards/is-next-js-middleware-request';
import { isNextJsMiddlewareResponse } from './lib/typeguards/is-next-js-middleware-response';
import { isHttpRequest } from './lib/typeguards/is-http-request';
import { isHttpResponse } from './lib/typeguards/is-http-response';
import { getCookie } from './lib/cookies/get-cookie';
import { getCookieServerSide } from './lib/cookies/get-cookie-server-side';
import { cookieExists } from './lib/cookies/cookie-exists';
import { flattenObject, NestedObject, FlattenedObject } from './lib/converters/flatten-object';
import { isShortISODateString } from './lib/validators/is-short-iso-date-string';
import { isValidEmail } from './lib/validators/is-valid-email';

// Types
import type {
  Request,
  MiddlewareNextResponse,
  HttpResponse,
  MiddlewareRequest,
  HttpRequest,
  BasicTypes,
} from './lib/interfaces';
import type { Cookie } from './lib/cookies/interfaces';

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
  getCookieServerSide,
  cookieExists,
  flattenObject,
  isShortISODateString,
  isValidEmail,
};
export type {
  NestedObject,
  Request,
  MiddlewareNextResponse,
  BasicTypes,
  HttpResponse,
  HttpRequest,
  MiddlewareRequest,
  FlattenedObject,
};
export type { Cookie, CookieProperties };
