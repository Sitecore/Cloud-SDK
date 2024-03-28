// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { event, identity, init as initEvents, pageView } from '@sitecore-cloudsdk/events/server';
import { PersonalizeData, init as initPersonalize, personalize } from '@sitecore-cloudsdk/personalize/server';
import { capturedFetch, capturedRequestBody } from './utils/fetch-wrapper';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Setting cookies on the response
  const response = NextResponse.next();
  const updateMiddleware = '###1###';

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
    updateMiddleware,
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
    await pageView(request, { ...basicEventData, extensionData });
  }

  if (request.nextUrl.pathname.startsWith('/middleware-custom-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-custom' };

    const extensionData = {
      extParam: 'middlewareTest',
    };

    await event(request, { type: 'MIDDLEWARE-CUSTOM', ...basicEventData, extensionData });
  }

  if (request.nextUrl.pathname.startsWith('/middleware-identity-event')) {
    await identity(request, identityEventData);
  }

  if (request.nextUrl.pathname.startsWith('/middleware-personalize-geo')) {
    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    const { geo } = request;

    if (geo) {
      if (request.nextUrl.pathname === '/middleware-personalize-geo') {
        geo.city = 'Athens';
        geo.country = 'GR';
        geo.region = 'I';
      }
      if (request.nextUrl.pathname === '/middleware-personalize-geo-partial') {
        geo.city = 'Athens';
        geo.region = 'I';
      }
      if (request.nextUrl.pathname === '/middleware-personalize-geo-omit') {
        personalizeData.geo = {
          city: 'Tarnów',
          country: 'PL',
          region: '12',
        };
        geo.city = 'Athens';
        geo.region = 'I';
      }
    }

    await initPersonalize(
      {
        sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
        siteName: process.env.SITE_ID || '',
        sitecoreEdgeUrl,
      },
      request,
      response
    );

    const personalizeRes = await personalize(request, personalizeData);
    response.cookies.set('EPRequest', JSON.stringify(personalizeData));
    response.cookies.set('EPResponse', JSON.stringify(personalizeRes));
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

    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    if (request.nextUrl.searchParams?.get('includeUTMParams') === 'true') {
      personalizeData.params = {
        utm: {
          campaign: 'campaign',
          source: 'test',
        },
      };
    }

    const personalizeRes = await personalize(request, personalizeData);

    response.cookies.set('EPRequestUA', capturedFetch.pop() as string);
    response.cookies.set('EPResponse', JSON.stringify(personalizeRes));
    response.cookies.set('EPPersonalizeRequestCookie', capturedRequestBody.pop() as unknown as string);
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/middleware-view-event',
    '/middleware-custom-event',
    '/middleware-identity-event',
    '/personalize',
    '/middleware-server-cookie',
    '/middleware-personalize-geo',
    '/middleware-personalize-geo-partial',
    '/middleware-personalize-geo-no-data',
    '/middleware-personalize-geo-omit',
  ],
};
