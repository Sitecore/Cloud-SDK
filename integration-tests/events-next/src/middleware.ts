// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { eventMiddleware } from './middlewares/event';
import { identityMiddleware } from './middlewares/identity';
import { initMiddleware } from './middlewares/init';
import { miscellaneousRequestedAt } from './middlewares/miscellaneous-requested-at';
import { miscellaneousSoftwareId } from './middlewares/miscellaneous-software-id';
import { pageViewMiddleware } from './middlewares/page-view';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  const updateMiddleware = '###1###';
  await eventMiddleware(request, response);
  await identityMiddleware(request, response);
  await initMiddleware(request, response);
  await pageViewMiddleware(request, response);
  await miscellaneousRequestedAt(request, response);
  await miscellaneousSoftwareId(request, response);
  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
