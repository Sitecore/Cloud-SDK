import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { init, sendWidgetFacetClickEvent } from '@sitecore-cloudsdk/search-api-client/server';

export async function sendWidgetFacetClickEventMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/send-widget-facet-click-event') || !testID) return;

  decorateFetch(testID as string);

  switch (testID) {
    case 'sendWidgetFacetClickEventFromMiddleware':
      await init(request, response, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      await sendWidgetFacetClickEvent(request, {
        channel: 'WEB',
        currency: 'EUR',
        filters: [
          {
            displayName: 'test',
            facetPosition: 1,
            name: 'test',
            title: 'test',
            value: 'test',
            valuePosition: 1
          },
          {
            displayName: 'test',
            endValue: '1',
            name: 'test',
            startValue: '1',
            title: 'test',
            value: 'test',
            valuePosition: 1
          }
        ],
        language: 'EN',
        page: 'test',
        pathname: 'https://www.sitecore.com/products/content-cloud',
        request: {
          advancedQueryText: 'test1',
          keyword: 'test_keyword',
          modifiedKeyword: 'test2',
          numRequested: 20,
          numResults: 10,
          pageNumber: 2,
          pageSize: 1,
          redirectUrl: 'test3',
          totalResults: 10
        },
        widgetIdentifier: '12345'
      });
      break;
  }
  resetFetch();
}
