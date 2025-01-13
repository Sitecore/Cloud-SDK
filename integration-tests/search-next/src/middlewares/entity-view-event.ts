import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { entityView } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function entityViewMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/entity-view-event') || !testID) return;

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

  const entityViewEventData = {
    currency: 'EUR',
    entity: eventEntityData,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud'
  };

  switch (testID) {
    case 'entityViewFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      await entityView(request, entityViewEventData);
      break;
  }
  resetFetch();
}
