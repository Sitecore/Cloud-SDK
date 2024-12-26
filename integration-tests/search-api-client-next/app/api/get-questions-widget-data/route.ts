import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import {
  ComparisonFilter,
  getWidgetData,
  QuestionsAnswersWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';

export async function GET(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: QuestionsAnswersWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);

  switch (testID) {
    case 'getQuestionsWidgetDataFromAPIWithValidPayload':
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

    case 'getQuestionsWidgetDataFromAPIWithValidPayloadUsingSetter':
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

    case 'getQuestionsWidgetDataFromAPIWithAllPropertiesUsingSetter':
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
      widget.rule = {
        behaviors: true,
        blacklist: { filter: new ComparisonFilter('title', 'eq', 'title1') },
        boost: [{ filter: new ComparisonFilter('title', 'eq', 'title1'), slots: [1], weight: 1 }],
        bury: { filter: new ComparisonFilter('title', 'eq', 'title1') },
        include: [{ filter: new ComparisonFilter('title', 'eq', 'title1'), slots: [1] }],
        pin: [{ id: 'id1', slot: 3 }]
      };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getQuestionsWidgetDataFromAPIWithAllProperties':
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
        },
        rule: {
          behaviors: true,
          blacklist: { filter: new ComparisonFilter('title', 'eq', 'title1') },
          boost: [{ filter: new ComparisonFilter('title', 'eq', 'title1'), slots: [1], weight: 1 }],
          bury: { filter: new ComparisonFilter('title', 'eq', 'title1') },
          include: [{ filter: new ComparisonFilter('title', 'eq', 'title1'), slots: [1] }],
          pin: [{ id: 'id1', slot: 3 }]
        }
      });
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }

  resetFetch();

  return NextResponse.json({});
}
