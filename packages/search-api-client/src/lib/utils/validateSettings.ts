// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings } from '../types';
import { ErrorMessages } from '../const';
import { validateSettings as validateCoreSettings } from '@sitecore-cloudsdk/core';
/**
 * Validates the provided settings object based on the specified environment.
 * Throws an error if mandatory fields are missing.
 * @param settings - The settings object to validate.
 */
export function validateSettings(settings: BrowserSettings) {
  validateCoreSettings(settings);
  if (typeof window === 'undefined' && !settings.userId) throw new Error(ErrorMessages.MV_0005);
}
