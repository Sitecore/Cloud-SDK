import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../../../e2e-decorators/decorate-all';

export async function GET(req: NextRequest, res: NextResponse) {
  const testID = req.nextUrl.searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  decorateAll(testID as string);

  switch (testID) {
    case 'sendPageViewEventFromAPIWithValidPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await pageView(req, { page: 'test' });
      break;
    case 'sendPageViewFromAPIWithIncludeUTMParametersTrue':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await pageView(req, { includeUTMParameters: true });
      break;
    case 'sendPageViewEventFromAPIWithSearchData':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await pageView(req, { searchData: {} });
      break;
  }
  resetAll();

  return NextResponse.json({});
}
