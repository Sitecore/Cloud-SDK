import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
// eslint-disable-next-line sort-imports
import {
  ComparisonFilter,
  WidgetItem,
  WidgetRequestData,
  getWidgetData,
  init
} from '@sitecore-cloudsdk/search-api-client/server';

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
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      widget = new WidgetItem('content', 'rfkid_7');

      widget.filter = new ComparisonFilter('test', 'eq', 10);

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
