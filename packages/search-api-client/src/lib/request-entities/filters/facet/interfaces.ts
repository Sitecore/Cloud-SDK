// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

export interface FacetFilterBase {
  toDTO: () => unknown;
}

export interface ComparisonFacetFilterDTO {
  type: string;
  value: string;
}
