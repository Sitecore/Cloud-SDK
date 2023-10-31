// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ICookie } from './cookies/interfaces';

/**
 * A reusable type that accepts only basic types and arrays of those
 */
export type BasicTypes =
  | string
  | boolean
  | number
  | undefined
  | Array<string | boolean | number | { [key: string]: BasicTypes } | Array<BasicTypes>>;

/**
 * Interface for supporting request IncomingMessage http node type
 */
export interface IHttpRequest {
  headers: {
    'cookie'?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'content-language'?: string;
    'referer'?: string;
  };
  url?: string;
}

/**
 * Interface for supporting response OutgoingMessage http node type
 */
export interface IHttpResponse {
  setHeader(name: string, value: number | string | ReadonlyArray<string>): void;
}

export type TRequest = IHttpRequest | IMiddlewareRequest;

/**
 * Interface for supporting request from Edge Next.js
 * includes types compatible with both NextJS versions 12 & 13
 */
export interface IMiddlewareRequest {
  cookies: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    set:
      | ((key: string, value: string, options: any) => any)
      | ((...args: [key: string, value: string] | [options: ICookie]) => any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    get: (key: string) => ICookie | string | undefined;
  };
  headers: {
    get: (name: string) => string | null;
  };
  url?: string;
}

/**
 * Interface for Edge Next.js Response
 * includes types compatible with both NextJS versions 12 & 13
 */
export interface IMiddlewareNextResponse {
  cookies: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    set:
      | ((key: string, value: unknown, options?: any) => any)
      | ((...args: [key: string, value: string] | [options: ICookie]) => any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}
