// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { generateV4UUID } from '@sitecore-cloudsdk/utils';

/**
 * A function that generates a correlation id
 *
 * @returns A correlation id string
 */
export function generateCorrelationId(): string {
  return generateV4UUID().replace(/-/g, '');
}
