import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
// eslint-disable-next-line sort-imports
import {
  ComparisonFilter,
  WidgetItem,
  WidgetRequestData,
  getWidgetData
} from '@sitecore-cloudsdk/search-api-client/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';

export async function getFilteredWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/get-filtered-widget-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  let widget: WidgetItem;
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
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new WidgetItem('content', 'rfkid_7');

      widget.filter = new ComparisonFilter('test', 'eq', 10);

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
