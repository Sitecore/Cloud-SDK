'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/browser';

export default function GetSearchWidgetData() {
  const searchParams = useSearchParams();

  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: 'TestSite',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .addSearch()
      .initialize();
  }, []);

  const [inputWidgetItemsData, setInputWidgetItemsData] = useState(
    '{"items":[{"entity":"content","widgetId":"rfkid_7","search":{"facet":{"all":true,"max":50}}}]}'
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
            const widget = new SearchWidgetItem(item.entity, item.widgetId);
            widget.facet = item.search.facetSetter;
            return widget;
          }
          if (item.search?.facet) {
            return new SearchWidgetItem(item.entity, item.widgetId, { facet: item.search?.facet });
          }
          if (item.search?.suggestion) {
            return new SearchWidgetItem(item.entity, item.widgetId, { suggestion: item.search?.suggestion });
          }
          if (item.search?.suggestionSetter) {
            const widget = new SearchWidgetItem(item.entity, item.widgetId);
            widget.suggestion = item.search?.suggestionSetter;
            return widget;
          }
          if (item.search?.sort) {
            return new SearchWidgetItem(item.entity, item.widgetId, { sort: item.search?.sort });
          }
          if (item.search?.sortSetter) {
            const widget = new SearchWidgetItem(item.entity, item.widgetId);
            widget.sort = item.search?.sortSetter;
            return widget;
          }
          if (item.search?.personalization) {
            return new SearchWidgetItem(item.entity, item.widgetId, { personalization: item.search?.personalization });
          }
          if (item.search?.personalizationSetter) {
            const widget = new SearchWidgetItem(item.entity, item.widgetId);
            widget.personalization = item.search?.personalizationSetter;
            return widget;
          }
          if (item.search?.ranking) {
            return new SearchWidgetItem(item.entity, item.widgetId, { ranking: item.search?.ranking });
          }
          if (item.search?.rankingSetter) {
            const widget = new SearchWidgetItem(item.entity, item.widgetId);
            widget.ranking = item.search?.rankingSetter;
            return widget;
          }
          if (item.search?.disableGrouping !== undefined) {
            return new SearchWidgetItem(item.entity, item.widgetId, { disableGrouping: item.search?.disableGrouping });
          }

          return new SearchWidgetItem(item.entity, item.widgetId, {}, item.sources);
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
