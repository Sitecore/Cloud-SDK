import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { identity } from '@sitecore-cloudsdk/events/server';
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

  if (testID === 'sendIdentityEventFromAPIWithValidPayload') {
    decorateAll(testID as string);
    await identity(request, { identifiers: [{ id: 'test@gmail.com', provider: 'email' }] });
    resetAll();
  }

  return NextResponse.json({});
}
