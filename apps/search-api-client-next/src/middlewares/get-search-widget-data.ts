import type { NextRequest, NextResponse } from 'next/server';
import { SearchWidgetItem, WidgetRequestData, getWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function getSearchWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/get-search-widget-data') || !testID || !testID.includes('FromMiddleware'))
    return;

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getSearchWidgetDataFromMiddlewareWithValidPayload':
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

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
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

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
