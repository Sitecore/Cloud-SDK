import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../e2e-decorators/decorate-all';

export async function eventMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/event') || !testID || !testID.includes('FromMiddleware')) return;

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME as string,
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addEvents()
    .initialize();

  decorateAll(testID);
  switch (testID) {
    case 'sendCustomEventFromMiddlewareWithValidPayload':
      await event(request, { type: 'ADD_PRODUCTS' });
      break;
    case 'sendCustomEventFromMiddlewareWithSearchData':
      await event(request, { searchData: {}, type: 'ADD_PRODUCTS' });
      break;
  }
  resetAll();
}
