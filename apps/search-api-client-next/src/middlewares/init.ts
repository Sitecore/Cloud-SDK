import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { init } from '@sitecore-cloudsdk/search-api-client/server';

export async function initMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/init') || !testID || !testID.includes('FromMiddleware')) return;

  decorateFetch(testID as string);
  switch (testID) {
    case 'initFromMiddlewareWithEnableServerCookieTrue':
      await init(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        userId: 'user123',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      });
      break;
    case 'initFromMiddlewareWithEnableServerCookieFasle':
      await init(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        userId: 'user123',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      });
      break;
  }
  resetFetch();
}
