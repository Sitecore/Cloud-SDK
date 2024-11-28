'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search-api-client/browser';

export default function GetSearchWidgetData() {
  const searchParams = useSearchParams();

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
    '{"items":[{"entity":"content","rfkId":"rfkid_7","search":{"facet":{"all":true,"max":50}}}]}'
  );

  const getSearchWidgetDataFromAPIWithValidPayload = async () => {
    const testID = searchParams.get('testID') || '';
    await fetch(`/api/get-search-widget-data?testID=${testID}`);
  };

  const requestSearchWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          if (item.search?.facetSetter) {
            const widget = new SearchWidgetItem(item.entity, item.rfkId);
            widget.facet = item.search.facetSetter;
            return widget;
          }
          if (item.search?.facet) {
            return new SearchWidgetItem(item.entity, item.rfkId, { facet: item.search?.facet });
          }
          if (item.search?.suggestion) {
            return new SearchWidgetItem(item.entity, item.rfkId, { suggestion: item.search?.suggestion });
          }
          if (item.search?.suggestionSetter) {
            const widget = new SearchWidgetItem(item.entity, item.rfkId);
            widget.suggestion = item.search?.suggestionSetter;
            return widget;
          }
          if (item.search?.sort) {
            return new SearchWidgetItem(item.entity, item.rfkId, { sort: item.search?.sort });
          }
          if (item.search?.sortSetter) {
            const widget = new SearchWidgetItem(item.entity, item.rfkId);
            widget.sort = item.search?.sortSetter;
            return widget;
          }

          return new SearchWidgetItem(item.entity, item.rfkId);
        });

    const widgetRequestData = new WidgetRequestData(widgets);

    await getWidgetData(widgetRequestData, contextRequestData);
  };

  return (
    <div>
      <h1>Get search widget data page</h1>
      <button
        type='button'
        data-testid='getSearchWidgetData'
        onClick={requestSearchWidgetData}>
        Get Widget Data
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
        data-testid='getSearchWidgetDataFromAPIWithValidPayload'
        onClick={getSearchWidgetDataFromAPIWithValidPayload}>
        Get Search Widget Data From API With Valid Data
      </button>
    </div>
  );
}
