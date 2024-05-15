'use client';
import { WidgetItem, WidgetRequestData, getWidgetData, init } from '@sitecore-cloudsdk/search-api-client/browser';
import { useState } from 'react';

export default function GetWidgetData() {
  const [inputData, setinputData] = useState(
    '{"items":[{"entity":"content","rfkId":"rfkid_7" , "search": {"limit": 10, "offset": 0}}]}'
  );

  const getWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-widget-data?testID=getWidgetDataFromAPIWithValidPayload');
  };

  const requestWidgetData = async () => {
    const parsedInputData = JSON.parse(inputData);

    if (!parsedInputData) return;

    init({
      siteName: 'TestSite',
      sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
      sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io'
    });

    const widgets = !parsedInputData.items
      ? []
      : parsedInputData.items.map((item: any) => {
          const widget = new WidgetItem(item.entity, item.rfkId);

          if (item.search?.limit) widget.limit = item.search.limit;
          if (item.search?.offset) widget.offset = item.search.offset;
          if (item.search?.content) widget.content = item.search.content.fields;
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
