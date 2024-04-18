import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import type { NextRequest } from 'next/server';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function pageViewEventWithSearchDataMiddleware(request: NextRequest): Promise<void> {
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
      await pageView(request, {
        ...baseEventData,
        searchData: { test: 123 }
      });

      break;
    case 'sendPageViewEventFromMiddlewareWithoutSearchData':
      await pageView(request, {
        ...baseEventData
      });

      break;
  }
  resetAllDecorators();
}
