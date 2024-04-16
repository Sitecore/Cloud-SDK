// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BrowserSettings } from '../types';
import { ErrorMessages } from '../const';
import { validateSettings } from '../utils/validateSettings';

let searchSettings: BrowserSettings | null = null;
/**
 * Initializes the search-api-client with the provided settings.
 * @param settings - The settings to initialize the search-api-client with.
 */
export function init(settings: BrowserSettings) {
  validateSettings(settings);
  searchSettings = settings;
}

/**
 * Retrieves the current settings of the search-api-client.
 * @returns The current settings or throws error.
 */
export function getSettings(): BrowserSettings {
  if (!searchSettings) {
    throw Error(ErrorMessages.IE_0009);
  }
  return searchSettings;
}
