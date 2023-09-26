// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * Validates the pointOfSale parameter. Throws an error if parameter is empty
 * @param pointOfSale - The pointOfSale passed from the init settings.
 * @returns - The retrieved pointOfSale attribute to be sent to the API
 */
export function getPointOfSale(pointOfSale?: string): string {
  if (pointOfSale && pointOfSale.trim().length > 0) return pointOfSale;

  throw Error('[MV-0003] "pointOfSale" is required.');
}
