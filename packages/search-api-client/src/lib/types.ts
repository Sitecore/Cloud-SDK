// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BasicSettings } from '@sitecore-cloudsdk/core';
/**
 * Defines the configuration settings for the search-api-client.
 */
export interface BrowserSettings extends BasicSettings {
  userId?: string;
  enableBrowserCookie?: boolean;
}

/**
 * Represents the server-specific configuration settings for the search-api-client.
 */
export interface ServerSettings extends BasicSettings {
  userId: string;
  enableServerCookie?: boolean;
}

export type Pathname = `/${string}`;
