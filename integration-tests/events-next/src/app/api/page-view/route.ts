import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';
import { getCustomRRObjects } from '../../../../src/utils/getCustomRRObjects';
import { decorateAll, resetAll } from '../../../e2e-decorators/decorate-all';

export async function GET(req: NextRequest) {
  const testID = req.nextUrl.searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  decorateAll(testID as string);

  const { request, response } = getCustomRRObjects();

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME as string,
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addEvents()
    .initialize();

  switch (testID) {
    case 'sendPageViewEventFromAPIWithValidPayload':
      await pageView(request, { page: 'test' });
      break;
    case 'sendPageViewFromAPIWithIncludeUTMParametersTrue':
      (request as any).url = req.nextUrl;
      await pageView(request, { includeUTMParameters: true });
      break;
    case 'sendPageViewEventFromAPIWithSearchData':
      await pageView(request, { searchData: {} });
      break;
  }
  resetAll();

  return NextResponse.json({});
}
