import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { correlationIdMiddleware } from './src/middlewares/correlation-id';
import { geolocationMiddleware } from './src/middlewares/geolocation';
import { initMiddleware } from './src/middlewares/init';
import { requestPersonalizeMiddleware } from './src/middlewares/request';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await initMiddleware(request, response);
  await geolocationMiddleware(request, response);
  await correlationIdMiddleware(request, response);
  await requestPersonalizeMiddleware(request, response);

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/personalize', '/geolocation', '/correlation-id', '/init', '/create-cookie']
};
