import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';

export async function personalizeUtmParamsMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/personalize') || !testID || !testID.includes('FromMiddleware')) return;

  decorateAll(testID as string);
  switch (testID) {
    case 'requestPersonalizeFromMiddlewareBothUTMParams':
      await CloudSDK(request, response, {
        enableServerCookie: false,
        siteName: 'spinair.com',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addPersonalize({ enablePersonalizeCookie: true })
        .initialize();
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        params: { utm: { campaign: 'campaign5', source: 'test5' } }
      });

      break;
  }
  resetAllDecorators();
}
