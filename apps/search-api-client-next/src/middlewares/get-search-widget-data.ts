import type { NextRequest, NextResponse } from 'next/server';
import { SearchWidgetItem, WidgetRequestData, getWidgetData } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';

export async function getSearchWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/get-search-widget-data') || !testID || !testID.includes('FromMiddleware'))
    return;

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getSearchWidgetDataFromMiddlewareWithValidPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new SearchWidgetItem('content', 'rfkid_7', {
        all: true,
        coverage: true,
        max: 50,
        sort: { name: 'count', order: 'asc' }
      });
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
    case 'getSearchWidgetDataFromMiddlewareWithValidPayloadUsingSetter':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new SearchWidgetItem('content', 'rfkid_7');
      widget.facet = {
        all: true,
        coverage: true,
        max: 50,
        sort: { name: 'count', order: 'asc' }
      };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
