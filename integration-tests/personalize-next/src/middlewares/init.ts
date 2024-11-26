import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK as CloudSDKBrowser } from '@sitecore-cloudsdk/core/browser';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../e2e-decorators/decorate-all';

export async function initMiddleware(request: NextRequest, response: NextResponse) {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (
    !request.nextUrl.pathname.startsWith('/init') &&
    !request.nextUrl.pathname.startsWith('/create-cookie') &&
    !testID &&
    !testID?.includes('FromMiddleware')
  )
    return;

  decorateAll(testID as string);

  switch (testID) {
    case 'initFromMiddlewareWithoutAddPersonalize':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();

      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'initFromMiddlewareWithBrowserInit':
      CloudSDKBrowser({
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      }).initialize();

      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'initWithEnablePersonalizeCookieFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addPersonalize({ enablePersonalizeCookie: true })
        .initialize();

      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'initWithoutEnablePersonalizeCookieFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addPersonalize()
        .initialize();

      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'initWithEnablePersonalizeCookieFromMiddlewareTTL':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_NAME || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addPersonalize({ enablePersonalizeCookie: true })
        .initialize();

      break;
  }
  resetAllDecorators();
}
