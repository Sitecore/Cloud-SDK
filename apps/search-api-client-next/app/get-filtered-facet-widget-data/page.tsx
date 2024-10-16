'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  ComparisonFacetFilter,
  getWidgetData,
  LogicalFacetFilter,
  SearchWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/browser';

export default function SearchFilters() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: 'TestSite',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .addSearch({ userId: 'test' })
      .initialize();
  }, []);

  const [inputWidgetItemsData, setInputWidgetItemsData] = useState(
    '{"items":{"types":[{"name":"test", "filter": {"type":"or","values":[{"type":"gt","value":"test1"}]}}]}}'
  );

  const createFilter = (filterOperator: any, filterValue: any): any => {
    if (['eq', 'gt', 'gte', 'lt', 'lte'].includes(filterOperator))
      return new ComparisonFacetFilter(filterOperator, filterValue);

    if (['or', 'and'].includes(filterOperator)) {
      return new LogicalFacetFilter(
        filterOperator,
        filterValue.map((filter: any) => createFilter(filter.type, filter.value))
      );
    }

    return undefined;
  };

  const requestFilteredWidgetData = async () => {
    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widget = new SearchWidgetItem('content', 'rfkid_7');

    const widgetTypes = parsedInputWidgetItemsData.items.types.map((type: any) => {
      const mainFilter = type.filter.type;
      const mainFilterValues = type.filter.values;

      return {
        name: 'type',
        filter: {
          type: mainFilter,
          values: mainFilterValues.map((filter: any) => {
            return typeof filter === 'string' ? filter : createFilter(filter.type, filter.value);
          })
        }
      };
    });

    widget.facet = { types: widgetTypes };

    const widgetRequestData = new WidgetRequestData([widget]);

    await getWidgetData(widgetRequestData);
  };

  return (
    <div>
      <h1>Get filtered widget data page</h1>
      <button
        type='button'
        data-testid='getFilteredWidgetData'
        onClick={requestFilteredWidgetData}>
        Get Filtered Facet Widget Data
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
    </div>
  );
}
