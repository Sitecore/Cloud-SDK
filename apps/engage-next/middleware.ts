import { capturedFetch, capturedRequestBody } from './utils/fetch-wrapper';
import { decorateAll, resetAllDecorators } from './utils/e2e-decorators/decorate-all';
import { event, identity, init as initEvents, pageView } from '@sitecore-cloudsdk/events/server';
import { init as initPersonalize, personalize } from '@sitecore-cloudsdk/personalize/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { PersonalizeData } from '@sitecore-cloudsdk/personalize/server';
import { customEventWithSearchDataMiddleware } from './middlewares/custom-event-with-search-data';
import { eventWithSoftwareIDHeaderMiddleware } from './middlewares/event-software-id-header';
import { pageViewEventWithSearchDataMiddleware } from './middlewares/page-view-event-with-search-data';
import { requestedAtMiddleware } from './middlewares/requested-at';

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

  await initEvents(request, response, {
    cookieExpiryDays: 400,
    enableServerCookie,
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: badSitecoreEdgeContextId ?? (process.env.CONTEXT_ID || ''),
    sitecoreEdgeUrl
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let basicEventData: any = {
    updateMiddleware
  };

  const identityEventData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'testMiddleware@test.com',
    identifiers: [{ id: 'testMiddleware@test.com', provider: 'email' }]
  };

  if (request.nextUrl.pathname.startsWith('/middleware-view-event')) {
    if (request.nextUrl.pathname === '/middleware-view-event') {
      basicEventData = { ...basicEventData, page: 'middleware-view' };

      const extensionData = {
        extParam: 'middlewareTest'
      };
      await pageView(request, { ...basicEventData, extensionData });

      response.cookies.set('ViewEventRequestCookie', capturedRequestBody.pop() as unknown as string);
    }
    if (request.nextUrl.pathname === '/middleware-view-event-without-params') {
      await pageView(request);

      response.cookies.set('ViewEventRequestCookie', capturedRequestBody.pop() as unknown as string);
    }
  }

  if (request.nextUrl.pathname.startsWith('/middleware-custom-event')) {
    basicEventData = { ...basicEventData, page: 'middleware-custom' };

    const extensionData = {
      extParam: 'middlewareTest'
    };

    await event(request, { type: 'MIDDLEWARE-CUSTOM', ...basicEventData, extensionData });
  }

  if (request.nextUrl.pathname.startsWith('/middleware-identity-event')) await identity(request, identityEventData);

  if (request.nextUrl.pathname.startsWith('/middleware-personalize-geo')) {
    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
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
          region: '12'
        };
        geo.city = 'Athens';
        geo.region = 'I';
      }
    }

    await initPersonalize(request, response, {
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      sitecoreEdgeUrl
    });

    const personalizeRes = await personalize(request, personalizeData);
    response.cookies.set('EPRequest', JSON.stringify(personalizeData));
    response.cookies.set('EPResponse', JSON.stringify(personalizeRes));
  }

  if (request.nextUrl.pathname.startsWith('/correlation-id')) {
    const testID = request?.nextUrl?.searchParams?.get('testID');

    if (testID === 'sendPersonalizeFromMiddlewareWithCorrelationID') {
      const personalizeData: PersonalizeData = {
        channel: 'WEB',
        currency: 'EUR',
        email: 'test_personalize_callflows@test.com',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      };

      decorateAll(testID);
      await personalize(request, personalizeData);
      resetAllDecorators();
    }
  }

  eventWithSoftwareIDHeaderMiddleware(request);

  if (request.nextUrl.pathname.startsWith('/personalize')) {
    await initPersonalize(request, response, {
      enableServerCookie: request?.nextUrl?.searchParams?.get('personalizeForEnvironment') === 'middleware',
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      sitecoreEdgeUrl
    });

    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test_personalize_callflows@test.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    };

    if (request.nextUrl.searchParams?.get('includeUTMParams') === 'true')
      personalizeData.params = {
        utm: {
          campaign: 'campaign',
          source: 'test'
        }
      };

    const personalizeRes = await personalize(request, personalizeData);

    response.cookies.set('EPRequestUA', capturedFetch.pop() as string);
    response.cookies.set('EPResponse', JSON.stringify(personalizeRes));
    response.cookies.set('EPPersonalizeRequestCookie', capturedRequestBody.pop() as unknown as string);
  }

  await requestedAtMiddleware(request);
  await customEventWithSearchDataMiddleware(request);
  await pageViewEventWithSearchDataMiddleware(request);

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/middleware-view-event',
    '/middleware-view-event-without-params',
    '/middleware-custom-event',
    '/middleware-identity-event',
    '/personalize',
    '/middleware-server-cookie',
    '/middleware-personalize-geo',
    '/middleware-personalize-geo-partial',
    '/middleware-personalize-geo-no-data',
    '/middleware-personalize-geo-omit',
    '/correlation-id',
    '/software-id',
    '/requested-at',
    '/custom-event-with-search-data',
    '/page-view-event-with-search-data'
  ]
};
