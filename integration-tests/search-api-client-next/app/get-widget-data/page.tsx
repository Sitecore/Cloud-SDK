'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  Context,
  GeoFilter,
  getWidgetData,
  SearchWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/browser';

export default function GetWidgetData() {
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
    '{"items":[{"entity":"content","rfkId":"rfkid_7" , "search": {"limit": 10, "offset": 0,  "filter": "add"}}]}'
  );

  const [inputContextData, setInputContextData] = useState('{"context":{"locale":{"country":"US","language":"EN"}}}');

  const getWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-widget-data?testID=getWidgetDataFromAPIWithValidPayload');
  };

  const getWidgetDataFromAPIWithSearchPayload = async () => {
    await fetch('/api/get-widget-data?testID=getWidgetDataFromAPIWithSearchPayload');
  };

  const requestWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);
    const parsedInputContextData = JSON.parse(inputContextData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          if (Object.keys(item).length === 2) {
            const widget = new SearchWidgetItem(item.entity, item.rfkId);

            return widget;
          }

          const widget = new SearchWidgetItem(item.entity, item.rfkId);

          if (item.search?.limit) widget.limit = item.search.limit;
          if (item.search?.offset) widget.offset = item.search.offset;
          if (item.search?.content) widget.content = item.search.content;
          if (item.search?.query) {
            if (item.search.query?.keyphrase !== undefined) widget.query = { keyphrase: item.search.query.keyphrase };
            if (item.search.query?.operator !== undefined)
              widget.query = { keyphrase: item.search.query.keyphrase, operator: item.search.query.operator };
          }

          if (item.search?.filter) {
            const filter = new GeoFilter('location', {
              location: { latitude: -16.181724, longitude: -47.277881 },
              distance: '3000km'
            });

            switch (item.search?.filter) {
              case 'add':
                widget.filter = filter;
                break;
              case 'remove':
                widget.filter = filter;
                widget.resetFilter();
                break;
            }
          }

          return widget;
        });

    const widgetRequestData = new WidgetRequestData(widgets);

    if (parsedInputContextData?.context) contextRequestData = new Context(parsedInputContextData.context);

    await getWidgetData(widgetRequestData, contextRequestData);
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
      Context data:
      <input
        style={{ width: '800px' }}
        type='text'
        value={inputContextData}
        onChange={(e) => setInputContextData(e.target.value)}
        data-testid='contextInput'
      />
      <br />
      <button
        type='button'
        data-testid='getWidgetDataFromAPIWithValidPayload'
        onClick={getWidgetDataFromAPIWithValidPayload}>
        Get Widget Data From API With Valid Data
      </button>
      <br />
      <button
        type='button'
        data-testid='getWidgetDataFromAPIWithSearchPayload'
        onClick={getWidgetDataFromAPIWithSearchPayload}>
        Get Widget Data From API With Search Object
      </button>
    </div>
  );
}
