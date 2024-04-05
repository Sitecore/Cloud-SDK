// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BasicSettings } from '@sitecore-cloudsdk/core';
/**
 * Defines the configuration settings for the search-api-client.
 */
export interface BrowserSettings extends BasicSettings {
  userId?: string;
}

/**
 * Represents the server-specific configuration settings for the search-api-client.
 */
export interface ServerSettings extends BrowserSettings {
  userId: string;
}
