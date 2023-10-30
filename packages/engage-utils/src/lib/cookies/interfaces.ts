// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Cookie properties
 */
export interface ICookieProperties {
  maxAge: number;
  sameSite: string;
  secure: boolean;
  path?: string;
  httpOnly?: boolean;
  expires?: Date;
  domain?: string;
}

/**
 * Interface that represents a cookie (name, value)
 */
export interface ICookie {
  name: string;
  value: string;
}
