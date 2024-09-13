'use client';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  WidgetRequestData,
  getWidgetData,
  WidgetItem,
  ComparisonFilter,
  LogicalFilter,
  ListFilter,
  GeoFilter,
  GeoWithinFilter
} from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function Filters() {
  useEffect(() => {
    async function initSearch() {
      await CloudSDK({
        enableBrowserCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();
    }
    initSearch();
  }, []);

  const [inputWidgetItemsData, setInputWidgetItemsData] = useState(
    '{"items":[{"entity":"content","rfkId":"rfkid_7","search":{"filter":{"type":"eq","name":"test","value":"test"}}}]}'
  );

  const getFilteredWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-filtered-widget-data?testID=getFilteredWidgetDataFromAPIWithValidPayload');
  };

  const createFilter = (filterOperator: any, filterRaw: any): any => {
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

  const requestFilteredWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const widget = new WidgetItem(item.entity, item.rfkId);

          const filterOperator = item.search.filter.type;

          if (!filterOperator) return widget;

          const { filter: filterRaw } = item.search;

          const filter = createFilter(filterOperator, filterRaw);

          if (filter) widget.filter = filter;

          return widget;
        });

    const widgetRequestData = new WidgetRequestData(widgets);

    await getWidgetData(widgetRequestData, contextRequestData);
  };

  return (
    <div>
      <h1>Get filtered widget data page</h1>
      <button
        type='button'
        data-testid='getFilteredWidgetData'
        onClick={requestFilteredWidgetData}>
        Get Filtered Widget Data
      </button>
      <br />
      Widget items data:
      <input
        style={{ width: '800px' }}
        type='text'
        value={inputWidgetItemsData}
        onChange={(e) => setInputWidgetItemsData(e.target.value)}
        data-testid='widgetItemsInput'
      />
      <br />
      <button
        type='button'
        data-testid='getFilteredWidgetDataFromAPIWithValidPayload'
        onClick={getFilteredWidgetDataFromAPIWithValidPayload}>
        Get Filtered Widget Data From API With Valid Data
      </button>
    </div>
  );
}
