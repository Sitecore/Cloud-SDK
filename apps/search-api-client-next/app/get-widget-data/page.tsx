'use client';
import {
  type BrowserSettings,
  Context,
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

  const [inputWidgetItemsData, setInputWidgetItemsData] = useState(
    '{"items":[{"entity":"content","rfkId":"rfkid_7","search":{"limit":10,"offset":0}}]}'
  );

  const [inputContextData, setInputContextData] = useState('{"context":{"locale":{"country":"us","language":"en"}}}');

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
