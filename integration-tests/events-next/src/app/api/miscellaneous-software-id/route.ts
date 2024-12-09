import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
import { getCustomRRObjects } from '../../../../src/utils/getCustomRRObjects';
import { decorateAll, resetAll } from '../../../e2e-decorators/decorate-all';

export async function GET(req: NextRequest) {
  const testID = req.nextUrl.searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  const { request, response } = getCustomRRObjects();

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME as string,
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addEvents()
    .initialize();

  decorateAll(testID as string);

  if (testID === 'sendEventFromAPIWithSoftwareID') await event(request, { type: 'CUSTOM' });

  resetAll();

  return NextResponse.json({});
}
