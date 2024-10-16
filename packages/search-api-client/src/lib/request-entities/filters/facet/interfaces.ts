// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { FacetFilterDTO } from '../../widgets/interfaces';
import type { ArrayOfAtLeastOne, LogicalOperators } from '../interfaces';

export interface FacetFilterBase {
  toDTO: () => unknown;
}

export interface ComparisonFacetFilterDTO {
  type: string;
  value: string;
}

export interface LogicalFacetFilterDTO {
  type: Omit<LogicalOperators, 'not'>;
  filters: ArrayOfAtLeastOne<FacetFilterDTO>;
}
