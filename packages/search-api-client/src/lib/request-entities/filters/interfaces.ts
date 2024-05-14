// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export interface ComparisonFilterDTO {
  name: string;
  type: string;
  value: unknown;
}

export type ComparisonOperators = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
