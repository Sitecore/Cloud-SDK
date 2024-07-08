import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { init, sendWidgetNavigationClickEvent } from '@sitecore-cloudsdk/search-api-client/server';

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
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

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
