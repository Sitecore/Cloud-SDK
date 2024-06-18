import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { getPageWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';

export async function getPageWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/get-page-widget-data') || !testID || !testID.includes('FromMiddleware'))
    return;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getPageWidgetDataFromMiddlewareWithValidPayload':
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      await getPageWidgetData('/test');

      break;
  }
  resetFetch();
}
