import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAll } from '../e2e-decorators/decorate-all';

export async function initMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/init') || !testID || !testID.includes('FromMiddleware')) return;

  decorateAll(testID);

  switch (testID) {
    case 'initCloudSDKFromMiddlewareWithAddEvents':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .initialize();
      await event(request, { type: 'CUSTOM' });
      break;
    case 'initCloudSDKFromMiddlewareWithoutAddEvents':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME as string,
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();
      await event(request, { type: 'CUSTOM' });
      break;
  }

  resetAll();
}
