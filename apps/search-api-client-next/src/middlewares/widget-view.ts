import type { NextRequest, NextResponse } from 'next/server';
import type {
  SearchEventEntity,
  SearchEventRequest,
  WidgetViewEventParams
} from 'packages/search-api-client/src/lib/events/interfaces';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { init, widgetView } from '@sitecore-cloudsdk/search-api-client/server';

export async function widgetViewMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/widget-view') || !testID) return;

  decorateFetch(testID as string);

  const eventRequestData: SearchEventRequest = {
    advancedQueryText: 'test1',
    keyword: 'test_keyword',
    modifiedKeyword: 'test2',
    numRequested: 20,
    numResults: 10,
    pageNumber: 2,
    pageSize: 1,
    redirectUrl: 'test3',
    totalResults: 10
  };

  const eventEntitiesData: Array<SearchEventEntity> = [
    {
      attributes: {
        author: 'ABC'
      },
      entity: 'category1',
      entityType: 'subcat1',
      id: '123',
      sourceId: '534',
      uri: 'https://www.sitecore.com/products/content-cloud3333333'
    },
    {
      attributes: {
        author: 'XYZ'
      },
      entity: 'category2',
      entityType: 'subcat2',
      id: '678',
      sourceId: '910',
      uri: 'https://www.sitecore.com/products/content-cloud4444444'
    }
  ];

  const widgetViewEventData: WidgetViewEventParams = {
    channel: 'WEB',
    currency: 'EUR',
    entities: eventEntitiesData,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: eventRequestData,
    widgetIdentifier: '12345'
  };

  switch (testID) {
    case 'widgetViewFromMiddleware':
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      await widgetView(request, widgetViewEventData);
      break;
  }
  resetFetch();
}
