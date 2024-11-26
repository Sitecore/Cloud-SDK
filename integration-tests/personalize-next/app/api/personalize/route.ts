import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../../../src/e2e-decorators/decorate-all';

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  const headersList = headers();
  const host = headersList.get('host');

  const requestUrl = new URL(request.url as string, `https://${host}`);

  const testID = requestUrl.searchParams?.get('testID');

  await CloudSDK(request, response, {
    enableServerCookie: true,
    siteName: process.env.SITE_NAME || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID as string
  })
    .addPersonalize({ enablePersonalizeCookie: true })
    .initialize();

  decorateAll(testID as string);

  switch (testID) {
    case 'requestPersonalizeFromAPI':
    case 'requestPersonalizeFromAPIWithCorrelationID':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'requestPersonalizeFromAPIWithTimeout20':
      try {
        await personalize(
          request,
          {
            channel: 'WEB',
            currency: 'EUR',
            email: 'test_personalize_1@tst.com',
            friendlyId: 'personalizeintegrationtest',
            language: 'EN'
          },
          { timeout: 20 }
        );
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }

      break;
    case 'requestPersonalizeFromAPIWithUTMParamsFromUrl':
      await personalize(request, {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      });

      break;
    case 'requestPersonalizeFromAPIWithUTMParams':
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
    case 'requestPersonalizeFromAPIWithBothUTMParams':
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

  return NextResponse.json({});
}
