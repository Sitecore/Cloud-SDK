import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { getPageWidgetData } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateAll, resetAll } from '../e2e-decorators/decorate-all';

export async function initMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/init') || !testID || !testID.includes('FromMiddleware')) return;

  decorateAll(testID as string);
  switch (testID) {
    case 'initFromMiddlewareWithEnableServerCookieTrue':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: '123' })
        .initialize();
      break;

    case 'initFromMiddlewareWithEnableServerCookieFalse':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: '123' })
        .initialize();
      break;

    case 'initFromMiddlewareWithoutEvents':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addSearch({ userId: '123' })
        .initialize();
      break;

    case 'initFromMiddlewareWithoutAddSearch':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await getPageWidgetData('/test');
      break;
  }
  resetAll();
}
