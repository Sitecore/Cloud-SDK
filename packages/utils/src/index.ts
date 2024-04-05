// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export { createCookieString } from './lib/cookies/create-cookie-string';
export { fetchWithTimeout } from './lib/fetch-with-timeout';
export { getCookieValueClientSide } from './lib/cookies/get-cookie-value-client-side';
export { isNextJsMiddlewareRequest } from './lib/typeguards/is-next-js-middleware-request';
export { isNextJsMiddlewareResponse } from './lib/typeguards/is-next-js-middleware-response';
export { isHttpRequest } from './lib/typeguards/is-http-request';
export { isHttpResponse } from './lib/typeguards/is-http-response';
export { getCookie } from './lib/cookies/get-cookie';
export { getCookieServerSide } from './lib/cookies/get-cookie-server-side';
export { cookieExists } from './lib/cookies/cookie-exists';
export { flattenObject } from './lib/converters/flatten-object';
export { isShortISODateString } from './lib/validators/is-short-iso-date-string';
export { isValidEmail } from './lib/validators/is-valid-email';
export { omit } from './lib/objects/omit';
export { generateV4UUID } from './lib/generators/generate-v4-uuid';
export * from './lib/console/colors';

export { ErrorMessages } from './lib/consts';

export type {
  Request,
  MiddlewareNextResponse,
  HttpResponse,
  MiddlewareRequest,
  HttpRequest,
  BasicTypes,
} from './lib/interfaces';

export type { Cookie, CookieProperties } from './lib/cookies/interfaces';
export type { NestedObject, FlattenedObject } from './lib/converters/flatten-object';
