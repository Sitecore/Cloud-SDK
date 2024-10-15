// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type { FacetFilter } from './interfaces';

/**
 * Checks if the provided filters are facet filters.
 * @param filters - The filters to check.
 * @returns True if the filters are facet filters, false otherwise.
 */
export function isFacetFilter(
  filters: ArrayOfAtLeastOne<string> | ArrayOfAtLeastOne<FacetFilter>
): filters is ArrayOfAtLeastOne<FacetFilter> {
  if (typeof filters[0] === 'string') return false;

  return true;
}
