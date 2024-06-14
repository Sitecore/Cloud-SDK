'use client';
import {
  type BrowserSettings,
  WidgetRequestData,
  getWidgetData,
  init,
  SearchWidgetItem
} from '@sitecore-cloudsdk/search-api-client/browser';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GetSearchWidgetData() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const settings: BrowserSettings = {
      enableBrowserCookie: true,
      siteName: 'TestSite',
      sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      userId: 'test'
    };
    async function initSearch() {
      await init(settings);
    }
    initSearch();
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

          const widget = new SearchWidgetItem(item.entity, item.rfkId, item.search?.facet);

          return widget;
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
