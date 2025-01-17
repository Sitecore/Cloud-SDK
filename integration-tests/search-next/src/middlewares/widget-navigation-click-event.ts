import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { widgetNavigationClick } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function widgetNavigationClickMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/widget-navigation-click-event') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  decorateFetch(testID as string);
  switch (testID) {
    case 'widgetNavigationClickFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      // eslint-disable-next-line no-case-declarations
      const payload = {
        channel: 'WEB',
        currency: 'EUR',
        itemPosition: 1,
        language: 'EN',
        page: 'test',
        pathname: 'https://www.sitecore.com/products/content-cloud',
        widgetId: '12345'
      };

      await widgetNavigationClick(request, payload);

      break;
  }
  resetFetch();
}
