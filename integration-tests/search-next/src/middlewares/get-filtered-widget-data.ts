import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
// eslint-disable-next-line sort-imports
import { ComparisonFilter, getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function getFilteredWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/get-filtered-widget-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getFilteredWidgetDataFromMiddlewareWithValidPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new SearchWidgetItem('content', 'rfkid_7');

      widget.filter = new ComparisonFilter('test', 'eq', 10);

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
