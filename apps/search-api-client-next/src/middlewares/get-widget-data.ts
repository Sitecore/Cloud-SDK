import { WidgetItem, WidgetRequestData, getWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import type { NextRequest } from 'next/server';

export async function getWidgetDataMiddleware(request: NextRequest): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/get-widget-data') || !testID || !testID.includes('FromMiddleware')) return;

  let widget: WidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getWidgetDataFromMiddlewareWithValidPayload':
      init({
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      widget = new WidgetItem('content', 'rfkid_7');
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);

      break;
  }
  resetFetch();
}
