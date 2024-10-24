import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { entityViewMiddleware } from './src/middlewares/entity-view-event';
import { getFilteredWidgetDataMiddleware } from './src/middlewares/get-filtered-widget-data';
import { getPageWidgetDataMiddleware } from './src/middlewares/get-page-widget-data';
import { getSearchWidgetDataMiddleware } from './src/middlewares/get-search-widget-data';
import { getRecommendationWidgetDataMiddleware } from './src/middlewares/get-recommendation-widget-data';
import { getWidgetDataMiddleware } from './src/middlewares/get-widget-data';
import { initMiddleware } from './src/middlewares/init';
import { widgetFacetClickMiddleware } from './src/middlewares/widget-facet-click-event';
import { widgetItemClickMiddleware } from './src/middlewares/widget-item-click-event';
import { widgetNavigationClickMiddleware } from './src/middlewares/widget-navigation-click-event';
import { widgetSuggestionClickMiddleware } from './src/middlewares/widget-suggestion-click-event';
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
  await getRecommendationWidgetDataMiddleware(request, response);
  await getPageWidgetDataMiddleware(request, response);
  await widgetItemClickMiddleware(request, response);
  await widgetSuggestionClickMiddleware(request, response);
  await widgetFacetClickMiddleware(request, response);
  await widgetNavigationClickMiddleware(request, response);
  await widgetViewMiddleware(request, response);
  await entityViewMiddleware(request, response);
  await initMiddleware(request, response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
