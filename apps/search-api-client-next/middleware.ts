import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getWidgetDataMiddleware } from './src/middlewares/get-widget-data';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await getWidgetDataMiddleware(request);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
