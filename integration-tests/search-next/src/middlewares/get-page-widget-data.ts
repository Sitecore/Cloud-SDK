import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { Context, getPageWidgetData } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function getPageWidgetDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/get-page-widget-data') || !testID || !testID.includes('FromMiddleware'))
    return;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getPageWidgetDataFromMiddlewareWithValidPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      await getPageWidgetData('/test');

      break;
    case 'getPageWidgetDataFromMiddlewareWithValidContextPayload':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      await getPageWidgetData(new Context({ page: { uri: '/test' } }));

      break;
  }
  resetFetch();
}
