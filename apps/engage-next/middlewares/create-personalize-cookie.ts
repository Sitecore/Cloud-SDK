import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';

export async function createPersonalizeCookie(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');
  if (
    !request.nextUrl.pathname.startsWith('/create-personalize-cookie') ||
    !testID ||
    !testID.includes('FromMiddleware')
  )
    return;

  decorateAll(testID as string);

  switch (testID) {
    case 'initWithEnablePersonalizeCookieFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: process.env.SITE_ID || '',
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
        siteName: process.env.SITE_ID || '',
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
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
      })
        .addPersonalize({ enablePersonalizeCookie: true })
        .initialize();
      break;
  }

  resetAllDecorators();
}
