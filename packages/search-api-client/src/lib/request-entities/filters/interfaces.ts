// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BaseFilter } from './base-filter';
import type { LocationData } from '../context/interfaces';

export interface ComparisonFilterDTO {
  name: string;
  type: string;
  value: unknown;
}

export interface ListFilterDTO {
  name: string;
  type: string;
  values: unknown[];
}

export interface LogicalFilterDTO {
  filters: ArrayOfAtLeastTwo<ComparisonFilterDTO | LogicalFilterDTO | NotFilterDTO>;
  type: string;
}

export interface GeoFilterData {
  distance?: DistanceString;
  location?: LocationData;
}

export type GeoWithinFilterData = ArrayOfAtLeastThree<LocationData>;

export interface GeoFilterDTO {
  distance?: DistanceString;
  name: string;
  type: GeoOperator;
  lat?: number;
  lon?: number;
}

export interface LocationDTO {
  lat: number;
  lon: number;
}

export interface GeoWithinFilterDTO {
  name: string;
  type: GeoWithinOperator;
  coordinates: ArrayOfAtLeastThree<LocationDTO>;
}

export type DistanceString = `${number}${DistanceUnits}`;
type DistanceUnits = 'in' | 'ft' | 'yd' | 'nmi' | 'km' | 'm' | 'cm' | 'mm';

export interface NotFilterDTO {
  type: string;
  filter: ComparisonFilterDTO | LogicalFilterDTO;
}

export type ComparisonOperators = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
type LogicalOperators = 'and' | 'or' | 'not';
export type ListOperators = 'allOf' | 'anyOf';

export type GeoOperator = 'geoDistance';
export type GeoWithinOperator = 'geoWithin';

export type Operators = ComparisonOperators | LogicalOperators | GeoOperator | GeoWithinOperator | ListOperators;

export interface LogicalFilterValues {
  not: BaseFilter;
  or: ArrayOfAtLeastTwo<BaseFilter>;
  and: ArrayOfAtLeastTwo<BaseFilter>;
}

export type ArrayOfAtLeastTwo<T> = [T, T, ...T[]];
export type ArrayOfAtLeastThree<T> = [T, T, T, ...T[]];
export type PickLogicalDTO<T extends keyof LogicalFilterValues> = T extends 'not' ? NotFilterDTO : LogicalFilterDTO;
