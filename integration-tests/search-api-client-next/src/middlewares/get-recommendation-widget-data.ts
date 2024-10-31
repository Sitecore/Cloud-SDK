import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import {
  getWidgetData,
  RecommendationWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function getRecommendationWidgetDataMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/get-recommendation-widget-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  let widget: RecommendationWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getRecommendationWidgetDataFromMiddlewareWithValidPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7', { content: { fields: ['id'] } });
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getRecommendationWidgetDataFromMiddlewareWithValidPayloadUsingSetter':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      widget.content = { fields: ['id'] };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
