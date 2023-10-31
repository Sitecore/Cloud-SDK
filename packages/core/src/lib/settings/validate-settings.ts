// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ISettingsParams } from './interfaces';

/**
 * Validates the core settings to ensure they meet required criteria.
 *
 * This function validates the provided core settings object to ensure that essential properties such as "contextId," and "siteId" meet specific criteria and are not empty.
 *
 * @param settings - The core settings object to validate.
 * @throws Error with specific error codes if any required property is missing or empty.
 */
export function validateSettings(settings: ISettingsParams) {
  const { contextId, siteId } = settings;

  if (!contextId || contextId.trim().length === 0) throw new Error(`[MV-0001] "contextId" is required.`);

  if (!siteId || siteId.trim().length === 0) throw new Error(`[MV-0002] "siteId" is required.`);
}
