// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Settings } from '@sitecore-cloudsdk/core/internal';

/**
 * Defines the configuration settings for the search.
 */
export interface BrowserSettings extends Settings {
  userId?: string;
  enableBrowserCookie?: boolean;
}

/**
 * Represents the server-specific configuration settings for the search.
 */
export interface ServerSettings extends Settings {
  userId: string;
  enableServerCookie?: boolean;
}

export type Pathname = `/${string}`;
