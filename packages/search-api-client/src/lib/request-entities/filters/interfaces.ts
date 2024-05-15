// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ComparisonFilter } from './comparison-filter';
import type { LogicalFilter } from './logical-filter';

export type Filter = LogicalFilters | ComparisonFilter;

export interface ComparisonFilterDTO {
  name: string;
  type: string;
  value: unknown;
}

export interface LogicalFilterDTO {
  filters: ArrayOfAtleastTwo<ComparisonFilterDTO | LogicalFilterDTO | NotFilterDTO>;
  type: string;
}

export interface NotFilterDTO {
  type: string;
  filter: ComparisonFilterDTO | LogicalFilterDTO;
}

export type ComparisonOperators = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
type LogicalOperators = 'and' | 'or' | 'not';

export type Operators = ComparisonOperators | LogicalOperators;

type LogicalFilters = LogicalFilter<'and' | 'not' | 'or'>;

export interface LogicalFilterValues {
  not: LogicalFilters | ComparisonFilter;
  or: ArrayOfAtleastTwo<LogicalFilters | ComparisonFilter>;
  and: ArrayOfAtleastTwo<LogicalFilters | ComparisonFilter>;
}

export type ArrayOfAtleastTwo<T> = [T, T, ...T[]];
export type PickLogicalDTO<T extends keyof LogicalFilterValues> = T extends 'not' ? NotFilterDTO : LogicalFilterDTO;
