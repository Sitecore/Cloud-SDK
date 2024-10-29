import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK as CloudSDKBrowser } from '@sitecore-cloudsdk/core/browser';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';

export async function initPersonalizeMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/init-personalize') || !testID || !testID.includes('FromMiddleware'))
    return;

  decorateAll(testID as string);
  switch (testID) {
    case 'initFromMiddlewareWithoutAddPersonalize':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();
      await personalize(request, { channel: 'WEB', currency: 'EUR', friendlyId: 'personalizeintegrationtest' });
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
