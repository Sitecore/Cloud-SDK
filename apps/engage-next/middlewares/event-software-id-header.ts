import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import type { NextRequest } from 'next/server';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function eventWithSoftwareIDHeaderMiddleware(request: NextRequest): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');
  if (request.nextUrl.pathname.startsWith('/software-id') && testID === 'sendEventFromMiddlewareWithSoftwareID') {
    const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN', page: 'middleware-view' };

    const extensionData = {
      extParam: 'middlewareTest'
    };

    decorateAll(testID);
    await pageView(request, { ...baseEventData, extensionData });
    resetAllDecorators();
  }
}
