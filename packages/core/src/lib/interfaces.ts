// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * The response object that Sitecore EP returns
 */
export interface EPResponse {
  ref: string;
  status: string;
  version: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_key: string;
}

export interface ProxySettings {
  browserId: string;
}

/**
 * Interface for supporting response IncomingMessage http node type
 */
export interface Infer {
  language: () => string | undefined;
  pageName: () => string;
}

/**
 * Interface for supporting debug object
 */
export interface DebugResponse {
  headers?: {
    [key: string]: string | string[] | [string, string][] | Record<string, string> | Headers;
  };
  redirected?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
  body?: unknown;
}
