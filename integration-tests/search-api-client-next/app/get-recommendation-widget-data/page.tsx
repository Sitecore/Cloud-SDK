'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  getWidgetData,
  RecommendationWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/browser';
import { createFilter } from '../../src/utils';

export default function GetRecommendationWidgetData() {
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
    '{"items":[{"entity":"content","rfkId":"rfkid_7","recommendations":{}}]}'
  );

  const getRecommendationWidgetDataFromAPIWithValidPayload = async () => {
    const testID = searchParams.get('testID') || '';
    await fetch(`/api/get-recommendation-widget-data?testID=${testID}`);
  };

  const requestRecommendationWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const widget = new RecommendationWidgetItem(item.entity, item.rfkId, item.recommendations);
          const filterOperator = item.recommendations?.filter?.type;

          if (!filterOperator) return widget;

          const filterRaw = item.recommendations.filter;
          const filter = createFilter(filterOperator, filterRaw);

          if (filter) widget.filter = filter;

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
        data-testid='getRecommendationWidgetData'
        onClick={requestRecommendationWidgetData}>
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
        data-testid='getRecommendationWidgetDataFromAPIWithValidPayload'
        onClick={getRecommendationWidgetDataFromAPIWithValidPayload}>
        Get Recommendation Widget Data From API With Valid Data
      </button>
      <br />
      <button
        type='button'
        data-testid='getRecommendationWidgetDataFromAPIWithEmptyContent'
        onClick={getRecommendationWidgetDataFromAPIWithValidPayload}>
        Get Recommendation Widget Data From API With Empty Content
      </button>
    </div>
  );
}
