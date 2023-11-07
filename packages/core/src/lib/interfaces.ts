// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * The response object that Sitecore CDP returns
 */
export interface ICdpResponse {
  ref: string;
  status: string;
  version: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_key: string;
}

export interface IProxySettings {
  browserId: string;
}

/**
 * Interface for supporting response IncomingMessage http node type
 */
export interface IInfer {
  language: () => string | undefined;
  pageName: () => string;
}
