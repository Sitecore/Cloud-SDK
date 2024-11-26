// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';

export async function initServerMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');
  if (!request.nextUrl.pathname.startsWith('/init') || !testID || !testID.includes('FromMiddleware')) return;
  switch (testID) {
    case 'createCookieFromMiddlewareWithWrongTimeout':
      await CloudSDK(request, response, {
        cookieExpiryDays: 400,
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
        timeout: -10
      }).initialize();
      break;
    case 'createCookieFromMiddlewareWithSmallTimeout':
      await CloudSDK(request, response, {
        cookieExpiryDays: 400,
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
        timeout: 1
      }).initialize();
      break;
    default:
      await CloudSDK(request, response, {
        cookieExpiryDays: 400,
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      }).initialize();
      break;
  }
}
