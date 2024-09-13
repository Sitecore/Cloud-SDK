import type { NextRequest, NextResponse } from 'next/server';
import { decorateFetch, resetFetch } from '../e2e-decorators/fetch-decorator';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { sendWidgetSuggestionClickEvent } from '@sitecore-cloudsdk/search-api-client/server';

export async function sendWidgetSuggestionClickEventMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/send-widget-suggestion-click-event') || !testID) return;

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
    case 'sendWidgetSuggestionClickEventFromMiddleware':
      await CloudSDK(request, response, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();
      await sendWidgetSuggestionClickEvent(request, widgetSuggestionClickEventData);
      break;
  }
  resetFetch();
}
