import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../e2e-decorators/decorate-all';

export async function pageViewMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/page-view') || !testID || !testID.includes('FromMiddleware')) return;

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME as string,
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addEvents()
    .initialize();

  decorateAll(testID);
  switch (testID) {
    case 'sendPageViewFromMiddlewareWithValidPayload':
      pageView(request, {});
      break;
    case 'sendPageViewFromMiddlewareWithIncludeUTMParametersTrue':
      pageView(request, { includeUTMParameters: true });
      break;
    case 'sendPageViewFromMiddlewareWithIncludeUTMParametersFalse':
      pageView(request, { includeUTMParameters: false });
      break;
    case 'sendPageViewEventFromMiddlewareWithSearchData':
      pageView(request, { searchData: {} });
      break;
  }
  resetAll();
}
