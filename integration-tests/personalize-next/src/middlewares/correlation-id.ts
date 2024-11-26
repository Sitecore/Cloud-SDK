import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../e2e-decorators/decorate-all';

export async function correlationIdMiddleware(request: NextRequest, response: NextResponse) {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/correlation-id') && !testID && !testID?.includes('FromMiddleware')) return;

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  })
    .addPersonalize()
    .initialize();

  if (testID === 'sendPersonalizeFromMiddlewareWithCorrelationID') decorateAll(testID);

  await personalize(request, {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN'
  });

  if (testID === 'sendPersonalizeFromMiddlewareWithCorrelationID') resetAllDecorators();
}
