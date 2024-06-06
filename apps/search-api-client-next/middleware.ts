import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSearchWidgetDataMiddleware } from './src/middlewares/get-search-widget-data';
import { getWidgetDataMiddleware } from './src/middlewares/get-widget-data';
import { initMiddleware } from './src/middlewares/init';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await getWidgetDataMiddleware(request, response);
  await getSearchWidgetDataMiddleware(request, response);
  await initMiddleware(request, response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
