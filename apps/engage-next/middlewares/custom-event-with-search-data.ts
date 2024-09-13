import type { NextRequest, NextResponse} from 'next/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';

export async function customEventWithSearchDataMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/custom-event-with-search-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

  decorateAll(testID as string);
  switch (testID) {
    case 'sendCustomEventFromMiddlewareWithSearchData':
      await CloudSDK(request, response, {
        cookieExpiryDays: 400,
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addEvents()
        .initialize();

      await event(request, {
        ...baseEventData,
        searchData: { test: 123 },
        type: 'CUSTOM_EVENT'
      });

      break;
    case 'sendCustomEventFromMiddlewareWithoutSearchData':
      await CloudSDK(request, response, {
        cookieExpiryDays: 400,
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addEvents()
        .initialize();

      await event(request, {
        ...baseEventData,
        type: 'CUSTOM_EVENT'
      });

      break;
  }
  resetAllDecorators();
}
