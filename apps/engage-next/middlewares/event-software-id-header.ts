import type { NextRequest, NextResponse } from 'next/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function eventWithSoftwareIDHeaderMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');
  if (request.nextUrl.pathname.startsWith('/software-id') && testID === 'sendEventFromMiddlewareWithSoftwareID') {

    await CloudSDK(request, response, {
      enableServerCookie: true,
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
    }).addEvents()
      .initialize()

    const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN', page: 'middleware-view' };

    const extensionData = {
      extParam: 'middlewareTest'
    };

    decorateAll(testID);
    await pageView(request, { ...baseEventData, extensionData });
    resetAllDecorators();
  }
}
