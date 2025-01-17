'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { Context, getWidgetData, RecommendationWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/browser';
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
      .addSearch()
      .initialize();
  }, []);

  const [inputWidgetItemsData, setInputWidgetItemsData] = useState(
    '{"items":[{"entity":"content","widgetId":"rfkid_7","recommendations":{}}]}'
  );

  const getRecommendationWidgetDataFromAPIWithValidPayload = async () => {
    const testID = searchParams.get('testID') || '';
    await fetch(`/api/get-recommendation-widget-data?testID=${testID}`);
  };

  const requestRecommendationWidgetData = async () => {
    const contextRequestData = new Context({ locale: { language: 'en', country: 'US' } });

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const widget = new RecommendationWidgetItem(item.entity, item.widgetId, item.recommendations);
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

  const requestRecommendationWidgetDataWithRule = async () => {
    const contextRequestData = new Context({ locale: { language: 'en', country: 'US' } });

    const ruleObject = { boost: [], include: [], pin: [] } as any;
    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const widget = new RecommendationWidgetItem(item.entity, item.widgetId, item.recommendations);

          if (!item.recommendations?.rule) return widget;

          if (item.recommendations.rule?.blacklist) {
            const filter = createFilter(
              item.recommendations.rule.blacklist.filter.type,
              item.recommendations.rule.blacklist.filter
            );
            ruleObject.blacklist = { filter };
          }

          if (item.recommendations.rule?.boost) {
            item.recommendations.rule.boost.forEach((item: any) => {
              ruleObject.boost.push({
                filter: createFilter(item.filter.type, item.filter),
                slots: item.slots,
                weight: item.weight
              });
            });
          }

          if (item.recommendations.rule?.bury) {
            const filter = createFilter(
              item.recommendations.rule.bury.filter.type,
              item.recommendations.rule.bury.filter
            );
            ruleObject.bury = { filter };
          }

          if (item.recommendations.rule?.include) {
            item.recommendations.rule.include.forEach((item: any) => {
              ruleObject.include.push({
                filter: createFilter(item.filter.type, item.filter),
                slots: item.slots
              });
            });
          }

          if (item.recommendations.rule?.pin) {
            item.recommendations.rule.pin.forEach((item: any) => {
              ruleObject.pin.push({
                id: item.id,
                slot: item.slot
              });
            });
          }

          widget.rule = { ...item.recommendations.rule, ...ruleObject };
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
      <button
        type='button'
        data-testid='getRecommendationWidgetDataWithRule'
        onClick={requestRecommendationWidgetDataWithRule}>
        Get Widget Data with Rule
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
