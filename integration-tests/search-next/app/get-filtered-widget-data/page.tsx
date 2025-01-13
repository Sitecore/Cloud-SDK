'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/browser';
import { createFilter } from '../../src/utils';

export default function Filters() {
  useEffect(() => {
    async function initSearch() {
      CloudSDK({
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
    '{"items":[{"entity":"content","widgetId":"rfkid_7","search":{"filter":{"type":"eq","name":"test","value":"test"}}}]}'
  );

  const getFilteredWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-filtered-widget-data?testID=getFilteredWidgetDataFromAPIWithValidPayload');
  };

  const requestFilteredWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const widget = new SearchWidgetItem(item.entity, item.widgetId);

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
