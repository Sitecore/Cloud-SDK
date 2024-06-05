import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import type { NextRequest } from 'next/server';
import { event } from '@sitecore-cloudsdk/events/server';

export async function customEventWithSearchDataMiddleware(request: NextRequest): Promise<void> {
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
      await event(request, {
        ...baseEventData,
        searchData: { test: 123 },
        type: 'CUSTOM_EVENT'
      });

      break;
    case 'sendCustomEventFromMiddlewareWithoutSearchData':
      await event(request, {
        ...baseEventData,
        type: 'CUSTOM_EVENT'
      });

      break;
  }
  resetAllDecorators();
}
