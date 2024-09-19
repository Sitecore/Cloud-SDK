import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { entityViewMiddleware } from './src/middlewares/entity-view-event';
import { getFilteredWidgetDataMiddleware } from './src/middlewares/get-filtered-widget-data';
import { getPageWidgetDataMiddleware } from './src/middlewares/get-page-widget-data';
import { getSearchWidgetDataMiddleware } from './src/middlewares/get-search-widget-data';
import { getWidgetDataMiddleware } from './src/middlewares/get-widget-data';
import { initMiddleware } from './src/middlewares/init';
import { sendWidgetClickEventMiddleware } from './src/middlewares/send-widget-click-event';
import { sendWidgetFacetClickEventMiddleware } from './src/middlewares/send-widget-facet-click-event';
import { sendWidgetNavigationClickEventMiddleware } from './src/middlewares/send-widget-navigation-click-event';
import { sendWidgetSuggestionClickEventMiddleware } from './src/middlewares/send-widget-suggestion-click-event';
import { widgetViewMiddleware } from './src/middlewares/widget-view';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  const updateMiddleware = '###1###';
  /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

  await getWidgetDataMiddleware(request, response);
  await getFilteredWidgetDataMiddleware(request, response);
  await getSearchWidgetDataMiddleware(request, response);
  await getPageWidgetDataMiddleware(request, response);
  await sendWidgetClickEventMiddleware(request, response);
  await sendWidgetSuggestionClickEventMiddleware(request, response);
  await sendWidgetFacetClickEventMiddleware(request, response);
  await sendWidgetNavigationClickEventMiddleware(request, response);
  await widgetViewMiddleware(request, response);
  await entityViewMiddleware(request, response);
  await initMiddleware(request, response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
