import type { NextRequest, NextResponse } from 'next/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { CloudSDK as CloudSDKBrowser } from '@sitecore-cloudsdk/core/browser';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function initEventsMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/init-events') || !testID || !testID.includes('FromMiddleware')) return;

  decorateAll(testID as string);
  switch (testID) {
    case 'initFromMiddlewareWithoutAddEvents':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();
      await pageView(request, { channel: 'WEB', currency: 'EUR', language: 'EN' });
      break;
    case 'initFromMiddlewareWithBrowserInit':
      CloudSDKBrowser({
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();
      break;
  }
  resetAllDecorators();
}
