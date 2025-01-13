import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import {
  ComparisonFilter,
  getWidgetData,
  QuestionsAnswersWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function getQuestionsWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/get-questions-widget-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  let widget: QuestionsAnswersWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getQuestionsWidgetDataFromMiddlewareWithValidPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', { keyphrase: 'test' });
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getQuestionsWidgetDataFromMiddlewareWithValidPayloadUsingSetter':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', { keyphrase: 'original' });
      widget.keyphrase = 'test';
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getQuestionsWidgetDataFromMiddlewareWithAllPropertiesUsingSetter':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', { keyphrase: 'original' });
      widget.keyphrase = 'test';
      widget.exactAnswer = { includeSources: true, queryTypes: ['keyword', 'question', 'statement'] };
      widget.relatedQuestions = {
        filter: new ComparisonFilter('title', 'eq', 'title1'),
        includeSources: true,
        limit: 1,
        offset: 1
      };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getQuestionsWidgetDataFromMiddlewareWithAllProperties':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        exactAnswer: { includeSources: true, queryTypes: ['keyword', 'question', 'statement'] },
        keyphrase: 'test',
        relatedQuestions: {
          filter: new ComparisonFilter('title', 'eq', 'title1'),
          includeSources: true,
          limit: 1,
          offset: 1
        }
      });

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }

  resetFetch();
}
