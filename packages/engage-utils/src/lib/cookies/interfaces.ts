// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Cookie properties
 */
export interface ICookieProperties {
  maxAge: number;
  sameSite: SameSiteProperties;
  secure: boolean;
  path?: string;
  httpOnly?: boolean;
  expires?: Date;
  domain?: string;
}

/**
 * Values for the [sameSite] cookie property
 */
export enum SameSiteProperties {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

/**
 * Interface that represents a cookie (name, value)
 */
export interface ICookie {
  name: string;
  value: string;
}
