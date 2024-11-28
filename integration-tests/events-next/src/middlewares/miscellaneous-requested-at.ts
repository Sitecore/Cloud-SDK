import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event, identity, pageView } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../e2e-decorators/decorate-all';

export async function miscellaneousRequestedAt(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/miscellaneous-requested-at') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME as string,
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addEvents()
    .initialize();

  decorateAll(testID);
  switch (testID) {
    case 'sendCustomEventFromMiddlewareWithRequestedAt':
      await event(request, { type: 'CUSTOM' });
      break;
    case 'sendPageViewEventFromMiddlewareWithRequestedAt':
      await pageView(request);
      break;
    case 'sendIdentityEventFromMiddlewareWithRequestedAt':
      identity(request, { identifiers: [{ id: 'test@gmail.com', provider: 'email' }] });
      break;
  }
  resetAll();
}
