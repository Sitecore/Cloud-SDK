import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { Context, getPageWidgetData } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  decorateFetch(testID as string);

  switch (testID) {
    case 'getPageWidgetDataFromAPIWithValidPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      await getPageWidgetData('/test');
      break;
    case 'getPageWidgetDataFromAPIWithValidContextPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      await getPageWidgetData(new Context({ page: { uri: '/test' } }));
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
