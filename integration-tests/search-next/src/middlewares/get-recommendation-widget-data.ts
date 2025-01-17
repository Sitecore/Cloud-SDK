import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import {
  ComparisonFilter,
  getWidgetData,
  RecommendationWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search/server';
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
        .addSearch()
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
        .addSearch()
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      widget.content = { fields: ['id'] };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getRecommendationWidgetDataFromMiddlewareWithFilters':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      // eslint-disable-next-line no-case-declarations
      const filter = new ComparisonFilter('title', 'eq', 'title1');
      widget.filter = filter;

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getRecommendationWidgetDataFromMiddlewareWithRecipe':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      widget.recipe = { id: 'recipeId', version: 1 };

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getRecommendationWidgetDataFromMiddlewareWithGroupBy':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      widget.groupBy = 'type';

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;

    case 'getRecommendationWidgetDataFromMiddlewareWithLimit':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new RecommendationWidgetItem('content', 'rfkid_7');
      widget.limit = 1;

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }

  resetFetch();
}
