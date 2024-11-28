import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../../../e2e-decorators/decorate-all';

export async function GET(req: NextRequest, res: NextResponse) {
  const testID = req.nextUrl.searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  decorateAll(testID as string);

  switch (testID) {
    case 'sendEventFromAPIWithSoftwareID':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await event(req, { type: 'CUSTOM' });
      break;
  }
  resetAll();

  return NextResponse.json({});
}
