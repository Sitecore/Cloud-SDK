'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  getWidgetData,
  QuestionsAnswersWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/browser';
import { createFilter } from '../../src/utils';

export default function GetQuestionsWidgetData() {
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
    '{"items":[{"entity":"content","widgetId":"rfkid_7","questions":{"keyphrase":"test"}}]}'
  );

  const getQuestionsWidgetDataFromAPIWithValidPayload = async () => {
    const testID = searchParams.get('testID') || '';
    await fetch(`/api/get-questions-widget-data?testID=${testID}`);
  };

  const requestQuestionsWidgetData = async () => {
    let contextRequestData;

    const parsedInputWidgetItemsData = JSON.parse(inputWidgetItemsData);

    if (!parsedInputWidgetItemsData) return;

    const widgets = !parsedInputWidgetItemsData.items
      ? []
      : parsedInputWidgetItemsData.items.map((item: any) => {
          const filterRaw = item.questions?.relatedQuestions?.filter;
          if (filterRaw) {
            const filter = createFilter(filterRaw.type, filterRaw);
            item.questions.relatedQuestions.filter = filter;
          }

          const widget = new QuestionsAnswersWidgetItem(item.entity, item.widgetId, item.questions);

          return widget;
        });

    const widgetRequestData = new WidgetRequestData(widgets);

    await getWidgetData(widgetRequestData, contextRequestData);
  };

  return (
    <div>
      <h1>Get questions widget data page</h1>
      <button
        type='button'
        data-testid='getQuestionsWidgetData'
        onClick={requestQuestionsWidgetData}>
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
        data-testid='getQuestionsWidgetDataFromAPIWithValidPayload'
        onClick={getQuestionsWidgetDataFromAPIWithValidPayload}>
        Get Questions Widget Data From API With Valid Data
      </button>
    </div>
  );
}
