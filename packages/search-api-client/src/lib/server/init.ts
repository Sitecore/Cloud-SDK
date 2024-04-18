// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ErrorMessages } from '../const';
import type { ServerSettings } from '../types';
import { validateSettings } from '../utils/validateSettings';

let searchSettings: ServerSettings | null = null;

/**
 * Initializes the search-api-client with the provided settings in a server.
 * @param settings - The settings to initialize the search-api-client with.
 */
export function init(settings: ServerSettings) {
  validateSettings(settings);
  searchSettings = settings;
}

/**
 * Retrieves the current settings of the search-api-client.
 * @returns Settings - The current settings or throws error.
 */
export function getSettings(): ServerSettings {
  if (!searchSettings) throw Error(ErrorMessages.IE_0010);

  return searchSettings;
}
