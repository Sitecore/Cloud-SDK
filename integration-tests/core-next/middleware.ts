// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { initServerMiddleware } from './src/middlewares/init-server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  await initServerMiddleware(request, response);
  return response;
}
