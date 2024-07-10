import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { init, sendConversionEvent } from '@sitecore-cloudsdk/search-api-client/server';

export async function sendConversionEventMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/send-conversion-event') || !testID) return;

  decorateFetch(testID as string);

  const eventEntityData = {
    attributes: {
      author: 'ABC'
    },
    entity: 'category',
    entityType: 'subcat',
    id: '123',
    sourceId: '534',
    uri: 'https://www.sitecore.com/products/content-cloud3333333'
  };

  const conversionEventData = {
    currency: 'EUR',
    entity: eventEntityData,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud'
  };

  switch (testID) {
    case 'sendConversionEventFromMiddleware':
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      await sendConversionEvent(request, conversionEventData);
      break;
  }
  resetFetch();
}
