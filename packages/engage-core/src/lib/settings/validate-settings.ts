// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParamsBrowser, ISettingsParamsServer } from './interfaces';

/**
 * A validation function for the required global settings
 */
export function validateSettings(settings: ISettingsParamsBrowser | ISettingsParamsServer) {
  const { clientKey, targetURL, pointOfSale } = settings;

  if (!clientKey) throw new Error(`[MV-0001] "clientKey" is required.`);

  if (!targetURL) throw new Error(`[MV-0002] "targetURL" is required.`);

  if (pointOfSale && pointOfSale.trim().length === 0) throw new Error('[MV-0009] "pointOfSale" cannot be empty.');

  try {
    new URL(targetURL);
  } catch (e) {
    throw new Error(`[IV-0001] Incorrect value for "targetURL". Set the value to a valid URL string.`);
  }
}
