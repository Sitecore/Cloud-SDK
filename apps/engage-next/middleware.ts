// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { eventServer, identityServer, initServer, pageViewServer } from '@sitecore-cloudsdk/events';
import { initServer as initPersonalizeServer, personalizeServer } from '@sitecore-cloudsdk/personalize';
import { handleServerCookie } from '@sitecore-cloudsdk/engage-core';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Setting cookies on the response
  const response = NextResponse.next();

  const enableServerCookie =
    request?.nextUrl?.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true' ||
    request.nextUrl.pathname.startsWith('/middleware');

  const badContextId = request?.nextUrl?.searchParams?.get('badContextId') ?? undefined;
  
  await initServer(
    {
      contextId: badContextId ?? (process.env.CONTEXT_ID || ''),
      cookieExpiryDays: 400,
      enableServerCookie,
      siteId: process.env.SITE_ID || '',
    },
    request,
    response
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let basicEventData: any = {
    channel: 'WEB',
    currency: 'EUR',
  };

  const identityEventData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'testMiddleware@test.com',
    identifiers: [{ id: 'testMiddleware@test.com', provider: 'email' }],
  };

  if (
    !request.nextUrl.pathname.startsWith('/about') &&
    !request.nextUrl.pathname.startsWith('/server-side-props') &&
        enableServerCookie
  ) {
    await handleServerCookie(request, response);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-view-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-view' };

    const extensionData = {
      extParam: 'middlewareTest',
    };
    await pageViewServer(basicEventData, request, extensionData);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-custom-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-custom' };

    const extensionData = {
      extParam: 'middlewareTest',
    };

    await eventServer('MIDDLEWARE-CUSTOM', basicEventData, request, extensionData);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-identity-event')) {
    await identityServer(identityEventData, request);
  }

  if (request.nextUrl.pathname.startsWith('/personalize')) {
    await initPersonalizeServer(
      {
        contextId: process.env.CONTEXT_ID || '',
        siteId: process.env.SITE_ID || '',
      },
      request,
      response
    );

    const personalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    };

    const personalizeRes = await personalizeServer(personalizeData, request);

    response.cookies.set('cdpResponse', JSON.stringify(personalizeRes));
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/middleware-view-event', '/middleware-custom-event', '/middleware-identity-event', '/personalize'],
};
