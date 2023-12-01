// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { SettingsParams } from './interfaces';
/**
 * Validates the core settings to ensure they meet required criteria.
 *
 * This function validates the provided core settings object to ensure that essential properties such as "sitecoreEdgeContextId," and "siteName" meet specific criteria and are not empty.
 *
 * @param settings - The core settings object to validate.
 * @throws Error with specific error codes if any required property is missing or empty.
 */
export function validateSettings(settings: SettingsParams) {
  const { sitecoreEdgeContextId, siteName, sitecoreEdgeUrl } = settings;
  if (!sitecoreEdgeContextId || sitecoreEdgeContextId.trim().length === 0)
    throw new Error(`[MV-0001] "sitecoreEdgeContextId" is required.`);

  if (!siteName || siteName.trim().length === 0) throw new Error(`[MV-0002] "siteName" is required.`);

  if (sitecoreEdgeUrl !== undefined) {
    try {
      new URL(sitecoreEdgeUrl);
    } catch (e) {
      throw new Error(
        `[IV-0001] Incorrect value for "sitecoreEdgeUrl" parameter. Set the value to a valid URL string.`
      );
    }
  }
}
