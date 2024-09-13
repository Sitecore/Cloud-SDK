import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { sendWidgetNavigationClickEvent } from '@sitecore-cloudsdk/search-api-client/server';

export async function sendWidgetNavigationClickEventMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/send-widget-navigation-click-event') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  decorateFetch(testID as string);
  switch (testID) {
    case 'sendWidgetNavigationClickEventFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      // eslint-disable-next-line no-case-declarations
      const payload = {
        channel: 'WEB',
        currency: 'EUR',
        itemPosition: 1,
        language: 'EN',
        page: 'test',
        pathname: 'https://www.sitecore.com/products/content-cloud',
        widgetIdentifier: '12345'
      };

      await sendWidgetNavigationClickEvent(request, payload);

      break;
  }
  resetFetch();
}
