import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
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
    case 'sendCustomEventFromAPIWithValidPayload':
      await event(request, { type: 'ADD_PRODUCTS' });
      break;
    case 'sendCustomEventFromAPIWithSearchData':
      await event(request, { searchData: {}, type: 'CUSTOM' });
      break;
  }
  resetAll();

  return NextResponse.json({});
}
