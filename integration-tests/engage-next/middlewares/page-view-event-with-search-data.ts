import type { NextRequest, NextResponse } from 'next/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function pageViewEventWithSearchDataMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/page-view-event-with-search-data') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

  decorateAll(testID as string);
  switch (testID) {
    case 'sendPageViewEventFromMiddlewareWithSearchData':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addEvents()
        .initialize();
      await pageView(request, {
        ...baseEventData,
        searchData: { test: 123 }
      });

      break;
    case 'sendPageViewEventFromMiddlewareWithoutSearchData':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addEvents()
        .initialize();

      await pageView(request, {
        ...baseEventData
      });

      break;
  }
  resetAllDecorators();
}
