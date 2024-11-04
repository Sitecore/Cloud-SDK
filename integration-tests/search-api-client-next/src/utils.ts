import {
  ComparisonFilter,
  GeoFilter,
  GeoWithinFilter,
  ListFilter,
  LogicalFilter
} from '@sitecore-cloudsdk/search-api-client/browser';

export const createFilter = (filterOperator: any, filterRaw: any): any => {
  if (['eq', 'gt', 'gte', 'lt', 'lte'].includes(filterOperator))
    return new ComparisonFilter(filterRaw.name, filterOperator, filterRaw.value);

  if (['and', 'or'].includes(filterOperator)) {
    const filters = filterRaw.filters.map((f: any) => createFilter(f.type, f));
    return new LogicalFilter(filterOperator, filters);
  }

  if (filterOperator === 'not') {
    const filter = createFilter(filterRaw.filter.type, filterRaw.filter);
    return new LogicalFilter(filterOperator, filter);
  }

  if (['allOf', 'anyOf'].includes(filterOperator))
    return new ListFilter(filterRaw.name, filterOperator, filterRaw.values);

  if (filterOperator === 'geoDistance') {
    let geoWithinData: any = undefined;
    if (filterRaw.distance) geoWithinData = { distance: filterRaw.distance };
    if (filterRaw.lat !== undefined && filterRaw.lon !== undefined)
      geoWithinData = { ...geoWithinData, location: { latitude: filterRaw.lat, longitude: filterRaw.lon } };

    return new GeoFilter(filterRaw.name, geoWithinData);
  }

  if (filterOperator === 'geoWithin') {
    const geoWithinFilterData = filterRaw.coordinates.map((f: any) => ({ latitude: f.lat, longitude: f.lon }));
    return new GeoWithinFilter(filterRaw.name, geoWithinFilterData);
  }

  return undefined;
};
