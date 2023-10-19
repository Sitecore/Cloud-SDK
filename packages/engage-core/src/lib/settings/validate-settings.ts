// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParams } from './interfaces';

/**
 * A validation function for the required global settings
 */
export function validateSettings(settings: ISettingsParams) {
  const { clientKey, pointOfSale, contextId, siteId } = settings;

  if (!clientKey) throw new Error(`[MV-0001] "clientKey" is required.`);

  if (pointOfSale && pointOfSale.trim().length === 0) throw new Error('[MV-0009] "pointOfSale" cannot be empty.');

  if (!contextId || contextId.trim().length === 0) throw new Error(`[MV-0001] "contextId" is required.`);

  if (!siteId || siteId.trim().length === 0) throw new Error(`[MV-0002] "siteId" is required.`);
}
