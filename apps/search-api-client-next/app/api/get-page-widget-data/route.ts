import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';
import { getPageWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  decorateFetch(testID as string);

  switch (testID) {
    case 'getPageWidgetDataFromAPIWithValidPayload':
      await init(req, res, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      await getPageWidgetData('/test');
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
