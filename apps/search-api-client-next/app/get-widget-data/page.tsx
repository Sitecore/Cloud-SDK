'use client';
import {
  type BrowserSettings,
  WidgetItem,
  WidgetRequestData,
  getWidgetData,
  init
} from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function GetWidgetData() {
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

  const [inputData, setinputData] = useState(
    '{"items":[{"entity":"content","rfkId":"rfkid_7" , "search": {"limit": 10, "offset": 0}}]}'
  );

  const getWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-widget-data?testID=getWidgetDataFromAPIWithValidPayload');
  };

  const requestWidgetData = async () => {
    const parsedInputData = JSON.parse(inputData);

    if (!parsedInputData) return;

    const widgets = !parsedInputData.items
      ? []
      : parsedInputData.items.map((item: any) => {
          const widget = new WidgetItem(item.entity, item.rfkId);

          if (item.search?.limit) widget.limit = item.search.limit;
          if (item.search?.offset) widget.offset = item.search.offset;
          if (item.search?.content) widget.content = item.search.content.fields;
          if (item.search?.query) {
            if (item.search.query?.keyphrase !== undefined) widget.keyphrase = item.search.query.keyphrase;
            if (item.search.query?.operator !== undefined) widget.operator = item.search.query.operator;
          }

          return widget;
        });

    const widgetRequestData = new WidgetRequestData(widgets);

    await getWidgetData(widgetRequestData);
  };

  return (
    <div>
      <h1>Get widget data page</h1>
      <button
        type='button'
        data-testid='getWidgetData'
        onClick={requestWidgetData}>
        Get Widget Data
      </button>
      <input
        type='text'
        value={inputData}
        onChange={(e) => setinputData(e.target.value)}
        data-testid='widgetItemsInput'
      />
      <br />
      <button
        type='button'
        data-testid='getWidgetDataFromAPIWithValidPayload'
        onClick={getWidgetDataFromAPIWithValidPayload}>
        Get Widget Data From API With Valid Data
      </button>
    </div>
  );
}
