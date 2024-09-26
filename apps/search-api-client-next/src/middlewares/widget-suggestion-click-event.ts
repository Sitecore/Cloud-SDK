import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { widgetSuggestionClick } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';

export async function widgetSuggestionClickMiddleware(request: NextRequest, response: NextResponse): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/widget-suggestion-click-event') || !testID) return;

  decorateFetch(testID as string);

  const eventRequestData = {
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

  const widgetSuggestionClickEventData = {
    channel: 'WEB',
    currency: 'EUR',
    filters: [
      {
        displayName: 'test',
        name: 'test',
        title: 'test',
        value: 'test',
        valuePosition: 1
      }
    ],
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: eventRequestData,
    widgetIdentifier: '12345'
  };

  switch (testID) {
    case 'widgetSuggestionClickFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();
      await widgetSuggestionClick(request, widgetSuggestionClickEventData);
      break;
  }
  resetFetch();
}
