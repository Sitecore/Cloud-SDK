import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../e2e-decorators/decorate-all';

export async function requestPersonalizeMiddleware(request: NextRequest, response: NextResponse) {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/personalize') && !testID && !testID?.includes('FromMiddleware')) return;

  await CloudSDK(request, response, {
    enableServerCookie: false,
    siteName: process.env.SITE_NAME || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addPersonalize()
    .initialize();

  decorateAll(testID as string);

  switch (testID) {
    case 'requestPersonalizeFromMiddleware':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'requestPersonalizeFromMiddlewareWithUTMParams':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        params: {
          utm: {
            campaign: 'campaign',
            source: 'test'
          }
        }
      });

      break;
    case 'requestPersonalizeFromMiddlewareWithUTMParamsFromUrl':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'requestPersonalizeFromMiddlewareWithBothUTMParams':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        params: {
          utm: {
            campaign: 'campaign',
            source: 'test'
          }
        }
      });

      break;
  }
  resetAllDecorators();
}
