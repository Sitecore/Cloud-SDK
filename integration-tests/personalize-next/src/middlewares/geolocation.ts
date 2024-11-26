import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize, type PersonalizeData } from '@sitecore-cloudsdk/personalize/server';
import { decorateAll, resetAllDecorators } from '../e2e-decorators/decorate-all';

export async function geolocationMiddleware(request: NextRequest, response: NextResponse) {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/geolocation') && !testID && !testID?.includes('FromMiddleware')) return;

  const { geo } = request;

  if (!geo) return;

  const personalizeData: PersonalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN'
  };

  await CloudSDK(request, response, {
    siteName: process.env.SITE_NAME || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  })
    .addPersonalize()
    .initialize();

  decorateAll(testID as string);

  switch (testID) {
    case 'requestGeoFromMiddleware':
      geo.city = 'Athens';
      geo.country = 'GR';
      geo.region = 'I';

      await personalize(request, personalizeData);

      break;
    case 'requestPartialGeoFromMiddleware':
      geo.city = 'Athens';
      geo.region = 'I';

      await personalize(request, personalizeData);

      break;
    case 'requestNoGeoFromMiddleware':
      await personalize(request, personalizeData);

      break;
    case 'requestOmitGeoFromMiddleware':
      personalizeData.geo = {
        city: 'Tarnów',
        country: 'PL',
        region: '12'
      };
      geo.city = 'Athens';
      geo.region = 'I';

      await personalize(request, personalizeData);

      break;
  }
  resetAllDecorators();
}
