// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { event, identity, init as initEvents, pageView } from '@sitecore-cloudsdk/events/server';
import { init as initPersonalize, personalize } from '@sitecore-cloudsdk/personalize/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Setting cookies on the response
  const response = NextResponse.next();

  const enableServerCookie =
    request?.nextUrl?.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true' ||
    (request.nextUrl.pathname.startsWith('/middleware') &&
      !request.nextUrl.pathname.startsWith('/about') &&
      !request.nextUrl.pathname.startsWith('/server-side-props'));

  const badSitecoreEdgeContextId = request?.nextUrl?.searchParams?.get('badSitecoreEdgeContextId') ?? undefined;
  const sitecoreEdgeUrl = request?.nextUrl?.searchParams?.get('sitecoreEdgeUrl') ?? undefined;

  await initEvents(
    {
      sitecoreEdgeContextId: badSitecoreEdgeContextId ?? (process.env.CONTEXT_ID || ''),
      cookieExpiryDays: 400,
      enableServerCookie,
      sitecoreEdgeUrl,
      siteName: process.env.SITE_ID || '',
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

  if (request.nextUrl.pathname.startsWith('/middleware-view-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-view' };

    const extensionData = {
      extParam: 'middlewareTest',
    };
    await pageView(basicEventData, request, extensionData);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-custom-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-custom' };

    const extensionData = {
      extParam: 'middlewareTest',
    };

    await event('MIDDLEWARE-CUSTOM', basicEventData, request, extensionData);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-identity-event')) {
    await identity(identityEventData, request);
  }

  if (request.nextUrl.pathname.startsWith('/personalize')) {
    await initPersonalize(
      {
        sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeUrl,
      },
      request,
      response
    );

    const personalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    const personalizeRes = await personalize(personalizeData, request);

    response.cookies.set('EPResponse', JSON.stringify(personalizeRes));
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/middleware-view-event', '/middleware-custom-event', '/middleware-identity-event', '/personalize'],
};
